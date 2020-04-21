import { pre, prop, getModelForClass } from '@typegoose/typegoose'
import bcrypt from 'bcrypt'
import cuid from 'cuid'

const saltRounds = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS) || 10)

@pre<User>('save', async function() {
    this.password = await bcrypt.hash(this.password, saltRounds)
})

export class User {
    @prop({ default: cuid })
    public _id?: string

    @prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minlength: 3,
        maxlength: 16
    })
    public username!: string

    @prop({
        minlength: 12,
        maxLength: 120,
        required: true
    })
    public password!: string

    @prop({ required: true })
    public email!: string

    @prop({ default: Date.now })
    public createdAt?: Date
}

export const UserModel = getModelForClass(User)