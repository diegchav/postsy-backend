import { FeedModel } from '../models/feed.model'

import logger from '../common/logger'

class FeedService {
    create = async (postId: string, postOwnerId: string, userId: string, createdAt: Date) => {
        const _feed = await FeedModel.create({
            post: postId,
            postOwner: postOwnerId,
            user: userId,
            createdAt
        })
        logger.info(`Created feed with post '${_feed.post}' for user '${_feed.user}'`)
    }

    getAll = async (userId: string) => {
        const _feeds = await FeedModel.find({ user: userId })
            .populate({
                path: 'post',
                select: 'text imageUrl fromNow',
                populate: { path: 'user', select: 'name avatar' }
            })
            .sort({ createdAt: -1 })
        return _feeds
    }
}

export default FeedService