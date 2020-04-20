import { connect, ConnectionOptions } from 'mongoose'

import logger from '../logger'

const db = async () => {
    try {
        const mongoURI: string = process.env.MONGO_URI || ''
        const options: ConnectionOptions = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        }
        await connect(
            mongoURI,
            options
        )
        logger.info('Successfully connected to DB')
    } catch (err) {
        logger.error(err)
        process.exit(1)
    }
}

export default db