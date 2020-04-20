import express from 'express'

const router = express.Router()

import * as authController from '../controllers/auth.controller'

import autoCatch from '../common/auto-catch'

router.post('/signup',
    authController.signUpValidation,
    authController.validateSignUp,
    autoCatch(authController.signUp))

export default router