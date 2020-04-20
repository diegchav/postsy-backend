import { Request, Response } from 'express'

import * as userService from '../services/user.service'

export const create = async (req: Request, res: Response) => {
    const userFields = {...req.body}
    const createdUser = await userService.create(userFields)
    const { email, username } = createdUser
    res.json({ email, username })
}