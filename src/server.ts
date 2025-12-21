import app from './app'
import config from './config/config'
import { initRateLimiter } from './config/rateLimiter'
import databaseService from './service/databaseService'
import logger from './util/logger'
import { Socket } from 'net'

const server = app.listen(config.PORT)

// Socket tracking
const connections = new Set<Socket>()
server.on('connection', (socket) => {
    connections.add(socket)
    socket.on('close', () => connections.delete(socket))
})

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ; (async () => {
        try {
            // Database Connection
            const connection = await databaseService.connect()
            logger.info(`DATABASE_CONNECTION`, {
                meta: {
                    CONNECTION_NAME: connection.name
                }
            })

            initRateLimiter(connection)
            logger.info(`RATE_LIMITER_INITIATED`)

            logger.info(`APPLICATION_STARTED`, {
                meta: {
                    PORT: config.PORT,
                    SERVER_URL: config.SERVER_URL
                }
            })
        } catch (err) {
            logger.error(`APPLICATION_ERROR`, { meta: err })

            server.close((error) => {
                if (error) {
                    logger.error(`APPLICATION_ERROR`, { meta: error })
                }

                process.exit(1)
            })
        }
    })()

const gracefulShutdown = (signal: string) => {
    logger.info(`RECEIVED_SIGNAL`, { meta: { signal } })

    // Force exit after 5 seconds
    setTimeout(() => {
        logger.error(`FORCED_SHUTDOWN`, { meta: { signal } })
        process.exit(1)
    }, 5000).unref()

    // Destroy all active connections
    for (const socket of connections) {
        socket.destroy()
    }

    server.close(async (error) => {
        if (error) {
            logger.error(`SHUTDOWN_ERROR`, { meta: error })
        }

        try {
            await databaseService.disconnect()
            logger.info(`DATABASE_DISCONNECTED`)
        } catch (dbError) {
            logger.error(`DATABASE_DISCONNECT_ERROR`, { meta: dbError })
        }

        process.exit(0)
    })
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.once('SIGUSR2', () => gracefulShutdown('SIGUSR2'))
