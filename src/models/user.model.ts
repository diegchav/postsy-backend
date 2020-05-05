import { modelOptions, pre, prop, getModelForClass } from '@typegoose/typegoose'
import bcrypt from 'bcrypt'

const saltRounds = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS) || 10)

@modelOptions({
    schemaOptions: {
        toObject: {
            transform: (doc, ret, options) => {
                delete ret.password
                delete ret.createdAt
                delete ret.__v
            }
        },
        toJSON: {
            transform: (doc, ret, options) => {
                delete ret.password
                delete ret.createdAt
                delete ret.__v
            }
        }
    }
})

@pre<User>('save', async function() {
    this.password = await bcrypt.hash(this.password, saltRounds)
})

export class User {
    @prop({
        required: true,
        trim: true,
        maxlength: 120
    })
    public name!: string

    @prop({
        minlength: 8,
        maxLength: 120,
        required: true
    })
    public password!: string

    @prop({ required: true, unique: true })
    public email!: string

    @prop({ default: Date.now })
    public createdAt?: Date
}

export const UserModel = getModelForClass(User)