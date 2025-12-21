import { Router } from 'express'
import productController from '../controller/productController'
import validationSchema from '../service/validations/productValidation'
import { verifyJWT } from '../middleware/authMiddleware'
import { upload } from '../middleware/multer'

const router = Router()

router.route('/').get(verifyJWT, productController.getAllProducts)
router.route('/').post(verifyJWT, upload.array('images'), validationSchema.productValidation, productController.createProduct)

export default router
