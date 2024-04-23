const Router = require('express')
const router = new Router()
const OrderStatusController = require('../controllers/orderStatusController')
const fileMiddleware = require('../middleware/fileMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/',checkRoleMiddleware('admin'),fileMiddleware.none(), OrderStatusController.create)
router.get('/', OrderStatusController.getAll)
router.get('/:id', OrderStatusController.getOne)
router.put('/:id',checkRoleMiddleware('admin'),fileMiddleware.none(), OrderStatusController.update)
router.delete('/:id',checkRoleMiddleware('admin'), OrderStatusController.delete)

module.exports = router
