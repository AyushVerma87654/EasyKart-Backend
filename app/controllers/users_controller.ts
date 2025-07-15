import User from '#models/user'
import { signUpValidator } from '#validators/signup'
import type { HttpContext } from '@adonisjs/core/http'
import jwt, { JwtPayload } from 'jsonwebtoken'
import env from '#start/env'
import { loginValidator } from '#validators/login'
import { createToken } from '../utility/token.js'
import { ACCESSTOKEN, REFRESHTOKEN } from '../utility/constant.js'
import hash from '@adonisjs/core/services/hash'

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
      await User.updateOrCreate({ id: user.id }, { accessToken })
      return response
        .plainCookie('refreshToken', refreshToken, {
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
      await User.updateOrCreate({ id: user.id }, { accessToken, refreshToken })
      return response
        .plainCookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: false,
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        })
        .json({ responseDetails: { user, accessToken } })
    } catch {
      return response.json({ message: 'Invalid Credentials' })
    }
  }

  public async me({ request, response }: HttpContext) {
    const refreshToken = request.body().refreshToken
    try {
      const decoded = jwt.verify(refreshToken, env.get('REFRESH_TOKEN_SECRET')) as JwtPayload
      const accessToken = createToken(decoded.id, decoded.email, ACCESSTOKEN)
      const user = await User.updateOrCreate({ id: decoded.id }, { accessToken })
      return response.json({ responseDetails: { user, accessToken } })
    } catch (error) {
      if (error.name === 'TokenExpiredError') return response.json({ message: 'Token Expired' })
      else if (error.name === 'JsonWebTokenError')
        return response.json({ message: 'Invalid Token' })
      else return response.json({ message: error })
    }
  }

  public async logout({ response }: HttpContext) {
    response.clearCookie('refreshToken', { path: '/login' })
    return response.json({ responseDetails: { message: 'Logged out successfully' } })
  }
}
