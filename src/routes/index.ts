import express from 'express'

import AuthRouter from './auth.router'
import PostRouter from './post.router'
import UserRouter from './user.router'
import FeedRouter from './feed.router'

import {
    AUTH_PATH,
    POSTS_PATH,
    USERS_PATH,
    FEEDS_PATH
} from '../constants'

class BaseRouter {
    private _router = express.Router()

    private authRouter = new AuthRouter()
    private postRouter = new PostRouter()
    private userRouter = new UserRouter()
    private feedRouter = new FeedRouter()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this._router.use(AUTH_PATH, this.authRouter.router)
        this._router.use(POSTS_PATH, this.postRouter.router)
        this._router.use(USERS_PATH, this.userRouter.router)
        this._router.use(FEEDS_PATH, this.feedRouter.router)
    }

    get router() {
        return this._router
    }
}

export default BaseRouter