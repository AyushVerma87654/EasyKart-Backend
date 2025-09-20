import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare description: string

  @column()
  declare category: string

  @column({
    prepare: (value: number) => JSON.stringify(value), // save as string
    consume: (value: string) => JSON.parse(value), // read as number
  })
  declare price: number

  @column({ columnName: 'discount_percentage' })
  declare discountPercentage: number

  @column()
  declare rating: number

  @column()
  declare stock: number

  @column()
  declare tags: string[]

  @column()
  declare brand: string

  @column()
  declare sku: string

  @column()
  declare weight: number

  @column()
  declare width: number

  @column()
  declare height: number

  @column()
  declare depth: number

  @column({ columnName: 'warranty_information' })
  declare warrantyInformation: string

  @column({ columnName: 'shipping_information' })
  declare shippingInformation: string

  @column({ columnName: 'availability_status' })
  declare availabilityStatus: string

  @column({
    prepare: (value: object) => JSON.stringify(value), // save as string
    consume: (value: string) => JSON.parse(value), // read as object
  })
  declare reviews: string

  @column({ columnName: 'return_policy' })
  declare returnPolicy: string

  @column({ columnName: 'minimum_order_quantity' })
  declare minimumOrderQuantity: number

  @column({ columnName: 'meta_created_at' })
  declare metaCreatedAt: Date

  @column({ columnName: 'meta_updated_at' })
  declare metaUpdatedAt: Date

  @column()
  declare barcode: string

  @column({ columnName: 'qr_code' })
  declare qrCode: string

  @column()
  declare images: string[]

  @column()
  declare thumbnail: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
