import { Router } from 'express'

import AuthController from '../controllers/auth.controller'
import UserController from '../controllers/user.controller'

import { validateRequest } from '../middleware'

import autoCatch from '../common/auto-catch'

class UserRouter {
    private _router = Router()

    private authController = new AuthController()
    private userController = new UserController()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this._router.get('/',
            this.authController.validateUser,
            autoCatch(this.userController.getAll))
        this._router.get('/:id',
            this.authController.validateUser,
            autoCatch(this.userController.getUser))
        this._router.put('/',
            this.authController.validateUser,
            this.userController.updateValidation,
            validateRequest,
            autoCatch(this.userController.updateUser))
        this._router.post('/follow/:userId',
            this.authController.validateUser,
            autoCatch(this.userController.followUser))
        this._router.post('/unfollow/:userId',
            this.authController.validateUser,
            autoCatch(this.userController.unfollowUser))
    }

    get router() {
        return this._router
    }
}

export default UserRouter