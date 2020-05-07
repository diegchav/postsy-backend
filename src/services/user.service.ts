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

    getById = async (id: string) => {
        const user = await UserModel.findOne({ _id: id })
            .populate('following', '_id name')
            .populate('followers', '_id name')
        return user
    }

    getByEmail = async (email: string) => {
        const user = await UserModel.findOne({ email })
            .select('-following -followers')
        return user
    }

    update = async (id: string, name: string, bio: string = '') => {
        try {
            await UserModel.updateOne(
                {
                    _id: id
                },
                {
                    name,
                    bio
                }
            )
        } catch (err) {
            throw err
        }
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

        // Only follow user if is not being followed yet
        const userToFollow = await UserModel.findOne({ _id: userToFollowId })
        await UserModel.updateOne(
            {
                _id: userId,
                following: { $nin: [userToFollow as User] }
            },
            {
                $push: { following: userToFollow as User }
            }
        )

        // Add signed in user to the followers list of the user being followed
        const user = await UserModel.findOne({ _id: userId })
        await UserModel.updateOne(
            {
                _id: userToFollowId,
                followers: { $nin: [user as User] }
            },
            {
                $push: { followers: user as User }
            }
        )
    }

    unfollowUser = async (userId: string, userToUnfollowId: string) => {
        // Prevent users unfollow themeselves
        if (userId === userToUnfollowId) return

        const userToUnfollow = await UserModel.findOne({ _id: userToUnfollowId })
        await UserModel.updateOne(
            {
                _id: userId,
                following: { $in: [userToUnfollow as User] }
            },
            {
                $pull: { following: userToUnfollow?._id }
            }
        )

        // Remove signed in user from the followers list of the user being
        // unfollowed
        const user = await UserModel.findOne({ _id: userId })
        await UserModel.updateOne(
            {
                _id: userToUnfollowId,
                followers: { $in: [user as User] }
            },
            {
                $pull: { followers: user?._id }
            }
        )
    }
}

export default UserService