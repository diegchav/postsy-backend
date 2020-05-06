import { Router } from 'express'

import AuthController from '../controllers/auth.controller'
import UserController from '../controllers/user.controller'

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
        this._router.get('/profile',
            this.authController.validateUser,
            autoCatch(this.userController.getProfile))
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