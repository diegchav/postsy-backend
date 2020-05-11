import { modelOptions, prop, Ref, getModelForClass } from '@typegoose/typegoose'
import moment from 'moment'

import { Post } from './post.model'
import { User } from './user.model'

@modelOptions({
    schemaOptions: {
        toObject: {
            virtuals: true,
            transform: (doc, ret, options) => {
                delete ret.__v   
            }
        },
        toJSON: {
            virtuals: true,
            transform: (doc, ret, options) => {
                delete ret.__v   
            }
        }
    }
})

class Comment {
    @prop({
        required: true,
        trim: true,
        maxlength: 150
    })
    public text!: string

    @prop({ required: true, ref: Post })
    public post!: Ref<Post>

    @prop({ required: true, ref: User })
    public user!: Ref<User>

    @prop({ default: Date.now })
    public createdAt!: Date

    public get fromNow() {
        return moment(this.createdAt).fromNow()
    }
}

export const CommentModel = getModelForClass(Comment)