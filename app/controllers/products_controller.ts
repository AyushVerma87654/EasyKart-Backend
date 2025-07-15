import Product from '#models/product'
import type { HttpContext } from '@adonisjs/core/http'
// import { fetchAllProducts } from '../fetchData/fetchData.js'

export default class ProductsController {
  public async getAllProducts({ response }: HttpContext) {
    const savedData = await Product.query()
    const data = savedData.map((product) => {
      const plain = product.toJSON()
      return { ...plain, reviews: JSON.parse(product.reviews) }
    })
    return response.json({ responseDetails: { products: data } })
    // fetchAllProducts()
  }

  public async getProductById({ params, response }: HttpContext) {
    const savedData = await Product.findByOrFail('id', params.id)
    return response.json({ responseDetails: { product: savedData } })
  }
}
