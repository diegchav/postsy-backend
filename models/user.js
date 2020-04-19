const cuid = require('cuid')
const { isAlphanumeric, isEmail } = require('validator')

const db = require('../db/index')

const User = db.model('User', {
    _id: { type: String, default: cuid },
    username: usernameSchema(),
    password: { type: String, maxLength: 120, required: 'Password is required' },
    email: emailSchema({ required: 'Email is required' }),
    createdAt: { type: Date, default: Date.now }
})

function usernameSchema() {
    return {
        type: String,
        required: 'Username is required',
        unique: true,
        lowercase: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [16, 'Username must be less than 16 characters'],
        validate: [
            {
                validator: isAlphanumeric,
                message: props => `${props.value} contains special characters`
            },
            {
                validator: str => !str.match(/^admin$/i),
                message: props => `Invalid username`
            },
            {
                validator: function(username) { return isUnique(this, username) },
                message: props => 'Username already taken'
            }
        ]
    }
}

async function isUnique(doc, username) {
    const existing = await User.findOne({ username })
    return !existing || doc._id === existing._id
}

function emailSchema(opts = []) {
    const { required } = opts
    return {
        type: String,
        required,
        validate: {
            validator: isEmail,
            message: props => `${props.value} is not a valid email address`
        }
    }
}

module.exports = User