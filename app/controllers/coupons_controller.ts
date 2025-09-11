import Coupon from '#models/coupon'
import type { HttpContext } from '@adonisjs/core/http'

export default class CouponsController {
  public async getCoupons({ response }: HttpContext) {
    const data = await Coupon.query()
    response.json({ responseDetails: { coupons: data } })
  }

  public async getDiscountPercentage({ params, response }: HttpContext) {
    const data = await Coupon.findByOrFail('coupon_code', params.couponCode)
    response.json({ responseDetails: { discountPercentage: data.discountPercentage } })
  }
}
