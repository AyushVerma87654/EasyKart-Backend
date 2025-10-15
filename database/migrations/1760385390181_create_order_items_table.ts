import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'order_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('order_id')
        .unsigned()
        .references('id')
        .inTable('orders')
        .onDelete('CASCADE')
        .notNullable()
      table.integer('product_id').unsigned().notNullable()
      table.string('title').notNullable()
      table.decimal('price', 10, 2).notNullable()
      table.integer('quantity').notNullable()
      table.decimal('amount', 10, 2).notNullable()
      table.string('thumbnail').notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
