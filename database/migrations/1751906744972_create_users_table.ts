import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateUsersTable extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('full_name')
      table.string('user_name')
      table.string('email').unique()
      table.string('password')
      table.string('access_token')
      table.string('refresh_token')
      table.boolean('is_verified')
      table.boolean('is_updating_profile')
      table.string('verification_code')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
