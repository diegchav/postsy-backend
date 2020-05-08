import { Response } from 'express'
import { body } from 'express-validator'
import { OK, CREATED, getStatusText } from 'http-status-codes'

import PostService from '../services/post.service'

import ForbiddenException from '../exceptions/forbidden-exception'

import getFileLocation from '../helpers/get-file-location'

class PostController {
    private postService = new PostService()

    getAll = async (req: any, res: Response) => {
        const { _id } = req.user
        const posts = await this.postService.getAll(_id)
        res.status(OK).json({ status: OK, posts })
    }

    createPostValidation = [
        body('text')
            .not().isEmpty().withMessage('Text for the post is required')
    ]

    create = async (req: any, res: Response) => {
        const { _id } = req.user
        const { text } = req.body
        let imageUrl = ''
        if (req.file) imageUrl = getFileLocation(req)
        await this.postService.create(_id, text, imageUrl)
        res.status(CREATED).json({ status: CREATED, message: getStatusText(CREATED) })
    }

    delete = async (req: any, res: Response) => {
        const { id } = req.params
        const userId = req.user._id
        const post = await this.postService.getById(id)
        // Check if the post belongs to the user
        if (!userId.equals(post?.user)) throw new ForbiddenException()

        await this.postService.delete(id)
        res.status(OK).json({ status: OK, message: getStatusText(OK) })
    }
}

export default PostController