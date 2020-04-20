import { Request, Response, NextFunction } from 'express'
import { getStatusText, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status-codes'

import HttpException from '../common/http-exception'
import logger from '../common/logger'

export const logErrors = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
    logger.error(`${err.name}: ${err.message}`)
    logger.error(JSON.stringify(err))
    next(err)
}

export const handleValidationError = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.name !== 'ValidationError') return next(err)

    const errors = Object.values(err.errors).map((e: any) => {
        const { path, message } = e
        return {
            [path]: message
        }
    })

    res.status(BAD_REQUEST).json(errors)
}

export const handleError = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) return next(err)

    const statusCode = err.statusCode || INTERNAL_SERVER_ERROR
    const errorMessage = getStatusText(statusCode) || getStatusText(INTERNAL_SERVER_ERROR)
    res.status(statusCode).json({ error: errorMessage })
}

export const handleNotFound = (req: Request, res: Response) => {
    res.status(NOT_FOUND).json({ error: getStatusText(NOT_FOUND) })
}