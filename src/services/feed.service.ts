import { FeedModel } from '../models/feed.model'

import logger from '../common/logger'

class FeedService {
    create = async (postId: string, userId: string, createdAt: Date) => {
        const _feed = await FeedModel.create({
            post: postId,
            user: userId,
            createdAt
        })
        logger.info(`Created feed with post '${_feed.post}' for user '${_feed.user}'`)
    }
}

export default FeedService