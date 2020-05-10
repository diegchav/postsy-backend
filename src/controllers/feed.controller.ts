import { Response } from 'express'

import FeedService from '../services/feed.service'
import { OK, getStatusText } from 'http-status-codes'

class FeedController {
    private feedService = new FeedService()

    getAll = async (req: any, res: Response) => {
        const { _id } = req.user
        const feeds = await this.feedService.getAll(_id)
        res.status(OK).json({ status: OK, message: getStatusText(OK), feeds })
    }
}

export default FeedController