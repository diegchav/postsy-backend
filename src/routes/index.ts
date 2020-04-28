import express from 'express'

import AuthRouter from './auth.router'
import PostRouter from './post.router'
import { AUTH_PATH, POSTS_PATH } from '../constants'

class BaseRouter {
    private _router = express.Router()

    private authRouter = new AuthRouter()
    private postRouter = new PostRouter()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this._router.use(AUTH_PATH, this.authRouter.router)
        this._router.use(POSTS_PATH, this.postRouter.router)
    }

    get router() {
        return this._router
    }
}

export default BaseRouter