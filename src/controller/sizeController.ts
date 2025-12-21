import { NextFunction, Request, Response } from 'express'
import httpResponse from '../util/httpResponse'
import responseMessage from '../constant/responseMessage'
import httpError from '../util/httpError'
import Size from '../model/sizeModel'

export default {
    getAllSize: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sizes = await Size.find();
            httpResponse(req, res, 200, responseMessage.SUCCESS, sizes)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    createSize: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name } = req.body;
            const existingSize = await Size.findOne({ size: name });
            if (existingSize) {
                return httpError(next, new Error("Size already exists"), req, 400)
            }
            const size = await Size.create({ size: name });
            httpResponse(req, res, 200, responseMessage.SUCCESS, size)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    }
}
