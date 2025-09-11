export const ACCESSTOKEN = 'access_token'
export const REFRESHTOKEN = 'refresh_token'
export const VERIFYEMAILSUBJECT = 'Verify your email'
export const verifyEmailContent = (verificationCode: string) =>
  `Your verification code is ${verificationCode}`
export const LIMIT = 15
