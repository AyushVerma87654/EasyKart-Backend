import { OrderStatus } from '#models/order'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').notNullable()
      table.string('order_reference').notNullable()
      table.decimal('total_amount', 10, 2).notNullable()
      table.integer('discount_percentage').nullable()
      table.decimal('discount_amount', 10, 2).nullable()
      table.decimal('final_amount', 10, 2).notNullable()
      table.string('coupon_code').nullable()
      table.string('payment_method').notNullable()
      table.enum('status', Object.values(OrderStatus)).notNullable().defaultTo('PENDING')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
