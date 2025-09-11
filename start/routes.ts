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
import ProductsController from '#controllers/products_controller'
import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('/products', [ProductsController, 'getAllProducts'])
router.get('/product/:id', [ProductsController, 'getProductById'])

router.get('/coupon', [CouponsController, 'getCoupons'])
router.get('/apply-coupon/:couponCode', [CouponsController, 'getDiscountPercentage'])

router.post('/signup', [UsersController, 'signup'])
router.post('/login', [UsersController, 'login'])
router.get('/me', [UsersController, 'me'])
router.get('/logout', [UsersController, 'logout'])
router.post('/deleteAccount', [UsersController, 'deleteAccount'])
router.post('/sendMail', [UsersController, 'sendMail'])
router.post('/codeVerification', [UsersController, 'codeVerification'])
router.post('/resetPassword', [UsersController, 'resetPassword'])

router.post('/cart/update', [CartsController, 'updateCart'])

router.get('/updateData', [AdminController, 'updateData'])
