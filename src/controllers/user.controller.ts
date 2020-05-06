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

    getProfile = async (req: any, res: Response) => {
        const { _id } = req.user
        const user = await this.userService.getById(_id)
        res.status(OK).json({ status: OK, message: getStatusText(OK), user })
    }

    followUser = async (req: any, res: Response) => {
        const { _id } = req.user
        const { userId } = req.params
        await this.userService.followUser(_id, userId)
        res.status(OK).json({ status: OK, message: getStatusText(OK) })
    }

    unfollowUser = async (req: any, res: Response) => {
        const { _id } = req.user
        const { userId } = req.params
        await this.userService.unfollowUser(_id, userId)
        res.status(OK).json({ status: OK, message: getStatusText(OK) })
    }
}

export default UserController