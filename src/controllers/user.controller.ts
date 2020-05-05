import { Response } from 'express'
import { OK, getStatusText } from 'http-status-codes'

import UserService from '../services/user.service'

class UserController {
    private userService = new UserService()

    getAll = async (req: any, res: Response) => {
        const { _id } = req.user
        const users = await this.userService.getAll(_id)
        res.status(OK).json({ status: OK, message: getStatusText(OK), users })
    }
}

export default UserController