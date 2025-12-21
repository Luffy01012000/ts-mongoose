import { NextFunction, Request, Response } from 'express'
import httpResponse from '../util/httpResponse'
import responseMessage from '../constant/responseMessage'
import httpError from '../util/httpError'
import Category from '../model/categoryModel'

export default {
    getAllCategories: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categories = await Category.find();
            httpResponse(req, res, 200, responseMessage.SUCCESS, categories)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    createCategory: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name } = req.body;
            const existingCat = await Category.findOne({ category: name });
            if (existingCat) {
                return httpError(next, new Error("Category already exists"), req, 400)
            }
            const category = await Category.create({ category: name });
            httpResponse(req, res, 200, responseMessage.SUCCESS, category)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    }
}
