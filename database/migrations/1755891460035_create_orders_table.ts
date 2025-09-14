import { OrderStatus } from '#models/order'
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateOrdersTable extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.json('items').notNullable()
      table.decimal('total_amount', 10, 2).notNullable()
      table.enum('status', Object.values(OrderStatus)).defaultTo(OrderStatus.PENDING)
      table.string('coupon_code').nullable()
      table.decimal('discount_amount', 10, 2).defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
