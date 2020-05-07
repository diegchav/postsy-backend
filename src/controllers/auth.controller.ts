import { Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import { OK, getStatusText } from 'http-status-codes'
import bcrypt from 'bcrypt'

import AuthService from '../services/auth.service'
import UserService from '../services/user.service'

import AuthenticationException from '../exceptions/authentication-exception'

import logger from '../common/logger'

class AuthController {
    private authService = new AuthService()
    private userService = new UserService()

    validateUser = async (req: any, res: Response, next: NextFunction) => {
        let jwt = req.headers.authorization || ''
        jwt = jwt?.replace(/^Bearer /i, '')
        try {
            const _id = await this.authService.verifyToken(jwt)
            const user = await this.userService.verifyUser(_id)
            req.user = user
            return next()
        } catch (err) {
            return next(err)
        }
    }

    signUpValidation = [
        body('name')
            .not().isEmpty().withMessage('Name is required').bail()
            .isLength({ max: 120 }).withMessage('Name must be at most 120 characters'),
        body('password')
            .not().isEmpty().withMessage('Password is required').bail()
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
            .isLength({ max: 120 }).withMessage('Password must be at most 120 characters'),
        body('email')
            .not().isEmpty().withMessage('Email is required').bail()
            .isEmail().withMessage('Email is not valid')
            .normalizeEmail()
    ]

    signUp = async (req: Request, res: Response) => {
        const userFields = {...req.body}
        const createdUser = await this.userService.create(userFields)
        logger.info(`User signed up: ${createdUser}`)
        res.json({ status: OK, message: getStatusText(OK), user: createdUser })
    }

    signInValidation = [
        body('email')
            .not().isEmpty().withMessage('Email is required').bail()
            .isEmail().withMessage('Email is not valid')
            .normalizeEmail(),
        body('password')
            .not().isEmpty().withMessage('Password is required')
    ]

    signIn = async (req: Request, res: Response) => {
        const { email, password } = req.body
        const user = await this.userService.getByEmail(email)
        if (user) {
            const isUser = await bcrypt.compare(password, user.password)
            if (isUser) {
                logger.info(`User signed in: { email: ${user.email} }`)
                const payload = { _id: user._id }
                const token = await this.authService.createToken(payload)
                return res.json({ status: OK, message: getStatusText(OK), user, token })
            } else {
                throw new AuthenticationException()
            }
        } else {
            throw new AuthenticationException()
        }
    }
}

export default AuthController