import { LikeModel } from '../models/like.model'

import logger from '../common/logger'

class LikeService {
    like = async (postId: string, userId: string) => {
        await LikeModel.create({
            post: postId,
            user: userId
        })
        logger.info(`Liked post ${postId} by user ${userId}`)
    }

    dislike = async (postId: string, userId: string) => {
        await LikeModel.deleteOne({
            post: postId,
            user: userId
        })
        logger.info(`Disliked post ${postId} by user ${userId}`)
    }
}

export default LikeService