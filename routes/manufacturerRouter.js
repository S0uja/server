const Router = require('express')
const router = new Router()
const ManufacturerController = require('../controllers/manufacturerController')
const fileMiddleware = require('../middleware/fileMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post(
	'/',
	// checkRoleMiddleware('admin'),
	fileMiddleware.single('filename'),
	ManufacturerController.create
)
router.get('/', ManufacturerController.getAll)
router.get('/:id', ManufacturerController.getOne)
router.put(
	'/:id',
	checkRoleMiddleware('admin'),
	fileMiddleware.single('filename'),
	ManufacturerController.update
)
router.delete(
	'/:id',
	checkRoleMiddleware('admin'),
	ManufacturerController.delete
)

module.exports = router
