import Cart, { CartItem } from '#models/cart'
import type { HttpContext } from '@adonisjs/core/http'

export default class CartsController {
  public async editCart({ request, response }: HttpContext) {
    const user = request.authUser
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }
    try {
      const cart = (await Cart.findByOrFail('userId', user.id)).toJSON()
      const newItem: CartItem = {
        productId: request.body().id,
        price: request.body().price,
        quantity: request.body().quantity,
        amount: request.body().price * request.body().quantity,
      }
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
      const newCart = { ...cart, totalAmount: cart.totalAmount + newItem.amount, items: newItems }
      await Cart.updateOrCreate({ userId: user.id }, newCart)
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
      const cart = await Cart.updateOrCreate({ userId: user.id }, newCart)
      return response.json({
        responseDetails: { message: 'Data Updated Successfully', cart },
      })
    }
  }

  public async deleteCartItem({ request, response }: HttpContext) {
    try {
      const user = request.authUser
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }
      const cart = await Cart.findByOrFail('userId', user.id)
      const productId: number = request.body().id
      const items = cart.items
      delete items[productId]
      cart.items = items
      await cart.save()
      return response.json({
        responseDetails: { message: 'Data Updated Successfully 2', cart: cart.items },
      })
    } catch (error) {
      console.log('errror4', error)
      return response.json({ responseDetails: { error } })
    }
  }
}
