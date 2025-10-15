import type { HttpContext } from '@adonisjs/core/http'
import Order, { OrderStatus } from '#models/order'
import OrderItem from '#models/order_item'
import { newOrderDetailsValidator, newOrderItemsValidator } from '#validators/newOrder'
import Coupon from '#models/coupon'

export default class OrdersController {
  public async placeOrder({ request, response }: HttpContext) {
    const user = request.authUser
    if (!user) {
      return response.unauthorized({ message: 'User not authenticated' })
    }
    try {
      const validatedOrderDetails = await request.validateUsing(newOrderDetailsValidator)
      const validatedOrderItems = await request.validateUsing(newOrderItemsValidator)
      let discountPercentage = 0
      if (validatedOrderDetails.couponCode) {
        const coupon = await Coupon.findByOrFail({ couponCode: validatedOrderDetails.couponCode })
        if (coupon.isActive) discountPercentage = coupon.discountPercentage ?? 0
      }
      const discountAmount = (discountPercentage / 100) * validatedOrderDetails.totalAmount
      const finalAmount = validatedOrderDetails.totalAmount - discountAmount
      const order = (
        await Order.create({
          userId: user.id,
          totalAmount: validatedOrderDetails.totalAmount,
          discountPercentage: discountPercentage,
          discountAmount: discountAmount,
          finalAmount: finalAmount,
          couponCode: validatedOrderDetails.couponCode,
          paymentMethod: validatedOrderDetails.paymentMethod,
          status: OrderStatus.PENDING,
        })
      ).toJSON()
      const items = await Promise.all(
        validatedOrderItems.items.map((item) =>
          OrderItem.create({
            orderId: order.id,
            productId: item.productId,
            title: item.title,
            thumbnail: item.thumbnail,
            price: item.price,
            quantity: item.quantity,
            amount: item.amount,
          })
        )
      )
      return response.status(201).json({ responseDetails: { order: { ...order, items } } })
    } catch (error: any) {
      return response
        .status(400)
        .json({ responseDetails: { error: error.messages || error.message } })
    }
  }

  public async fetchOrder({ request, response }: HttpContext) {
    try {
      const user = request.authUser
      if (!user) {
        return response.unauthorized({ message: 'User not authenticated' })
      }
      const orders = await Order.query().where('userId', user.id).preload('items')
      return response.json({ responseDetails: { orders } })
    } catch (error: any) {
      return response
        .status(400)
        .json({ responseDetails: { error: error.messages || error.message } })
    }
  }
}
