const Router = require('express')
const router = new Router()
const OrderController = require('../controllers/orderController')
const authMiddleWare = require('../middleware/authMiddleware')
const fileMiddleware = require('../middleware/fileMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/user', fileMiddleware.none(),authMiddleWare, OrderController.createUser)
router.get('/user/rate', authMiddleWare, OrderController.getProductsForRate)
router.get('/user', authMiddleWare, OrderController.getAllUser)
router.get('/user/:id', authMiddleWare, OrderController.getOneUser)


router.post('/admin', checkRoleMiddleware('admin'),fileMiddleware.none(),OrderController.createAdmin)
router.get('/admin', checkRoleMiddleware('admin'),OrderController.getAllAdmin)
router.get('/admin/:id', checkRoleMiddleware('admin'),OrderController.getOneAdmin)
router.put('/admin/:id', checkRoleMiddleware('admin'),fileMiddleware.none(), OrderController.update)
router.delete('/admin/:id', checkRoleMiddleware('admin'),OrderController.delete)

module.exports = router
