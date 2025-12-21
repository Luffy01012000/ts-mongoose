import httpError from "../util/httpError";
import jwt from "jsonwebtoken"
import User from "../model/userModel";
import { NextFunction, Request, Response } from "express";
import { ACCESS_TOKEN_SECRET } from "../config/env";

export const verifyJWT = async (req: Request, _: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        // console.log(token);
        if (!token) {
            return httpError(next, new Error("Unauthorized request"), req, 401)
        }

        const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET) as { _id: string }

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {

            return httpError(next, new Error("Invalid Access Token"), req, 401)
        }

        req.user = user;
        next()
    } catch (error: any) {
        return httpError(next, new Error(error?.message || "Invalid access token"), req, 401)
    }

}