import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'
import { BAD_REQUEST, OK } from 'http-status-codes'
import bcrypt from 'bcrypt'

import AuthService from '../services/auth.service'
import UserService from '../services/user.service'

import { toJsonError } from '../common/util'
import HttpException from '../common/http-exception'
import logger from '../common/logger'

class AuthController {
    private authService = new AuthService()
    private userService = new UserService()

    validate = (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const validationErrors = errors.array().map(e => toJsonError(e))
            const httpError = new HttpException(BAD_REQUEST, 'Validation Error', validationErrors)
            return next(httpError)
        }

        next()
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
        logger.info(`Created user: { email: ${email}, username: ${username}}`)
        res.json({ status: OK, user: { email, username } })
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
        const user = await this.userService.findByEmail(email)
        if (user) {
            const isUser = await bcrypt.compare(password, user.password)
            if (isUser) {
                const payload = { username: user.username }
                const token = await this.authService.createToken(payload)
                res.cookie('jwt', token, { httpOnly: true })
                return res.json({ status: OK, token })
            } else {
                const errors = [{ error: 'Invalid username or password' }]
                const httpError = new HttpException(BAD_REQUEST, 'Authentication Error', errors)
                throw httpError
            }
        } else {
            const errors = [{ error: 'Invalid username or password' }]
            const httpError = new HttpException(BAD_REQUEST, 'Authentication Error', errors)
            throw httpError
        }
    }
}

export default AuthController