import { prop, getModelForClass, Ref } from '@typegoose/typegoose'

import { User } from './user.model'

export class Post {
    @prop({ required: true })
    public text!: string

    @prop({ required: true, ref: 'User' })
    public user!: Ref<User>

    @prop({ default: Date.now })
    public createdAt?: Date
}

export const PostModel = getModelForClass(Post)