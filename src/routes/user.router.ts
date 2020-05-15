import { Router } from 'express'

import AuthController from '../controllers/auth.controller'
import UserController from '../controllers/user.controller'
import PostController from '../controllers/post.controller'

import { validateRequest } from '../middleware'

import autoCatch from '../common/auto-catch'

class UserRouter {
    private _router = Router()

    private authController = new AuthController()
    private userController = new UserController()
    private postController = new PostController()

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
        this._router.get('/:id/posts',
            this.authController.validateUser,
            autoCatch(this.postController.getForUser))
        this._router.put('/follow/:userId',
            this.authController.validateUser,
            autoCatch(this.userController.followUser))
        this._router.put('/unfollow/:userId',
            this.authController.validateUser,
            autoCatch(this.userController.unfollowUser))
    }

    get router() {
        return this._router
    }
}

export default UserRouter