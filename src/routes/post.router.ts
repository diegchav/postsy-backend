import { Router } from 'express'
import aws from 'aws-sdk'
import multer, { StorageEngine } from 'multer'
import multerS3 from 'multer-s3'

import AuthController from '../controllers/auth.controller'
import PostController from '../controllers/post.controller'

import InvalidImageException from '../exceptions/invalid-image-exception'

import autoCatch from '../common/auto-catch'
import { validateRequest } from '../middleware'

import getFileExtension from '../helpers/get-file-extension'

import {
    UPLOADS_DIR,
    AWS_UPLOAD,
    IMAGE_TYPE_PNG,
    IMAGE_TYPE_JPG,
    IMAGE_TYPE_JPEG,
    IMAGE_TYPE_GIF
} from '../constants'

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
})

let storage: StorageEngine
if (AWS_UPLOAD) {
    storage = multerS3({
        s3,
        bucket: process.env.AWS_BUCKET_NAME || '',
        acl: 'public-read',
        key: function(req, file, cb) {
            const timestamp = Date.now()
            const fileExtension = getFileExtension(file.originalname)
            cb(null, `${timestamp}.${fileExtension}`)
        }
    })
} else {
    storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, UPLOADS_DIR)
        },
        filename: (req, file, cb) => {
            const timestamp = Date.now()
            const fileExtension = getFileExtension(file.originalname)
            cb(null, `${timestamp}.${fileExtension}`)
        }
    })
}

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const validExtensions = [IMAGE_TYPE_PNG, IMAGE_TYPE_JPG, IMAGE_TYPE_JPEG, IMAGE_TYPE_GIF]
        const fileExtension = getFileExtension(file.originalname)
        if (!validExtensions.includes(fileExtension)) {
            cb(new InvalidImageException(file.fieldname))
        }
        cb(null, true)
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
        this._router.get('/:id',
            this.authController.validateUser,
            autoCatch(this.postController.getById))
        this._router.delete('/:id',
            this.authController.validateUser,
            autoCatch(this.postController.delete))
        this._router.post('/:id/comment',
            this.authController.validateUser,
            this.postController.createCommentValidation,
            validateRequest,
            autoCatch(this.postController.createComment))
        this._router.get('/:id/comments',
            this.authController.validateUser,
            autoCatch(this.postController.getComments))
        this._router.put('/:id/like',
            this.authController.validateUser,
            autoCatch(this.postController.likePost))
        this._router.put('/:id/dislike',
            this.authController.validateUser,
            autoCatch(this.postController.dislikePost))
    }

    get router() {
        return this._router
    }
}

export default PostRouter