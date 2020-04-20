import { Request, Response, NextFunction } from 'express'
import { STATUS_CODES } from 'http'

import HttpException from '../common/http-exception'
import logger from '../common/logger'

export const logErrors = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
    logger.error(err)
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

    res.status(400).json(errors)
}

export const handleError = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) return next(err)

    const statusCode = err.statusCode || 500
    const errorMessage = STATUS_CODES[statusCode] || 'Internal Error'
    res.status(statusCode).json({ error: errorMessage })
}

export const handleNotFound = (req: Request, res: Response) => {
    const statusCode = 404
    const errorMessage = STATUS_CODES[statusCode]
    res.status(statusCode).json({ error: errorMessage })
}