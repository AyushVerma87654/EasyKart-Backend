import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title')
      table.text('description')
      table.string('category')
      table.decimal('price', 10, 2)
      table.decimal('discount_percentage', 5, 2)
      table.decimal('rating', 3, 2)
      table.integer('stock')
      table.specificType('tags', 'text[]')
      table.string('brand')
      table.string('sku')
      table.float('weight')
      table.float('width')
      table.float('height')
      table.float('depth')
      table.string('warranty_information')
      table.text('shipping_information')
      table.string('availability_status')
      table.text('reviews')
      table.string('return_policy')
      table.integer('minimum_order_quantity')
      table.timestamp('meta_created_at')
      table.timestamp('meta_updated_at')
      table.string('barcode')
      table.string('qr_code')
      table.specificType('images', 'text[]')
      table.string('thumbnail')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
