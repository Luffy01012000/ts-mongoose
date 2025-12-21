import express, { Application, NextFunction, Request, Response } from 'express'
import path from 'path'
import router from './router/apiRouter'
import globalErrorHandler from './middleware/globalErrorHandler'
import responseMessage from './constant/responseMessage'
import httpError from './util/httpError'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import logger from './util/logger'

const app: Application = express()

// Middleware
app.use(helmet())
app.use(
    morgan('dev', {
        stream: {
            write: (message) => logger.info(message.trim())
        }
    })
)
app.use(
    cors({
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
        origin: ['https://client.com'],
        credentials: true
    })
)
app.use(cookieParser())
app.use(express.json())
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
        res.status(400).json({
            status: 'fail',
            message: 'Malformed JSON in request body',
            error: err.message
        });
        return;
    }
    next();
});
app.use(express.static(path.join(__dirname, '../', 'public')))

// Routes
app.use('/api/v1', router)

// 404 Handler
app.use((req: Request, _: Response, next: NextFunction) => {
    try {
        throw new Error(responseMessage.NOT_FOUND('route'))
    } catch (err) {
        httpError(next, err, req, 404)
    }
})

// Global Error Handler
app.use(globalErrorHandler)

export default app
