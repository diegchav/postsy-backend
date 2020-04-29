import { UserModel, User } from '../models/user.model'

import AuthorizationException from '../exceptions/authorization-exception'

class UserService {
    create = async (userFields: any) => {
        const { username, password, email } = userFields
        const user = await UserModel.create({
            username,
            password,
            email
        } as User)
        return user
    }

    findByEmail = async (email: string) => {
        const user = await UserModel.findOne({ email })
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
}

export default UserService