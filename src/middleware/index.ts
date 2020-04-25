import { Request, Response, NextFunction } from 'express'
import { MongoError } from 'mongodb'
import { getStatusText, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } from 'http-status-codes'

import HttpException from '../exceptions/http-exception'
import MongoValidationException from '../exceptions/mongo-validation-exception'
import logger from '../common/logger'
import { capitalize } from '../common/util'

import { MONGO_DUP_KEY } from '../constants'

export const logErrors = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
    const reqInput = req.body || req.params || req.query
    logger.error(`/${req.method} - ${JSON.stringify(reqInput)}`)
    logger.error(`${err.name}: ${err.message}`)
    logger.error(JSON.stringify(err))
    next(err)
}

/**
 * Handle validation errors thrown by Mongo in case there is an index collision. 
 */
export const handleMongoValidationError = (err: MongoError, req: Request, res: Response, next: NextFunction) => {
    if (err.name !== 'MongoError') return next(err)

    let keyError = 'error'
    let valueError = getStatusText(BAD_REQUEST)
    if (err.code === MONGO_DUP_KEY && err.errmsg) {
        // Extract duplicated key from mongo error
        let errorStr = err.errmsg?.split('dup key:')[1]
        errorStr = errorStr?.replace(/\s/g, '')
        errorStr = errorStr?.replace(/[{}\\"]/g, '')

        keyError = errorStr?.split(':')[0]
        valueError = `${capitalize(keyError)} is already taken`
    }

    const errors = [{ [keyError]: valueError }]
    const mongoValidationException = new MongoValidationException(errors)
    next(mongoValidationException)
}

export const handleError = (err: HttpException, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) return next(err)

    const statusCode = err.statusCode || INTERNAL_SERVER_ERROR
    const errorMessage = err.message || getStatusText(INTERNAL_SERVER_ERROR)
    let errors = null
    if (err.errors) {
        errors = err.errors
    }
    res.status(statusCode).json({ status: statusCode, message: errorMessage, errors })
}

export const handleNotFound = (req: Request, res: Response) => {
    const statusCode = NOT_FOUND
    const errorMessage = getStatusText(statusCode)
    res.status(statusCode).json({ status: statusCode, message: errorMessage })
}