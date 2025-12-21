import { Router } from 'express'
import sizeController from '../controller/sizeController'
import { validate } from '../middleware/validate'
import validationSchema from '../service/validations/sizeValidation'
import { verifyJWT } from '../middleware/authMiddleware'

const router = Router()

router.route('/').get(verifyJWT, sizeController.getAllSize)
router.route('/').post(verifyJWT, validate(validationSchema.createSizeSchema), sizeController.createSize)

export default router
