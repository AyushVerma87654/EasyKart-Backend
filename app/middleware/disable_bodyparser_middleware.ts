import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class DisableBodyParserMiddleware {
  public static disableBodyParser = true
  public async handle({}: HttpContext, next: NextFn) {
    return next()
  }
}
