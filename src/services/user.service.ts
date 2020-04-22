import { BAD_REQUEST } from 'http-status-codes'

import { UserModel, User } from '../models/user.model'
import HttpException from '../common/http-exception'

class UserService {
    create = async (userFields: any) => {
        const { username, password, email } = userFields

        // Check if user already exists
        const existingUser = await UserModel.findOne({ username })
        if (existingUser) {
            const statusCode = BAD_REQUEST
            const errorMessage = 'Validation Error'
            const errors = [{ 'username': 'Username already taken' }]
            throw new HttpException(statusCode, errorMessage, errors)
        }

        const user = await UserModel.create({
            username: username,
            password: password,
            email: email
        } as User)
        return user
    }
}

export default UserService