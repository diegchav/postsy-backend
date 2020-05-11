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

    deleteByPostOwnerId = async (postOwnerId: string, userId: string) => {
        await FeedModel.deleteMany({ postOwner: postOwnerId, user: userId })
        logger.info(`Deleted feeds from post onwer ${postOwnerId}`)
    }

    getAll = async (userId: string) => {
        const _feeds = await FeedModel.find({ user: userId })
            .select('-user -createdAt')
            .populate('post', 'text imageUrl fromNow')
            .populate('postOwner', 'avatar name')
            .sort({ createdAt: -1 })
        return _feeds
    }
}

export default FeedService