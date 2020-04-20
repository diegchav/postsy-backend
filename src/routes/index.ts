import express from 'express'
const router = express.Router()

import authRouter from './auth.router'

router.use('/auth', authRouter)

export default router