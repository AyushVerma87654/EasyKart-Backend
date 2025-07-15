import Product from '#models/product'
import { getAllProductById, getAllProducts } from './api/products.js'

export const fetchAllProducts = async () => {
  const data = await getAllProducts()
  const validatedData = data.products.map((product: any) => validateData(product))

  try {
    await Product.updateOrCreateMany('id', validatedData)
  } catch (error: any) {
    console.log(error)
  }
}

export const fetchProductById = async () => {
  const data = await getAllProductById(1)
  const validatedData = validateData(data)

  try {
    await Product.updateOrCreate(
      { id: validatedData.id },
      {
        ...validatedData,
      }
    )
  } catch (error: any) {
    console.log(error)
  }
}

const validateData = (data: any) => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    price: data.price,
    discountPercentage: data.discountPercentage,
    rating: data.rating,
    stock: data.stock,
    tags: data.tags,
    brand: data.brand,
    sku: data.sku,
    weight: data.weight,
    width: data.dimensions.width,
    height: data.dimensions.height,
    depth: data.dimensions.depth,
    warrantyInformation: data.warrantyInformation,
    shippingInformation: data.shippingInformation,
    availabilityStatus: data.availabilityStatus,
    reviews: JSON.stringify(
      data.reviews.map((review: any) => ({
        rating: review.rating,
        comment: review.comment,
        date: review.date,
        reviewerName: review.reviewerName,
        reviewerEmail: review.reviewerEmail,
      }))
    ),
    returnPolicy: data.returnPolicy,
    minimumOrderQuantity: data.minimumOrderQuantity,
    metaCreatedAt: data.meta.createdAt,
    metaUpdatedAt: data.meta.updatedAt,
    barcode: data.meta.barcode,
    qrCode: data.meta.qrCode,
    images: data.images,
    thumbnail: data.thumbnail,
  }
}
