import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { type HasMany } from '@adonisjs/lucid/types/relations'
import OrderItem from './order_item.js'

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare orderReference: string

  @column()
  declare totalAmount: number

  @column()
  declare discountPercentage?: number

  @column()
  declare discountAmount?: number

  @column()
  declare finalAmount: number

  @column()
  declare couponCode?: string

  @column()
  declare paymentMethod: string

  @column()
  declare status: OrderStatus

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => OrderItem)
  declare items: HasMany<typeof OrderItem>
}
