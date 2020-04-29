import { PostModel } from '../models/post.model'
import { User } from '../models/user.model'

import logger from '../common/logger'

class PostService {
    getAll = async () => {
        const posts = await PostModel.find()
        return posts
    }

    create = async (text: string, userId: string) => {
        const { _id } = await PostModel.create({
            text,
            user: userId
        })
        logger.info(`Created post: ${_id}`)
    }
}

export default PostService