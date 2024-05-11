const Router = require('express')
const router = new Router()
const ProductController = require('../controllers/productController')
const fileMiddleware = require('../middleware/fileMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.get('/mp', ProductController.getMainPage)
router.post(
	'/',
	// checkRoleMiddleware('admin'),
	fileMiddleware.array('images[]'),
	ProductController.create
)
router.get('/page', ProductController.getPage)
router.get('/:id', ProductController.getOne)
router.get('/', ProductController.getAll)
router.put(
	'/:id',
	checkRoleMiddleware('admin'),
	fileMiddleware.array('images[]'),
	ProductController.update
)
router.delete('/:id', checkRoleMiddleware('admin'), ProductController.delete)

module.exports = router
