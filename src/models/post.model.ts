import { modelOptions, prop, getModelForClass, Ref } from '@typegoose/typegoose'

import { User } from './user.model'

@modelOptions({
    schemaOptions: {
        toJSON: {
            transform: (doc, ret, options) => {
                delete ret.__v
                return ret
            }
        }
    }
})

export class Post {
    @prop({ required: true })
    public text!: string

    @prop({ required: true, ref: 'User' })
    public user!: Ref<User>

    @prop({ default: Date.now })
    public createdAt?: Date
}

export const PostModel = getModelForClass(Post)