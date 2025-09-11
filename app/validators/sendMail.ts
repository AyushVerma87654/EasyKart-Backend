import vine from '@vinejs/vine'

export const sendMailValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
  })
)
