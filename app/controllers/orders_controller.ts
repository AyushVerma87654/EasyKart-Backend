// import type { HttpContext } from '@adonisjs/core/http'
// import Order, { OrderStatus } from '#models/order'
// import OrderItem from '#models/order_item'
// import { newOrderDetailsValidator, newOrderItemsValidator } from '#validators/newOrder'
// import Coupon from '#models/coupon'
// import Cart from '#models/cart'

// export default class OrdersController {
//   public async placeOrder({ request, response }: HttpContext) {
//     const user = request.authUser
//     if (!user) {
//       return response.unauthorized({ message: 'User not authenticated' })
//     }
//     try {
//       const validatedOrderDetails = await request.validateUsing(newOrderDetailsValidator)
//       const validatedOrderItems = await request.validateUsing(newOrderItemsValidator)
//       const isOrdered = await Order.findBy({
//         orderReference: validatedOrderDetails.orderReference,
//       })
//       if (isOrdered && isOrdered.userId > 0)
//         return response.json({ responseDetails: { message: 'Order already placed' } })
//       let discountPercentage = 0
//       if (validatedOrderDetails.couponCode) {
//         const coupon = await Coupon.findByOrFail({ couponCode: validatedOrderDetails.couponCode })
//         if (coupon.isActive) discountPercentage = coupon.discountPercentage ?? 0
//       }
//       const discountAmount = (discountPercentage / 100) * validatedOrderDetails.totalAmount
//       const finalAmount = validatedOrderDetails.totalAmount - discountAmount
//       const order = (
//         await Order.create({
//           userId: user.id,
//           orderReference: validatedOrderDetails.orderReference,
//           totalAmount: validatedOrderDetails.totalAmount,
//           discountPercentage: discountPercentage,
//           discountAmount: discountAmount,
//           finalAmount: finalAmount,
//           couponCode: validatedOrderDetails.couponCode,
//           paymentMethod: validatedOrderDetails.paymentMethod,
//           status: OrderStatus.PENDING,
//         })
//       ).toJSON()
//       const items = await Promise.all(
//         validatedOrderItems.items.map((item) =>
//           OrderItem.create({
//             orderId: order.id,
//             productId: item.productId,
//             title: item.title,
//             thumbnail: item.thumbnail,
//             price: item.price,
//             quantity: item.quantity,
//             amount: item.amount,
//           })
//         )
//       )
//       await Cart.updateOrCreate({ userId: user.id }, { items: {}, totalAmount: 0 })
//       return response.status(201).json({ responseDetails: { order: { ...order, items } } })
//     } catch (error: any) {
//       return response
//         .status(400)
//         .json({ responseDetails: { error: error.messages || error.message } })
//     }
//   }

//   public async fetchOrder({ request, response }: HttpContext) {
//     try {
//       const user = request.authUser
//       if (!user) {
//         return response.unauthorized({ message: 'User not authenticated' })
//       }
//       const orders = await Order.query().where('userId', user.id).preload('items')
//       return response.json({ responseDetails: { orders } })
//     } catch (error: any) {
//       return response
//         .status(400)
//         .json({ responseDetails: { error: error.messages || error.message } })
//     }
//   }

import type { HttpContext } from '@adonisjs/core/http'
import Order, { OrderStatus } from '#models/order'
import OrderItem from '#models/order_item'
import { newOrderDetailsValidator, newOrderItemsValidator } from '#validators/newOrder'
import Coupon from '#models/coupon'
import Cart from '#models/cart'
import Stripe from 'stripe'
import env from '#start/env'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export default class OrdersController {
  public async placeOrder({ request, response }: HttpContext) {
    const user = request.authUser
    if (!user) return response.unauthorized({ message: 'User not authenticated' })

    try {
      const validatedOrderDetails = await request.validateUsing(newOrderDetailsValidator)
      const validatedOrderItems = await request.validateUsing(newOrderItemsValidator)

      const isOrdered = await Order.findBy({
        orderReference: validatedOrderDetails.orderReference,
      })

      if (isOrdered && isOrdered.userId > 0) {
        return response.json({ responseDetails: { message: 'Order already placed' } })
      }
      let discountPercentage = 0
      if (validatedOrderDetails.couponCode) {
        const coupon = await Coupon.findByOrFail({
          couponCode: validatedOrderDetails.couponCode,
        })
        if (coupon.isActive) discountPercentage = coupon.discountPercentage ?? 0
      }
      const discountAmount = (discountPercentage / 100) * validatedOrderDetails.totalAmount
      const finalAmount = validatedOrderDetails.totalAmount - discountAmount

      const order = await Order.create({
        userId: user.id,
        orderReference: validatedOrderDetails.orderReference,
        totalAmount: validatedOrderDetails.totalAmount,
        discountPercentage,
        discountAmount,
        finalAmount,
        couponCode: validatedOrderDetails.couponCode,
        paymentMethod: validatedOrderDetails.paymentMethod,
        status: OrderStatus.PENDING,
      })
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

      await Cart.updateOrCreate({ userId: user.id }, { items: {}, totalAmount: 0 })
      return response.status(201).json({
        responseDetails: {
          order: { ...order.toJSON(), items },
        },
      })
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

  public async paymentCheckout({ request, response }: HttpContext) {
    try {
      const validatedOrderItems = await request.validateUsing(newOrderItemsValidator)
      const lineItems = validatedOrderItems.items.map((item) => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: item.title,
            images: item.thumbnail ? [item.thumbnail] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }))
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: 'https://ayushverma.netlify.app/payment/success',
        cancel_url: 'https://ayushverma.netlify.app/payment/cancel',

        metadata: {
          orderId: request.body().id.toString(),
        },
      })
      return response.json({ responseDetails: { url: session.url } })
    } catch (error: any) {
      return response
        .status(400)
        .json({ responseDetails: { error: error.messages || error.message } })
    }
  }

  public async stripeWebhook({ request, response }: HttpContext) {
    const sig = request.header('stripe-signature')
    let event
    try {
      event = stripe.webhooks.constructEvent(request.raw()!, sig!, env.get('STRIPE_WEBHOOK_SECRET'))
    } catch (err: any) {
      return response.badRequest('Invalid signature')
    }
    const session = event.data.object as any
    const orderId = session.metadata.orderId
    if (event.type === 'checkout.session.completed') {
      const order = await Order.find(orderId)
      if (!order) return response.notFound('Order not found')
      order.status = OrderStatus.PAID
      await order.save()
      return response.json({
        responseDetails: {
          order,
          message: "We've received your payment. Your order is now being processed.",
        },
      })
    }
    return response.json({
      responseDetails: {
        orderId,
        message: 'Payment not received. Please try again or use a different payment method.',
      },
    })
  }
}
