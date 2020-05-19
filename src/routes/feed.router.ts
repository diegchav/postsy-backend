import { Router } from 'express'

import AuthController from '../controllers/auth.controller'
import FeedController from '../controllers/feed.controller'

import autoCatch from '../helpers/auto-catch'

class FeedRouter {
    private _router = Router()

    private authController = new AuthController()
    private feedController = new FeedController()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this._router.get('/',
            this.authController.validateUser,
            autoCatch(this.feedController.getAll))
    }

    get router() {
        return this._router
    }
}

export default FeedRouter