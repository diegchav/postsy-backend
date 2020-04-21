import express from 'express'

import AuthRouter from './auth.router'
import { AUTH_PATH } from '../constants'

class BaseRouter {
    private _router = express.Router()

    private authRouter = new AuthRouter()

    constructor() {
        this.initializeRoutes()
    }

    private initializeRoutes() {
        this._router.use(AUTH_PATH, this.authRouter.router)
    }

    get router() {
        return this._router
    }
}

export default BaseRouter