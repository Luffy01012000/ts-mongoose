import { Router } from 'express'
import authController from '../controller/authController'
import { validate } from '../middleware/validate'
import validationSchema from '../service/validations/authValidation'

import { verifyJWT } from '../middleware/authMiddleware'
import { upload } from '../middleware/multer'

const router = Router()

router.route('/signup').post(validate(validationSchema.signupSchema), authController.signup)
router.route('/login').post(validate(validationSchema.loginSchema), authController.login)
router.route('/refresh-token').post(validate(validationSchema.refreshTokenSchema), authController.refreshAccessToken)
router.route('/update-profile').patch(verifyJWT, upload.single('profilePicture'), authController.updateProfile)

export default router
