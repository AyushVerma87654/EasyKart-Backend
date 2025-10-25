import Cart from '#models/cart'
import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'

export default class CartsController {
  public async editCart({ request, response }: HttpContext) {
    const user = request.authUser
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }
    try {
      const cart = (await Cart.findByOrFail('userId', user.id)).toJSON()
      const productId = request.body().id
      const quantity = request.body().quantity
      const product = await Product.findBy({ id: productId })
      if (!product) {
        return response.unauthorized({
          responseDetails: { message: 'Invalid Product Id' },
        })
      }
      const newItemAmount = product.price * quantity
      const prevQuantity = cart.items?.[productId] ?? 0
      const newItems = {
        ...cart.items,
        [productId]: prevQuantity + quantity,
      }
      const newCart = {
        totalAmount: cart.totalAmount + newItemAmount,
        items: newItems,
      }
      await Cart.updateOrCreate({ userId: user.id }, newCart)
      return response.json({
        responseDetails: {
          cart: newCart.items,
        },
      })
    } catch (error) {
      const productId = request.body().id
      const quantity = request.body().quantity
      const product = await Product.findBy({ id: productId })
      if (!product) {
        return response.unauthorized({
          responseDetails: { message: 'Invalid Product Id' },
        })
      }
      const newCart = {
        totalAmount: product.price * quantity,
        items: { [productId]: quantity },
      }
      const cart = await Cart.updateOrCreate({ userId: user.id }, newCart)
      return response.json({
        responseDetails: {
          cart: cart.items,
        },
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
        responseDetails: { cart: cart.items },
      })
    } catch (error) {
      console.log('errror4', error)
      return response.json({ responseDetails: { error } })
    }
  }
}
