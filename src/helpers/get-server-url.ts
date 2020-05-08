import { Request } from 'express'
import url from 'url'

export default (req: Request) => {
    return url.format({ protocol: req.protocol, host: req.get('host') })
}