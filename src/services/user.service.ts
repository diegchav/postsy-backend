import { } from 'express'

import { UserModel, User } from '../models/user.model'

export const create = async (userFields: any) => {
    const { username, password, email } = userFields

    const user = await UserModel.create({
        username: username,
        password: password,
        email: email
    } as User)
    
    return user
}