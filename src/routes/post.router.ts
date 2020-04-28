import { Router } from 'express'

import AuthController from '../controllers/auth.controller'
import PostController from '../controllers/post.controller'

import autoCatch from '../common/auto-catch'

class PostRouter {
    private authController = new AuthController()
    private postController = new PostController()

    private _router = Router()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this._router.get('/',
            this.authController.validateUser,
            autoCatch(this.postController.getAll))
    }

    get router() {
        return this._router
    }
}

export default PostRouter