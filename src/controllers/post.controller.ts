import { Response } from 'express'
import { body } from 'express-validator'
import { OK, CREATED, getStatusText } from 'http-status-codes'

import PostService from '../services/post.service'

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
        if (req.file) imageUrl = `${req.file.location}`
        await this.postService.create(_id, text, imageUrl)
        res.status(CREATED).json({ status: CREATED, message: getStatusText(CREATED) })
    }

    delete = async (req: any, res: Response) => {
        const { id } = req.params
        await this.postService.delete(id)
        res.status(OK).json({ status: OK, message: getStatusText(OK) })
    }
}

export default PostController