import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
import { LIMIT } from '../utility/constant.js'

export default class ProductsController {
  public async getAllProducts({ request, response }: HttpContext) {
    const page = request.body().page
    const query = request.body().query
    const sortBy = request.body().sortBy
    const sortType = request.body().sortType
    try {
      let productQuery = Product.query()

      // 🔎 Search filter
      if (query) {
        productQuery = productQuery.where((builder) => {
          builder
            .where('title', 'like', `%${query}%`)
            .orWhere('category', 'like', `%${query}%`)
            .orWhere('sku', 'like', `%${query}%`)
        })
      }

      const savedData = await productQuery.orderBy(sortBy, sortType).paginate(page, LIMIT)
      return response.json({
        responseDetails: { products: savedData.toJSON().data, metaData: savedData.getMeta() },
      })
    } catch (error) {
      return response.json({ responseDetails: { message: "Didn't Find any Products" } })
    }
  }

  public async getProductById({ request, response }: HttpContext) {
    try {
      const savedData = await Product.findByOrFail('id', request.body().id)
      return response.json({ responseDetails: { product: savedData } })
    } catch (error) {
      return response.json({ responseDetails: { message: "Didn't Find the Product" } })
    }
  }
}
