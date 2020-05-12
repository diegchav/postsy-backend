import { PostModel } from '../models/post.model'
import { FeedModel } from '../models/feed.model'

import logger from '../common/logger'

class PostService {
    getAll = async () => {
        const _posts = await PostModel
            .find()
            .sort({ createdAt: -1 })
        return _posts
    }

    getById = async (id: string) => {
        const post = await PostModel.findOne({ _id: id })
            .populate('user', 'avatar name')
        return post
    }

    getForUser = async (userId: string) => {
        const _posts = await PostModel
            .find({ user: userId })
            .populate('user', '_id name avatar')
            .sort({ createdAt: -1 })
        return _posts
    }

    create = async (userId: string, text: string, imageUrl: string) => {
        const _post = await PostModel.create({
            text,
            imageUrl,
            user: userId
        })
        logger.info(`Created post: ${_post._id}`)
        return _post
    }

    delete = async (id: string) => {
        await PostModel.deleteOne({ _id: id })
        await FeedModel.deleteMany({ post: id })
        logger.info(`Deleted post: ${id}`)
    }
}

export default PostService