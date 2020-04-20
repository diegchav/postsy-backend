export default class HttpException extends Error {
    statusCode: number
    message: string
    error: any | null

    constructor(statusCode: number, message: string, error?: any) {
        super(message)

        this.statusCode = statusCode
        this.message = message
        this.error = error || null
    }
}