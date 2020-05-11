import { modelOptions, prop, Ref, getModelForClass } from '@typegoose/typegoose'

import { Post } from './post.model'
import { User } from './user.model'

@modelOptions({
    schemaOptions: {
        toJSON: {
            transform: (doc, ret, options) => {
                delete ret.__v
            }
        },
        toObject: {
            transform: (doc, ret, options) => {
                delete ret.__v
            }
        }
    }
})

export class Feed {
    @prop({ required: true, ref: Post })
    public post!: Ref<Post>

    @prop({ required: true, ref: User })
    public postOwner!: Ref<User>

    @prop({ required: true, ref: User })
    public user!: Ref<User>

    @prop({ required: true })
    public createdAt!: Date
}

export const FeedModel = getModelForClass(Feed)