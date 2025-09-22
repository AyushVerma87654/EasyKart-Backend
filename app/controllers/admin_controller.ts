import type { HttpContext } from '@adonisjs/core/http'
import { fetchAllProducts, saveCouponTableData } from '../fetchData/fetchData.js'

export default class AdminController {
  public async updateData({ response }: HttpContext) {
    try {
      await fetchAllProducts()
      await saveCouponTableData()
      return response.json({ responseDetails: { message: 'Data Updated Successfully' } })
    } catch (error) {
      return response.json({ responseDetails: { error } })
    }
  }
}
