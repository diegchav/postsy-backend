import { Router } from 'express'
import path from 'path'
import multer from 'multer'

import AuthController from '../controllers/auth.controller'
import PostController from '../controllers/post.controller'

import autoCatch from '../common/auto-catch'
import { validateRequest } from '../middleware'

import { UPLOADS_DIR } from '../constants'

const upload = multer({ dest: UPLOADS_DIR })

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
        this._router.post('/',
            this.authController.validateUser,
            upload.single('imageFile'),
            this.postController.createPostValidation,
            validateRequest,
            autoCatch(this.postController.create))
        this._router.post('/:id',
            this.authController.validateUser,
            autoCatch(this.postController.delete))
    }

    get router() {
        return this._router
    }
}

export default PostRouter