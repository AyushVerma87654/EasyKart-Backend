declare module '@adonisjs/core/http' {
  interface Request {
    authUser?: import('#models/user').default
  }
}
