import { Request, Response, NextFunction, RequestHandler } from 'express'

export default (handler: RequestHandler) => {
    return async (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(handler(req, res, next)).catch(next)
};