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

  @column()
  declare price: number

  @column()
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

  @column()
  declare warrantyInformation: string

  @column()
  declare shippingInformation: string

  @column()
  declare availabilityStatus: string

  @column()
  declare reviews: any[]

  @column()
  declare returnPolicy: string

  @column()
  declare minimumOrderQuantity: number

  @column()
  declare metaCreatedAt: Date

  @column()
  declare metaUpdatedAt: Date

  @column()
  declare barcode: string

  @column()
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
