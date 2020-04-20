import express from 'express'

import AuthController from '../controllers/auth.controller'

import autoCatch from '../common/auto-catch'

class AuthRouter {
    private authController = new AuthController()

    private _router = express.Router()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this._router.post('/signup',
            this.authController.signUpValidation,
            this.authController.validateSignUp,
            autoCatch(this.authController.signUp))
    }

    get router() {
        return this._router
    }
}

export default AuthRouter