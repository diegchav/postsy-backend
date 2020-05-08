import { modelOptions, prop, getModelForClass, Ref } from '@typegoose/typegoose'
import moment from 'moment'

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

export class Post {
    @prop({ required: true })
    public text!: string

    @prop()
    public imageUrl?: string

    @prop({ required: true, ref: User })
    public user!: Ref<User>

    @prop({ default: Date.now })
    public createdAt?: Date

    public get fromNow() {
        return moment(this.createdAt).fromNow()
    }
}

export const PostModel = getModelForClass(Post)