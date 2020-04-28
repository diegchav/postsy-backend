import { Response } from 'express'
import { OK } from 'http-status-codes'

import PostService from '../services/post.service'

class PostController {
    private postService = new PostService()

    getAll = async (req: any, res: Response) => {
        const posts = await this.postService.getAll()
        res.status(OK).json({ status: OK, posts })
    }
}

export default PostController