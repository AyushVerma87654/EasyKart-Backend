import vine from '@vinejs/vine'

export const resetPasswordValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string(),
  })
)
