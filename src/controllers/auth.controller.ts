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
        body('username')
            .not().isEmpty().withMessage('Username is required').bail()
            .isAlphanumeric().withMessage('Username contains special characters')
            .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
            .isLength({ max: 16 }).withMessage('Username must be less than 16 characters')
            .not().matches(/^admin$/i).withMessage('Invalid username'),
        body('password')
            .not().isEmpty().withMessage('Password is required').bail()
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
            .isLength({ max: 120 }).withMessage('Password must be less than 120 characters'),
        body('email')
            .not().isEmpty().withMessage('Email is required').bail()
            .isEmail().withMessage('Email is not valid')
            .normalizeEmail()
    ]

    signUp = async (req: Request, res: Response) => {
        const userFields = {...req.body}
        const createdUser = await this.userService.create(userFields)
        const { email, username } = createdUser
        logger.info(`User signed up: { email: ${email}, username: ${username}}`)
        res.json({ status: OK, message: getStatusText(OK) })
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
                logger.info(`User signed in: { username: ${user.username} }`)
                const payload = { _id: user._id }
                const token = await this.authService.createToken(payload)
                return res.json({ status: OK, user: user.username, token })
            } else {
                throw new AuthenticationException()
            }
        } else {
            throw new AuthenticationException()
        }
    }
}

export default AuthController