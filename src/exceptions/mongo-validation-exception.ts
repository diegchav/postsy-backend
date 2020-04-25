import { BAD_REQUEST } from 'http-status-codes'

import HttpException from './http-exception'

export default class MongoValidationException extends HttpException {
    constructor(errors: any[]) {
        super(BAD_REQUEST, 'Validation Error', errors)
    }
}