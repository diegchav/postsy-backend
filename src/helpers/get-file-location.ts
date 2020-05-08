import getServerUrl from './get-server-url'

import { AWS_UPLOAD } from '../constants'

export default (req: any) => {
    if (AWS_UPLOAD) {
        return req.file.location
    } else {
        const serverUrl = getServerUrl(req)
        return `${serverUrl}/uploads/${req.file.filename}`
    }
}