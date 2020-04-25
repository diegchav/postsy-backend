import { UserModel, User } from '../models/user.model'

class UserService {create = async (userFields: any) => {
        const { username, password, email } = userFields
        const user = await UserModel.create({
            username: username,
            password: password,
            email: email
        } as User)
        return user
    }

    findByEmail = async (email: string) => {
        const user = await UserModel.findOne({ email })
        return user
    }
}

export default UserService