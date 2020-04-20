import { createLogger, format, transports } from 'winston' 
const { File, Console } = transports

// Init logger
const logger = createLogger({
    level: 'info'
})

/*
 * For production write all logs with level `info` and bellow to `combined.log`
 * and all logs with level `error` and bellow to `error.log`.
 */
if (process.env.NODE_ENV === 'production') {
    const fileFormat = format.combine(
        format.timestamp(),
        format.json()
    )
    const errorTransport = new File({
        filename: './logs/error.log',
        format: fileFormat,
        level: 'error'
    })
    const infoTransport = new File({
        filename: './logs/combined.log',
        format: fileFormat
    })
    logger.add(errorTransport)
    logger.add(infoTransport)
} else {
    const errorStackFormat = format((info) => {
        if (info.stack) {
            // tslint:disable-next-line:no-console
            console.log(info.stack)
            return false
        }
        return info
    })
    const consoleTransport = new Console({
        format: format.combine(
            format.colorize(),
            format.simple(),
            errorStackFormat()
        )
    })
    logger.add(consoleTransport)
}

export default logger