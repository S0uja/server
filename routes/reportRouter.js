const Router = require('express')
const router = new Router()
const ReportController = require('../controllers/reportController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.get('/profit', checkRoleMiddleware('admin'), ReportController.profit)
router.get('/users', checkRoleMiddleware('admin'), ReportController.newUsers)
router.get(
	'/products',
	checkRoleMiddleware('admin'),
	ReportController.popularProducts
)

module.exports = router
