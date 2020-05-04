import { Router } from 'express'
import aws from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'

import AuthController from '../controllers/auth.controller'
import PostController from '../controllers/post.controller'

import autoCatch from '../common/auto-catch'
import { validateRequest } from '../middleware'

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
})

const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME || '',
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
        this._router.delete('/:id',
            this.authController.validateUser,
            autoCatch(this.postController.delete))
    }

    get router() {
        return this._router
    }
}

export default PostRouter