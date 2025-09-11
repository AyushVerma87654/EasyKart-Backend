import vine from '@vinejs/vine'

export const verifyCodeValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    verificationCode: vine.string(),
  })
)
