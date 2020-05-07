import { modelOptions, pre, prop, arrayProp, Ref, getModelForClass } from '@typegoose/typegoose'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

const saltRounds = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS) || 10)

@modelOptions({
    schemaOptions: {
        toObject: {
            transform: (doc, ret, options) => {
                delete ret.email
                delete ret.password
                delete ret.createdAt
                delete ret.__v
            }
        },
        toJSON: {
            transform: (doc, ret, options) => {
                delete ret.email
                delete ret.password
                delete ret.createdAt
                delete ret.__v
            }
        }
    }
})

@pre<User>('save', async function() {
    this.password = await bcrypt.hash(this.password, saltRounds)

    // Generate avatar from email
    const gravatarUrl = process.env.GRAVATAR_URL
    const gravatarHexPattern = process.env.GRAVATAR_HEX_PATTERN
    const gravatarDefault = process.env.GRAVATAR_DEFAULT
    const regexPattern = new RegExp(gravatarHexPattern!)
    const emailHashed = crypto.createHash('md5').update(this.email).digest('hex')
    this.avatar = gravatarUrl?.replace(regexPattern, emailHashed) || gravatarDefault!
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

    @prop({ default: '' })
    public bio?: string

    @prop({ default: '' })
    public avatar!: string

    @arrayProp({ itemsRef: User })
    public following!: Ref<User>[]

    @arrayProp({ itemsRef: User })
    public followers!: Ref<User>[]

    @prop({ default: Date.now })
    public createdAt?: Date
}

export const UserModel = getModelForClass(User)