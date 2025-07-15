import vine from '@vinejs/vine'

export const signUpValidator = vine.compile(
  vine.object({
    fullName: vine.string(),
    userName: vine.string(),
    email: vine.string().email(),
    password: vine.string(),
  })
)
