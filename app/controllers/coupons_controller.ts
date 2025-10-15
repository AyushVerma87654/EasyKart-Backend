import Coupon from '#models/coupon'
import type { HttpContext } from '@adonisjs/core/http'

export default class CouponsController {
  public async getCoupons({ response }: HttpContext) {
    try {
      const activeCoupons = await Coupon.query().where('is_active', true)
      response.json({ responseDetails: { coupons: activeCoupons } })
    } catch (error) {
      response.json({ responseDetails: { error } })
    }
  }

  public async getDiscountPercentage({ params, response }: HttpContext) {
    try {
      const data = await Coupon.findByOrFail('coupon_code', params.couponCode)
      if (data.isActive)
        response.ok({ responseDetails: { discountPercentage: data.discountPercentage } })
      else response.unauthorized({ responseDetails: { message: 'Coupon is not active' } })
    } catch (error) {
      response.unauthorized({ error })
    }
  }
}
