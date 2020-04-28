import { prop, getModelForClass } from '@typegoose/typegoose'
import cuid from 'cuid'

import { User } from './user.model'

export class Post {
    @prop({ default: cuid })
    public _id?: string

    @prop({ required: true })
    public text!: string

    @prop({ required: true })
    public user!: User

    @prop({ default: Date.now })
    public createdAt?: Date
}

export const PostModel = getModelForClass(Post)