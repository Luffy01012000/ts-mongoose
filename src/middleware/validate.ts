import { ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";
import logger from "../util/logger";

interface ValidateOptions {
    file?: {
        required?: boolean;
        maxCount?: number;
    };
}

export const validate =
    (schema: ZodTypeAny, options?: ValidateOptions) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                if (req.body && Object.keys(req.body).length > 0) {
                    logger.info("Validation Body", { meta: { body: req.body } });
                }
                req.body = schema.parse(req.body);

                if (options?.file) {
                    const files = req.file || req.files;

                    if (options.file.required && !files) {
                        return res.status(400).json({
                            status: "fail",
                            message: "Image file is required",
                        });
                    }

                    if (Array.isArray(files) && options.file.maxCount) {
                        if (files.length > options.file.maxCount) {
                            return res.status(400).json({
                                status: "fail",
                                message: `Maximum ${options.file.maxCount} files allowed`,
                            });
                        }
                    }
                }

                next();
                return;
            } catch (error: any) {
                res.status(400).json({
                    status: "fail",
                    errors: error.errors?.map((e: any) => ({
                        field: e.path.join("."),
                        message: e.message,
                    })) ?? error.message,
                });
                return;
            }
        };
