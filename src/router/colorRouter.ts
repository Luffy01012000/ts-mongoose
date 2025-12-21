import { Router } from 'express'
import colorController from '../controller/colorController'
import { validate } from '../middleware/validate'
import validationSchema from '../service/validations/colorValidation'
import { verifyJWT } from '../middleware/authMiddleware'

const router = Router()

router.route('/').get(verifyJWT, colorController.getAllColors)
router.route('/').post(verifyJWT, validate(validationSchema.createColorSchema), colorController.createColor)

export default router
