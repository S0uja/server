const Router = require('express')
const router = new Router()
const productRouter = require('./productRouter')
const categoryRouter = require('./categoryRouter')
const manufacturerRouter = require('./manufacturerRouter')
const cartRouter = require('./cartRouter')
const reviewRouter = require('./reviewRouter')
const userRouter = require('./userRouter')
const orderRouter = require('./orderRouter')
const orderStatusRouter = require('./orderStatusRouter')
const collectionRouter = require('./collectionRouter')
const statisticRouter = require('./statisticRouter')
const sqlRouter = require('./sqlRouter')

router.use('/category', categoryRouter)
router.use('/product', productRouter)
router.use('/manufacturer', manufacturerRouter)
router.use('/user', userRouter)
router.use('/cart', cartRouter)
router.use('/review', reviewRouter)
router.use('/order', orderRouter)
router.use('/orderStatus', orderStatusRouter)
router.use('/collection', collectionRouter)
router.use('/statistic', statisticRouter)
router.use('/sql', sqlRouter)

module.exports = router
