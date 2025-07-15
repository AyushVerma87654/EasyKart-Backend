import Coupon from '#models/coupon'
import type { HttpContext } from '@adonisjs/core/http'

export default class CouponsController {
  public async getDiscountPercentage({ params, response }: HttpContext) {
    console.log('coupon', params.couponCode)
    const data = await Coupon.findByOrFail('coupon_code', params.couponCode)
    response.json({ responseDetails: { discountPercentage: data.discountPercentage } })
  }
}
