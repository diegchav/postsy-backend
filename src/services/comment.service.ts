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

    getForPost = async (postId: string) => {
        const _comments = await CommentModel.find({ post: postId })
            .select('-post')
            .populate('user', 'avatar name')
            .sort({ createdAt: -1 })
        return _comments
    }
}

export default CommentService