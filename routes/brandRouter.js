const Router = require('express')
const router = new Router()
const BrandController = require('../controllers/brandController')
const fileMiddleware = require('../middleware/fileMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post(
	'/',
	checkRoleMiddleware('admin'),
	fileMiddleware.single('filename'),
	BrandController.create
)
router.get('/', BrandController.getAll)
router.get('/:id', BrandController.getOne)
router.put(
	'/:id',
	checkRoleMiddleware('admin'),
	fileMiddleware.single('filename'),
	BrandController.update
)
router.delete('/:id', checkRoleMiddleware('admin'), BrandController.delete)

module.exports = router
