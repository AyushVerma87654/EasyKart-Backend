import Coupon from '#models/coupon'
import Product from '#models/product'
import { getAllProductById, getAllProducts } from './api/products.js'
import { DateTime } from 'luxon'

export const fetchAllProducts = async () => {
  const data = await getAllProducts()
  const validatedData = data.products.map((product: any) => validateData(product))
  console.log('validatedData', validatedData[0])
  console.log('type', typeof validatedData[0].price)
  try {
    await Product.updateOrCreateMany('id', validatedData)

    return data.total
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

export const saveCouponTableData = async () => {
  try {
    const data = await Coupon.updateOrCreateMany('couponCode', couponTableData)
    console.log('data', data)
  } catch (error) {
    console.log('error at coupons', error)
  }
}

const validateData = (data: any) => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    price: Number(data.price),
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

export const couponTableData = [
  {
    couponCode: 'WELCOME10',
    discountPercentage: 10,
    expiresAt: DateTime.fromISO('2025-12-31T23:59:59'),
    isActive: true,
  },
  {
    couponCode: 'FESTIVE25',
    discountPercentage: 25,
    expiresAt: DateTime.fromISO('2025-11-15T23:59:59'),
    isActive: true,
  },
  {
    couponCode: 'SUMMER15',
    discountPercentage: 15,
    expiresAt: DateTime.fromISO('2025-09-30T23:59:59'),
    isActive: true,
  },
  {
    couponCode: 'FLASH50',
    discountPercentage: 50,
    expiresAt: DateTime.fromISO('2025-08-31T23:59:59'),
    isActive: false,
  },
  {
    couponCode: 'DIWALI20',
    discountPercentage: 20,
    expiresAt: DateTime.fromISO('2025-11-10T23:59:59'),
    isActive: true,
  },
  {
    couponCode: 'NEWUSER30',
    discountPercentage: 30,
    expiresAt: DateTime.fromISO('2026-01-01T23:59:59'),
    isActive: true,
  },
  {
    couponCode: 'FREESHIP',
    discountPercentage: 5,
    expiresAt: DateTime.fromISO('2025-12-31T23:59:59'),
    isActive: true,
  },
  {
    couponCode: 'WEEKEND40',
    discountPercentage: 40,
    expiresAt: DateTime.fromISO('2025-09-15T23:59:59'),
    isActive: false,
  },
  {
    couponCode: 'LOYALTY35',
    discountPercentage: 35,
    expiresAt: DateTime.fromISO('2025-10-31T23:59:59'),
    isActive: true,
  },
  {
    couponCode: 'SPRING22',
    discountPercentage: 22,
    expiresAt: DateTime.fromISO('2025-09-20T23:59:59'),
    isActive: true,
  },
]
