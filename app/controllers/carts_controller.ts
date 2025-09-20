import Cart, { CartItem } from '#models/cart'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class CartsController {
  public async updateCart({ request, response }: HttpContext) {
    try {
      const user = await User.findByOrFail('email', request.body().email)
      try {
        const cart = (await Cart.findByOrFail('userId', user.id)).toJSON()
        console.log('cart1', cart)
        const newItem: CartItem = {
          productId: request.body().id,
          price: request.body().price,
          quantity: request.body().quantity,
          amount: request.body().price * request.body().quantity,
        }
        console.log('newItem', newItem)
        const newItems: { [x: number]: CartItem } =
          cart.items?.[newItem.productId]?.quantity > 0
            ? {
                ...cart.items,
                [newItem.productId]: {
                  productId: newItem.productId,
                  quantity: cart.items[newItem.productId].quantity + newItem.quantity,
                  price: newItem.price,
                  amount: cart.items[newItem.productId].amount + newItem.amount,
                },
              }
            : { ...cart.items, [newItem.productId]: newItem }
        console.log('newItems', newItems)
        const newCart = { ...cart, totalAmount: cart.totalAmount + newItem.amount, items: newItems }
        console.log('newCart', newCart)

        await Cart.updateOrCreate({ userId: user.id }, newCart)
        console.log('cart2', cart)
        return response.json({
          responseDetails: { message: 'Data Updated Successfully 2', cart: newCart.items },
        })
      } catch (error) {
        const newItem = {
          productId: request.body().id,
          price: request.body().price,
          quantity: request.body().quantity,
          amount: request.body().price * request.body().quantity,
        }
        const newCart = {
          totalAmount: newItem.amount,
          items: { [newItem.productId]: newItem },
        }
        const cart = await Cart.updateOrCreate({ userId: user.id }, newCart.items)
        console.log('cart3', cart)
        return response.json({
          responseDetails: { message: 'Data Updated Successfully', cart },
        })
      }
    } catch (error) {
      console.log('errror4', error)
      return response.json({ responseDetails: { error } })
    }
  }
}
