import { BAD_REQUEST } from 'http-status-codes'

import HttpException from './http-exception'

export default class AuthenticationException extends HttpException {
    constructor() {
        super(BAD_REQUEST, 'Authentication Error', [{ error: 'Invalid username or password' }])
    }
}