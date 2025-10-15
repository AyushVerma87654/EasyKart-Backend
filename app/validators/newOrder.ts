import vine from '@vinejs/vine'

export const newOrderDetailsValidator = vine.compile(
  vine.object({
    totalAmount: vine.number(),
    couponCode: vine.string().optional(),
    paymentMethod: vine.enum(['cod']),
  })
)

export const newOrderItemsValidator = vine.compile(
  vine.object({
    items: vine.array(
      vine.object({
        productId: vine.number(),
        title: vine.string(),
        thumbnail: vine.string(),
        price: vine.number(),
        quantity: vine.number(),
        amount: vine.number(),
      })
    ),
  })
)
