const Router = require('express')
const router = new Router()
const CollectionController = require('../controllers/collectionController')
const fileMiddleware = require('../middleware/fileMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/', checkRoleMiddleware('admin'),fileMiddleware.single('filename'),CollectionController.create)
router.get('/', CollectionController.getAll)
router.get('/:id', CollectionController.getOne)
router.put('/:id', checkRoleMiddleware('admin'),fileMiddleware.single('filename'), CollectionController.update)
router.delete('/:id', checkRoleMiddleware('admin'),CollectionController.delete)

module.exports = router
