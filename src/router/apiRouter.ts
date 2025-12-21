import { Router } from 'express'
import apiController from '../controller/apiController'
import authRouter from './authRouter'
import productRouter from './productRouter'
import colorRouter from './colorRouter'
import sizeRouter from './sizeRouter'
import categoryRouter from './categoryRouter'

const router = Router()

router.use('/auth', authRouter)
router.use('/product', productRouter)
router.use('/color', colorRouter)
router.use('/size', sizeRouter)
router.use('/category', categoryRouter)
router.route('/self').get(apiController.self)
router.route('/health').get(apiController.health)

export default router
