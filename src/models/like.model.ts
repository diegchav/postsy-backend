import { prop, Ref, getModelForClass } from '@typegoose/typegoose'

import { Post } from './post.model'
import { User } from './user.model'

class Like {
    @prop({ required: true, ref: Post })
    public post!: Ref<Post>

    @prop({ required: true, ref: User })
    public user!: Ref<User>
}

export const LikeModel = getModelForClass(Like)