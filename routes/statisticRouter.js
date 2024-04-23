const Router = require('express')
const router = new Router()
const StatisticController = require('../controllers/statisticController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.get('/orders',checkRoleMiddleware('admin'), StatisticController.getMounthCountOrders)
router.get('/earn',checkRoleMiddleware('admin'), StatisticController.getMounthEarn)
router.get('/logs',checkRoleMiddleware('admin'), StatisticController.getLogs)

module.exports = router
