import { NextFunction, Request, Response } from 'express'
import httpResponse from '../util/httpResponse'
import responseMessage from '../constant/responseMessage'
import httpError from '../util/httpError'
import Color from '../model/colorModel'

export default {
    getAllColors: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const colors = await Color.find();
            httpResponse(req, res, 200, responseMessage.SUCCESS, colors)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    createColor: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name } = req.body;
            const existingColor = await Color.findOne({ color: name });
            if (existingColor) {
                return httpError(next, new Error("Color already exists"), req, 400)
            }
            const color = await Color.create({ color: name });
            httpResponse(req, res, 200, responseMessage.SUCCESS, color)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    }
}
