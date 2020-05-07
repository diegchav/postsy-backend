import { Response } from 'express'
import { body } from 'express-validator'
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

    updateValidation = [
        body('name')
            .not().isEmpty().withMessage('Name is required').bail()
            .isLength({ max: 120 }).withMessage('Name must be at most 120 characters')
    ]

    updateUser = async (req: any, res: Response) => {
        const { _id } = req.user
        const { name, bio } = req.body
        await this.userService.update(_id, name, bio)
        return res.status(OK).json({ status: OK, message: getStatusText(OK) })
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