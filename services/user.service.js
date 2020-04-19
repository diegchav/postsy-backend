const bcrypt = require('bcrypt')

const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10

const User = require('../models/user')

const create = async (userDTO) => {
    const user = new User(userDTO)
    await hashPassword(user)
    await user.save()
    return user
}

async function hashPassword(user) {
    if (!user.password) throw user.invalidate('password', 'Password is required')
    if (user.password.length < 12) throw user.invalidate('password', 'Password must be at least 12 characters')
    user.password = await bcrypt.hash(user.password, saltRounds)
}

module.exports = {
    create
}