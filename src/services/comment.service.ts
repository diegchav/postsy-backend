import { CommentModel } from '../models/comment.model'

import logger from '../common/logger'

class CommentService {
    create = async (text: string, postId: string, userId: string) => {
        await CommentModel.create({
            text,
            post: postId,
            user: userId
        })
        logger.info(`Created comment by user ${userId} for post ${postId}`)
    }
}

export default CommentService