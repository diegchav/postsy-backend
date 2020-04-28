import { PostModel } from '../models/post.model'

class PostService {
    getAll = async () => {
        const posts = await PostModel.find()
        return posts
    }
}

export default PostService