import { Response } from 'express'
import { isValidObjectId } from 'mongoose'
import { OK, getStatusText } from 'http-status-codes'

import UserService from '../services/user.service'

import UserNotFoundException from '../exceptions/user-not-found-exception'

class UserController {
    private userService = new UserService()

    getAll = async (req: any, res: Response) => {
        const { _id } = req.user
        const users = await this.userService.getAll(_id)
        res.status(OK).json({ status: OK, message: getStatusText(OK), users })
    }

    getUser = async (req: any, res: Response) => {
        const { id } = req.params
        if (!isValidObjectId(id)) throw new UserNotFoundException()
        const user = await this.userService.getById(id)
        return res.status(OK).json({ status: OK, message: getStatusText(OK), user })
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