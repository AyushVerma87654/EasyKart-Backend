/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import CouponsController from '#controllers/coupons_controller'
import ProductsController from '#controllers/products_controller'
import UsersController from '#controllers/users_controller'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/products', [ProductsController, 'getAllProducts'])
router.get('/product/:id', [ProductsController, 'getProductById'])
router.get('/apply-coupon/:couponCode', [CouponsController, 'getDiscountPercentage'])

router.post('/signup', [UsersController, 'signup'])
router.post('/login', [UsersController, 'login'])
