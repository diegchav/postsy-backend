import { UNAUTHORIZED, getStatusText } from 'http-status-codes'

import HttpException from './http-exception'

export default class AuthorizationException extends HttpException {
    constructor() {
        super(UNAUTHORIZED, 'Authorization Error', [{ error: getStatusText(UNAUTHORIZED) }])
    }
}