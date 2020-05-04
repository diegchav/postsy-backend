import { PostModel } from '../models/post.model'

import logger from '../common/logger'

class PostService {
    getAll = async (userId: string) => {
        const posts = await PostModel
            .find({ user: userId })
            .populate('user', '-email')
            .sort({ createdAt: -1 })
        return posts
    }

    getById = async (id: string) => {
        const post = await PostModel.findOne({ _id: id })
        return post
    }

    create = async (userId: string, text: string, imageUrl: string) => {
        const { _id } = await PostModel.create({
            text,
            imageUrl,
            user: userId
        })
        logger.info(`Created post: ${_id}`)
    }

    delete = async (id: string) => {
        await PostModel.deleteOne({ _id: id })
        logger.info(`Deleted post: ${id}`)
    }
}

export default PostService