import { Request, Response } from 'express'
import { body } from 'express-validator'
import { OK, CREATED, getStatusText, NO_CONTENT } from 'http-status-codes'

import PostService from '../services/post.service'
import FeedService from '../services/feed.service'
import UserService from '../services/user.service'
import CommentService from '../services/comment.service'
import LikeService from '../services/like.service'

import ForbiddenException from '../exceptions/forbidden-exception'

import getFileLocation from '../helpers/get-file-location'

class PostController {
    private postService = new PostService()
    private feedService = new FeedService()
    private userService = new UserService()
    private commentService = new CommentService()
    private likeService = new LikeService()

    getAll = async (req: any, res: Response) => {
        const { _id } = req.user
        const posts = await this.postService.getForUser(_id)
        res.status(OK).json({ status: OK, message: getStatusText(OK), posts })
    }

    getById = async (req: Request, res: Response) => {
        const { id } = req.params
        const _post = await this.postService.getById(id)
        res.status(OK).json({ status: OK, message: getStatusText(OK), post: _post })
    }

    getForUser = async (req: Request, res: Response) => {
        const userId = req.params.id
        const posts = await this.postService.getForUser(userId)
        res.status(OK).json({ status: OK, message: getStatusText(OK), posts })
    }

    createPostValidation = [
        body('text')
            .not().isEmpty().withMessage('Text for the post is required')
            .isLength({ max: 150 }).withMessage('Posts must be at most 150 characters')
    ]

    create = async (req: any, res: Response) => {
        const { _id } = req.user
        const { text } = req.body

        // Create post
        let imageUrl = ''
        if (req.file) imageUrl = getFileLocation(req)
        const _post = await this.postService.create(_id, text, imageUrl)

        // Add post to feeds collection
        await this.feedService.create(
            _post._id,
            _id,
            _id,
            _post.createdAt)

        // Feed post to all followers
        const _user = await this.userService.getById(_id)
        const _followers = _user?.followers
        _followers?.forEach(async (follower: any) => {
            await this.feedService.create(
                _post.id,
                _id,
                follower._id,
                _post.createdAt
            )
        })

        res.status(CREATED).json({ status: CREATED, message: getStatusText(CREATED) })
    }

    delete = async (req: any, res: Response) => {
        const { id } = req.params
        const userId = req.user._id
        const post = await this.postService.getById(id)
        // Check if the post belongs to the user
        if (!userId.equals(post?.user)) throw new ForbiddenException()

        await this.postService.delete(id)
        res.status(OK).json({ status: OK, message: getStatusText(OK) })
    }

    createCommentValidation = [
        body('text')
            .not().isEmpty().withMessage('Text for the comment is required')
            .isLength({ max: 150 }).withMessage('Comments must be at most 150 characters')
    ]

    createComment = async (req: any, res: Response) => {
        const { text } = req.body
        const postId = req.params.id
        const userId = req.user._id
        await this.commentService.create(text, postId, userId)
        res.status(CREATED).json({ status: CREATED, message: getStatusText(CREATED) })
    }

    getComments = async (req: Request, res: Response) => {
        const postId = req.params.id
        const _comments = await this.commentService.getForPost(postId)
        res.status(OK).json({ status: OK, message: getStatusText(OK), comments: _comments })
    }

    likePost = async (req: any, res: Response) => {
        const postId = req.params.id
        const userId = req.user._id
        await this.likeService.like(postId, userId)
        await this.feedService.like(postId, userId)
        res.status(OK).json({ status: OK, message: getStatusText(OK) })
    }

    dislikePost = async (req: any, res: Response) => {
        const postId = req.params.id
        const userId = req.user._id
        await this.likeService.dislike(postId, userId)
        await this.feedService.dislike(postId, userId)
        res.status(OK).json({ status: OK, message: getStatusText(OK) })
    }
}

export default PostController