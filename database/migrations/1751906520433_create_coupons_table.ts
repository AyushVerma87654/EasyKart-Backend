import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateCouponsTable extends BaseSchema {
  protected tableName = 'coupons'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('coupon_code').unique()
      table.integer('discount_percentage')
      table.string('image_url')
      table.timestamp('expires_at')
      table.boolean('is_active')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
