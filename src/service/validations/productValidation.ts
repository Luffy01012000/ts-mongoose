import z from "zod";
import { NextFunction, Request, Response } from "express";
import httpError from "../../util/httpError";


const createProductSchema = z.object({
    product_name: z.string().min(3).max(255),
    description: z.string().min(3).max(255),
    category: z.string().min(3).max(255),
    color: z.string().min(3).max(255),
    size: z.string().min(3).max(255),
    images: z.array(z.string()).min(1)
})

export const productValidation = async (req: Request, _: Response, next: NextFunction) => {
    try {
        const bodyImages = Array.isArray(req.body.images) ? req.body.images : (req.body.images ? [req.body.images] : []);
        const fileImages = Array.isArray(req.files) ? (req.files as Express.Multer.File[]).map(file => file.path) : [];

        const combinedImages = [...bodyImages, ...fileImages];

        req.body.images = combinedImages;

        const validatedData = createProductSchema.parse(req.body);
        req.body = validatedData;

        next();
    } catch (error: any) {
        return httpError(next, error, req, 400);
    }
}

export default {
    createProductSchema,
    productValidation
}
