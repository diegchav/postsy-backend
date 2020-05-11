import { Response } from 'express'
import { body } from 'express-validator'
import { isValidObjectId } from 'mongoose'
import { OK, getStatusText } from 'http-status-codes'

import UserService from '../services/user.service'
import PostService from '../services/post.service'
import FeedService from '../services/feed.service'

import UserNotFoundException from '../exceptions/user-not-found-exception'

class UserController {
    private userService = new UserService()
    private postService = new PostService()
    private feedService = new FeedService()

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

        // Add all posts from user to follow to feeds collection
        const _posts = await this.postService.getAll(userId)
        _posts.forEach(async (post) => {
            await this.feedService.create(
                post._id,
                userId,
                _id,
                post.createdAt
            )
        })

        res.status(OK).json({ status: OK, message: getStatusText(OK) })
    }

    unfollowUser = async (req: any, res: Response) => {
        const { _id } = req.user
        const { userId } = req.params

        await this.userService.unfollowUser(_id, userId)

        // Remove all posts of user to unfollow from feeds collection
        await this.feedService.deleteByPostOwnerId(userId, _id)

        res.status(OK).json({ status: OK, message: getStatusText(OK) })
    }
}

export default UserController