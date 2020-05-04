import { Router } from 'express'
import aws from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'

import AuthController from '../controllers/auth.controller'
import PostController from '../controllers/post.controller'

import autoCatch from '../common/auto-catch'
import { validateRequest } from '../middleware'

const s3 = new aws.S3({
    accessKeyId: 'AKIA227T7XOSSPAHPP4J',
    secretAccessKey: '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'
})

const upload = multer({
    storage: multerS3({
        s3,
        bucket: 'postsybucket',
        acl: 'public-read',
        key: function(req, file, cb) {
            cb(null, Date.now().toString())
        }
    }),
    limits: {
        fileSize: 2000000
    }
})

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