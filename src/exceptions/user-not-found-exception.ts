import { NOT_FOUND } from 'http-status-codes'

import HttpException from './http-exception'

export default class UserNotFoundException extends HttpException {
    constructor() {
        super(NOT_FOUND, 'User Not Found Error', [{ error: 'User not found' }])
    }
}