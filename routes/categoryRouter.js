const Router = require('express')
const router = new Router()
const CategoryController = require('../controllers/categoryController')
const fileMiddleware = require('../middleware/fileMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post(
	'/',
	checkRoleMiddleware('admin'),
	fileMiddleware.single('filename'),
	CategoryController.create
)
router.get('/', CategoryController.getAll)
router.get('/:id', CategoryController.getOne)
router.put(
	'/:id',
	checkRoleMiddleware('admin'),
	fileMiddleware.single('filename'),
	CategoryController.update
)
router.delete('/:id', checkRoleMiddleware('admin'), CategoryController.delete)

module.exports = router
