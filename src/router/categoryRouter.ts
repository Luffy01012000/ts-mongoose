import { Router } from 'express'
import categoryController from '../controller/categoryController'
import { validate } from '../middleware/validate'
import validationSchema from '../service/validations/categoryValidation'
import { verifyJWT } from '../middleware/authMiddleware'

const router = Router()

router.route('/').get(verifyJWT, categoryController.getAllCategories)
router.route('/').post(verifyJWT, validate(validationSchema.createCategorySchema), categoryController.createCategory)

export default router
