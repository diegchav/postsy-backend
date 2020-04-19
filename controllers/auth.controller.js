const UserService = require('../services/user.service')

const autoCatch = require('../lib/auto-catch')

const create = async (req, res) => {
    const userDTO = req.body
    const createdUser = await UserService.create(userDTO)
    const { email, username } = createdUser
    res.json({ email, username })
}

module.exports = autoCatch({
    create
})