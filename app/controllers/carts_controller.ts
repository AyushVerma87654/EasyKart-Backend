import Cart from '#models/cart'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class CartsController {
  public async updateCart({ request, response }: HttpContext) {
    try {
      const user = await User.findByOrFail('email', request.body().email)
      try {
        const cart = await Cart.findByOrFail('userId', user.id)
        console.log('cart', cart)
        const newItem = {
          productId: request.body().id,
          price: request.body().price,
          quantity: request.body().quantity,
          amount: request.body().price * request.body().quantity,
        }
        const newItems =
          cart.items[newItem.productId].quantity > 0
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
        const newCart = { ...cart, totalAmount: cart.totalAmount + newItem.amount, items: newItems }

        await Cart.updateOrCreate({ userId: user.id }, newCart)
        console.log('cart', cart)
        return response.json({
          responseDetails: { message: 'Data Updated Successfully 2', cart: newCart },
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
        const cart = await Cart.updateOrCreate({ userId: user.id }, newCart)
        console.log('cart', cart)
        return response.json({
          responseDetails: { message: 'Data Updated Successfully', cart },
        })
      }
    } catch (error) {
      return response.json({ responseDetails: { error } })
    }
  }
}
