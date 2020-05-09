import { prop, Ref, getModelForClass } from '@typegoose/typegoose'

import { Post } from './post.model'
import { User } from './user.model'

export class Feed {
    @prop({ required: true, ref: Post })
    public post!: Ref<Post>

    @prop({ required: true, ref: User })
    public user!: Ref<User>

    @prop({ required: true })
    public createdAt!: Date
}

export const FeedModel = getModelForClass(Feed)