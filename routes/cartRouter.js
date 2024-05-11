const Router = require('express')
const router = new Router()
const CartController = require('../controllers/cartController')
const authMiddleWare = require('../middleware/authMiddleware')
const fileMiddleware = require('../middleware/fileMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post(
	'/user',
	fileMiddleware.none(),
	authMiddleWare,
	CartController.createUser
)
router.get('/user', authMiddleWare, CartController.getUser)

router.post(
	'/admin',
	checkRoleMiddleware('admin'),
	fileMiddleware.none(),
	CartController.createAdmin
)
router.get('/admin', checkRoleMiddleware('admin'), CartController.getAllAdmin)
router.get(
	'/admin/:id',
	checkRoleMiddleware('admin'),
	CartController.getOneAdmin
)
router.put(
	'/admin/:id',
	checkRoleMiddleware('admin'),
	fileMiddleware.none(),
	CartController.updateAdmin
)
router.delete(
	'/admin/:id',
	checkRoleMiddleware('admin'),
	CartController.deleteAdmin
)

module.exports = router
