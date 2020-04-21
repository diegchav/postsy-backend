import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'
import { BAD_REQUEST, OK } from 'http-status-codes'

import UserService from '../services/user.service'

import { toJsonError } from '../common/util'
import HttpException from '../common/http-exception'

class AuthController {
    private userService = new UserService()

    public signUpValidation = [
        body('username')
            .not().isEmpty().withMessage('Username is required').bail()
            .isAlphanumeric().withMessage('Username contains special characters')
            .isLength({ min: 3 }).withMessage('Username must be at least 3 characters')
            .isLength({ max: 16 }).withMessage('Username must be less than 16 characters')
            .not().matches(/^admin$/i).withMessage('Invalid username'),
        body('password')
            .not().isEmpty().withMessage('Password is required').bail()
            .isLength({ min: 12 }).withMessage('Password must be at least 12 characters')
            .isLength({ max: 120 }).withMessage('Password must be less than 120 characters'),
        body('email')
            .not().isEmpty().withMessage('Email is required').bail()
            .isEmail().withMessage('Email is not valid')
            .normalizeEmail()
    ]
    
    validateSignUp = (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            const validationErrors = errors.array().map(e => toJsonError(e))
            const httpError = new HttpException(BAD_REQUEST, 'Validation Error', validationErrors)
            return next(httpError)
        }
    
        next()
    }
    
    signUp = async (req: Request, res: Response) => {
        const userFields = {...req.body}
        const createdUser = await this.userService.create(userFields)
        const { email, username } = createdUser
        res.json({ status: OK, user: { email, username } })
    }
}

export default AuthController