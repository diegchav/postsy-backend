import { FORBIDDEN, getStatusText } from 'http-status-codes'

import HttpException from './http-exception'

export default class ForbiddenException extends HttpException {
    constructor() {
        super(FORBIDDEN, 'Forbidden Error', [{ error: getStatusText(FORBIDDEN) }])
    }
}