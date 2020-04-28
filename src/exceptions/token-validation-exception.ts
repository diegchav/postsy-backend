import { UNAUTHORIZED } from 'http-status-codes'

import HttpException from './http-exception'

export default class TokenValidationException extends HttpException {
    constructor() {
        super(UNAUTHORIZED, 'Token Validation Error', [{ error: 'Invalid token' }])
    }
}