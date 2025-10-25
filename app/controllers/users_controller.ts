import User from '#models/user'
import { signUpValidator } from '#validators/signup'
import type { HttpContext } from '@adonisjs/core/http'
import jwt, { JwtPayload } from 'jsonwebtoken'
import env from '#start/env'
import { loginValidator } from '#validators/login'
import { createToken } from '../utility/token.js'
import {
  ACCESSTOKEN,
  REFRESHTOKEN,
  verifyEmailContent,
  VERIFYEMAILSUBJECT,
} from '../utility/constant.js'
import hash from '@adonisjs/core/services/hash'
import { sendMailValidator } from '#validators/sendMail'
import { generateVerificationCode } from '../utility/generateVerificationCode.js'
import mail from '@adonisjs/mail/services/main'
import { verifyCodeValidator } from '#validators/verifyCode'
import { resetPasswordValidator } from '#validators/resetPassword'

export default class UsersController {
  public async signup({ request, response }: HttpContext) {
    const validatedData = await request.validateUsing(signUpValidator)
    try {
      await User.findByOrFail('email', validatedData.email)
      return response.json({ message: 'Email Already Registered' })
    } catch {
      const hashedPassword = await hash.make(validatedData.password)
      const user = await User.create({
        fullName: validatedData.fullName,
        userName: validatedData.userName,
        email: validatedData.email,
        password: hashedPassword,
        isVerified: false,
      })
      const refreshToken = createToken(user.id, user.email, REFRESHTOKEN)
      const accessToken = createToken(user.id, user.email, ACCESSTOKEN)
      await User.updateOrCreate({ id: user.id }, { refreshToken })
      return response
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        })
        .json({ responseDetails: { user, accessToken } })
    }
  }

  public async login({ request, response }: HttpContext) {
    const validatedData = await request.validateUsing(loginValidator)
    try {
      const user = await User.findByOrFail('email', validatedData.email)
      const isMatch = await hash.verify(user.password, validatedData.password)
      if (!isMatch) return response.json({ message: 'Invalid Credentials' })
      const refreshToken = createToken(user.id, user.email, REFRESHTOKEN)
      const accessToken = createToken(user.id, user.email, ACCESSTOKEN)
      await User.updateOrCreate({ id: user.id }, { refreshToken })
      try {
        await user.load('cart')
      } catch {}
      return response
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        })
        .json({ responseDetails: { user, accessToken } })
    } catch {
      return response.json({ message: 'Invalid Credentials' })
    }
  }

  public async me({ request, response }: HttpContext) {
    const refreshToken = request.cookie('refreshToken')
    if (!refreshToken) {
      return response.status(401).json({ message: 'No refresh token provided' })
    }
    try {
      const decoded = jwt.verify(refreshToken, env.get('REFRESH_TOKEN_SECRET')) as JwtPayload
      const accessToken = createToken(decoded.id, decoded.email, ACCESSTOKEN)
      const user = await User.findByOrFail({ id: decoded.id })
      try {
        await user.load('cart')
      } catch {}
      return response.json({ responseDetails: { user, accessToken } })
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') return response.json({ message: 'Token Expired' })
      else if (error.name === 'JsonWebTokenError')
        return response.json({ message: 'Invalid Token' })
      else return response.json({ message: error })
    }
  }

  public async logout({ response }: HttpContext) {
    return response
      .clearCookie('refreshToken', { path: '/' })
      .json({ responseDetails: { message: 'Logged out successfully' } })
  }

  public async deleteAccount({ request, response }: HttpContext) {
    try {
      const user = request.authUser
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }
      await user.delete()
      return response
        .clearCookie('refreshToken', { path: '/' })
        .json({ responseDetails: { message: 'User Deleted Successfully' } })
    } catch (err) {
      return response.json({ responseDetails: { message: 'Email is not registered' } })
    }
  }

  public async sendMail({ request, response }: HttpContext) {
    const validatedData = await request.validateUsing(sendMailValidator)
    console.log('validatedData.email', validatedData.email)
    try {
      const user = await User.findByOrFail('email', validatedData.email)
      const verificationCode = generateVerificationCode()
      console.log('verificationCode', verificationCode)
      try {
        await mail.send((message) => {
          message
            .to(request.body().email)
            .subject(VERIFYEMAILSUBJECT)
            .text(verifyEmailContent(verificationCode))
        })
        console.log('email. sent')
        await User.updateOrCreate(
          { email: user.email },
          { isUpdatingProfile: true, verificationCode }
        )
        return response.json({
          responseDetails: { message: 'Verification Code Sent in your registered Email' },
        })
      } catch (error) {
        return response.status(500).json({ error: 'Failed to save verification code in database' })
      }
    } catch (error) {
      return response.json({ message: 'Email is not registered' })
    }
  }

  public async codeVerification({ request, response }: HttpContext) {
    const validatedData = await request.validateUsing(verifyCodeValidator)
    try {
      const user = await User.findByOrFail('email', validatedData.email)
      if (user.isUpdatingProfile && user.verificationCode === validatedData.verificationCode) {
        try {
          const refreshToken = createToken(user.id, user.email, REFRESHTOKEN)
          const accessToken = createToken(user.id, user.email, ACCESSTOKEN)
          await User.updateOrCreate(
            { email: user.email },
            { refreshToken, isUpdatingProfile: false, verificationCode: '' }
          )
          return response
            .cookie('refreshToken', refreshToken, {
              httpOnly: true,
              sameSite: 'lax',
              secure: false,
              path: '/',
              maxAge: 60 * 60 * 24 * 7,
            })
            .json({ responseDetails: { message: 'Code Verified', accessToken } })
        } catch (error) {
          return response
            .status(500)
            .json({ error: 'Failed to save verification code in database' })
        }
      } else {
        return user.verificationCode === validatedData.verificationCode
          ? response.redirect('/')
          : response.json({ message: 'Verification Failed' })
      }
    } catch (error) {
      return response.json({ message: 'Email is not registered' })
    }
  }

  public async resetPassword({ request, response }: HttpContext) {
    const validatedData = await request.validateUsing(resetPasswordValidator)
    try {
      const user = request.authUser
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }
      const hashPassword = await hash.make(validatedData.password)
      user.password = hashPassword
      await user.save()
      return response.json({
        responseDetails: {
          message: 'Password Changed Successfully',
          user,
        },
      })
    } catch (error) {
      return response.json({ error })
    }
  }

  public async updateProfile({ request, response }: HttpContext) {
    try {
      const user = request.authUser
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }
      const userProfile = request.body()
      user.fullName = userProfile.fullName ?? user.fullName
      user.userName = userProfile.userName ?? user.userName
      await user.save()
      return response.json({
        responseDetails: {
          fullName: user.fullName,
          userName: user.userName,
        },
      })
    } catch (error) {
      return response.json({ error })
    }
  }
}
