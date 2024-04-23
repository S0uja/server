const Router = require('express')
const router = new Router()
const ReviewController = require('../controllers/reviewController')
const authMiddleWare = require('../middleware/authMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')
const fileMiddleware = require('../middleware/fileMiddleware')

router.post('/admin',fileMiddleware.none(),checkRoleMiddleware('admin'), ReviewController.createAdmin)
router.post('/user',fileMiddleware.none(), authMiddleWare, ReviewController.createUser)

router.get('/admin',checkRoleMiddleware('admin'), ReviewController.getAllAdmin)
router.get('/admin/:id',checkRoleMiddleware('admin'), ReviewController.getOneAdmin)
router.get('/user', ReviewController.getAllUser)
router.get('/user/:id', ReviewController.getOneUser)

router.put('/admin/:id',fileMiddleware.none(),checkRoleMiddleware('admin'), ReviewController.updateAdmin)

router.delete('/admin/:id',checkRoleMiddleware('admin'), ReviewController.deleteAdmin)

module.exports = router
