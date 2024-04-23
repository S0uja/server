const Router = require('express')
const router = new Router()
const UserController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const fileMiddleware = require('../middleware/fileMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/register',fileMiddleware.none(), UserController.register)
router.post('/login',fileMiddleware.none(), UserController.login)
router.get('/auth', authMiddleware, UserController.check)
router.put('/update/password',authMiddleware,fileMiddleware.none(), UserController.updatePasswordUser)
router.put('/update',authMiddleware,fileMiddleware.none(), UserController.updateUser)


router.post('/admin/', checkRoleMiddleware('admin'),fileMiddleware.none(), UserController.create)
router.get('/admin/personal',checkRoleMiddleware('admin'), UserController.getAllPersonal)
router.get('/admin/',checkRoleMiddleware('admin'), UserController.getAll)
router.get('/admin/:id',checkRoleMiddleware('admin'), UserController.getOne)
router.put('/admin/:id',checkRoleMiddleware('admin'),fileMiddleware.none(), UserController.updateAdmin)

router.delete('/admin/:id',checkRoleMiddleware('admin'), UserController.delete)

module.exports = router
