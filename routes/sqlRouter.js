const Router = require('express')
const router = new Router()
const SqlController = require('../controllers/sqlController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const fileMiddleware = require('../middleware/fileMiddleware')

router.post(
	'/',
	fileMiddleware.none(),
	checkRoleMiddleware('admin'),
	SqlController.makeSql
)

module.exports = router
