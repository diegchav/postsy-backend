import { Request, Response } from 'express'
import { OK, getStatusText } from 'http-status-codes'

import UserService from '../services/user.service'

class UserController {
    private userService = new UserService()

    getAll = async (req: Request, res: Response) => {
        const users = await this.userService.getAll()
        res.status(OK).json({ status: OK, message: getStatusText(OK), users })
    }
}

export default UserController