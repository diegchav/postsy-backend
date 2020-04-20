import express from 'express'

const router = express.Router()

import * as userController from '../controllers/auth.controller'

import autoCatch from '../common/auto-catch'

router.post('/signup', autoCatch(userController.create))

export default router