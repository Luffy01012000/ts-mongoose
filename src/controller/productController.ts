import { NextFunction, Request, Response } from 'express'
import httpResponse from '../util/httpResponse'
import responseMessage from '../constant/responseMessage'
import httpError from '../util/httpError'
import Products from '../model/productsModel'
export default {
    getAllProducts: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { category, color, size, product_name, page = '1', limit = '10' } = req.query;

            const filter: any = {};
            if (category) filter.category = category;
            if (color) filter.color = color;
            if (size) filter.size = size;
            if (product_name) filter.product_name = { $regex: product_name, $options: 'i' };

            const skip = (Number(page) - 1) * Number(limit);

            const products = await Products.find(filter)
                .populate('category')
                .populate('color')
                .populate('size')
                .skip(skip)
                .limit(Number(limit))
                .exec();

            const formattedProducts = products.map((p: any) => ({
                _id: p._id,
                "Product name": p.product_name,
                "Description": p.description,
                "Color name": p.color?.color,
                "Size size": p.size?.size,
                "Category name": p.category?.category
            }));

            httpResponse(req, res, 200, responseMessage.SUCCESS, formattedProducts)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    createProduct: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { product_name, description, category, color, size, images } = req.body;
            const existingProduct = await Products.findOne({ product_name });
            if (existingProduct) {
                return httpError(next, new Error("Product already exists"), req, 400)
            }
            const product = await Products.create({ product_name, description, category, color, size, images });
            httpResponse(req, res, 200, responseMessage.SUCCESS, product)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    }
}
