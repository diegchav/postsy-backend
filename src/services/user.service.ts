import { UserModel, User } from '../models/user.model'

import AuthorizationException from '../exceptions/authorization-exception'

class UserService {
    create = async (userFields: any) => {
        const { name, password, email } = userFields
        const user = await UserModel.create({
            name,
            password,
            email
        } as User)
        return { _id: user._id, name: user.name, email: user.email }
    }

    getAll = async (userId: string = '') => {
        const currentUser = await UserModel.findOne({ _id: userId })
        const followedUsers = currentUser?.following || []
        const followedUsersMap: Map<string, boolean> = new Map<string, boolean>()
        followedUsers.forEach((user) => followedUsersMap.set(user.toString(), true))
        const users = await UserModel.find({ _id: { $ne: userId } }).select('-following')
        const usersResult = users.map((user) => (
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                following: followedUsersMap.has(user._id.toString())
            }
        ))
        return usersResult
    }

    getByEmail = async (email: string) => {
        const user = await UserModel.findOne({ email }).select('-following')
        return user
    }

    verifyUser = async (_id: string) => {
        try {
            const user = await UserModel.findOne({ _id })
            if (!user) throw new AuthorizationException()
            return user
        } catch (err) {
            throw err
        }
    }

    followUser = async (userId: string, userToFollowId: string) => {
        // Prevent users follow themeselves
        if (userId === userToFollowId) return

        const userToFollow = await UserModel.findOne({ _id: userToFollowId })

        // Only add user to follow if is not being followed
        await UserModel.updateOne(
            {
                _id: userId,
                following: { $nin: [userToFollow as User] }
            },
            {
                $push: { following: userToFollow as User }
            }
        )
    }
}

export default UserService