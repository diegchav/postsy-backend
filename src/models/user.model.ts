import { pre, prop, getModelForClass } from '@typegoose/typegoose'
import bcrypt from 'bcrypt'
import cuid from 'cuid'
import isAlphanumeric from 'validator/lib/isAlphanumeric'
import isEmail from 'validator/lib/isEmail'

const saltRounds = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS) || 10)

@pre<User>('save', async function() {
    if (this.password.length < 12) throw this.invalidate('password', 'Password must be at least 12 characters')
    this.password = await bcrypt.hash(this.password, saltRounds)
})

export class User {
    @prop({ default: cuid })
    public _id?: string

    @prop({
        required: 'Username is required',
        unique: true,
        lowercase: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [16, 'Username must be less than 16 characters'],
        validate: [
            {
                validator: isAlphanumeric,
                message: 'Username contains special characters'
            },
            {
                validator: str => !str.match(/^admin$/i),
                message: 'Invalid username'
            }
        ]
    },)
    public username!: string

    @prop({
        maxLength: 120,
        required: 'Password is required'
    })
    public password!: string

    @prop({
        required: 'Email is required',
        validate: {
            validator: isEmail,
            message: 'Invalid email address'
        }
    })
    public email!: string

    @prop({ default: Date.now })
    public createdAt?: Date
}

export const UserModel = getModelForClass(User)