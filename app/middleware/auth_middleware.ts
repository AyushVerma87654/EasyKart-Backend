import User from '#models/user'
import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import jwt, { JwtPayload } from 'jsonwebtoken'

export default class AuthMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    const authHeader = request.header('Authorization')
    if (!authHeader) {
      return response.unauthorized({ message: 'No token provided' })
    }
    const token = authHeader.replace('Bearer ', '')
    try {
      const decoded = jwt.verify(token, env.get('JWT_SECRET')) as JwtPayload
      request.authUser = await User.findByOrFail({ id: decoded.id })
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') return response.json({ message: 'Token Expired' })
      else if (error.name === 'JsonWebTokenError')
        return response.json({ message: 'Invalid Token' })
      else return response.json({ message: error })
    }
    const output = await next()
    return output
  }
}
