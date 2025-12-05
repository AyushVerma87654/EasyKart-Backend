/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import AdminController from '#controllers/admin_controller'
import CartsController from '#controllers/carts_controller'
import CouponsController from '#controllers/coupons_controller'
import OrdersController from '#controllers/orders_controller'
import ProductsController from '#controllers/products_controller'
import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/products', [ProductsController, 'getAllProducts'])
router.get('/product/:id', [ProductsController, 'getProductById'])
router.post('/products/bulk-fetch', [ProductsController, 'getProductByIds'])

router.get('/coupon', [CouponsController, 'getCoupons'])
router.get('/apply-coupon/:couponCode', [CouponsController, 'getDiscountPercentage'])

router.post('/signup', [UsersController, 'signup'])
router.post('/login', [UsersController, 'login'])
router.get('/me', [UsersController, 'me'])
router.get('/logout', [UsersController, 'logout'])
router.post('/sendMail', [UsersController, 'sendMail'])
router.post('/codeVerification', [UsersController, 'codeVerification'])

router
  .group(() => {
    router.get('/deleteAccount', [UsersController, 'deleteAccount'])
    router.post('/resetPassword', [UsersController, 'resetPassword'])
    router.post('/update-profile', [UsersController, 'updateProfile'])

    router.post('/cart/edit-cart', [CartsController, 'editCart'])
    router.post('/cart/delete-cart-item', [CartsController, 'deleteCartItem'])

    router.get('/updateData', [AdminController, 'updateData'])

    router.post('/place-order', [OrdersController, 'placeOrder'])
    router.get('/fetch-order', [OrdersController, 'fetchOrder'])
    router.post('/payment-checkout', [OrdersController, 'paymentCheckout'])
  })
  .use(middleware.auth())

router
  .post('/webhook/stripe', '#controllers/orders_controller.stripeWebhook')
  .use(middleware.disableBodyParser())
