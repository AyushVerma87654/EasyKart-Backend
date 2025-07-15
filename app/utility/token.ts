import { REFRESHTOKEN } from './constant.js'
import jwt from 'jsonwebtoken'
import env from '#start/env'

export const createToken = (id: number, email: string, name: 'refresh_token' | 'access_token') => {
  const expiresIn = name === REFRESHTOKEN ? '7d' : '10s'
  const secret = name === REFRESHTOKEN ? env.get('REFRESH_TOKEN_SECRET') : env.get('JWT_SECRET')
  return jwt.sign({ id, email }, secret, { expiresIn })
}
