import { NextFunction, Request, Response } from 'express'
import httpResponse from '../util/httpResponse'
import responseMessage from '../constant/responseMessage'
import httpError from '../util/httpError'
import User, { IUser } from '../model/userModel'
import logger from '../util/logger'
import jwt from 'jsonwebtoken'
import { REFRESH_TOKEN_SECRET } from '../config/env'

const generateAccessAndRefereshTokens = async (userId: string) => {
    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new Error("User not found")
        }
        logger.info("checking methods for user=>", {
            meta: {
                userId: user._id,
                hasGenerateAccessToken: typeof user.generateAccessToken === 'function',
                hasGenerateRefreshToken: typeof user.generateRefreshToken === 'function'
            }
        });
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        logger.error("Error in generateAccessAndRefereshTokens", { meta: error })
        throw new Error("Something went wrong while generating referesh and access token")
    }
}

export default {
    signup: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, password, mobile }: { name: string, email: string, password: string, mobile?: string } = req.body;

            const existingUser = await User.findOne({ email })
            if (existingUser) {
                return httpError(next, new Error("User already exists"), req, 400)
            }
            const user = await User.create({ name, email, password, mobile });
            if (!user) {
                return httpError(next, new Error("User not created"), req, 500)
            }

            const createdUser = await User.findById(user._id).select(
                "-password -refreshToken"
            )
            if (!createdUser) {
                return httpError(next, new Error("User not found"), req, 500)
            }
            httpResponse(req, res, 201, responseMessage.SUCCESS, createdUser)
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body
            console.log(email);
            const user = await User.findOne({ email }) as IUser | null
            if (!user) {
                return httpError(next, new Error("User not found"), req, 400)
            }
            const isPasswordCorrect = await user.isPasswordCorrect(password)
            if (!isPasswordCorrect) {
                return httpError(next, new Error("Invalid password"), req, 400)
            }
            const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id as string)
            httpResponse(req, res, 200, responseMessage.SUCCESS, { accessToken, refreshToken })
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },
    refreshAccessToken: async (req: Request, res: Response, next: NextFunction) => {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

        if (!incomingRefreshToken) {
            return httpError(next, new Error("unauthorized request"), req, 401)
        }

        try {
            const decodedToken = jwt.verify(
                incomingRefreshToken,
                REFRESH_TOKEN_SECRET
            ) as { _id: string }

            logger.info("decodedToken", {
                meta: {
                    decodedToken
                }
            })

            const user = await User.findById(decodedToken?._id)

            if (!user) {
                return httpError(next, new Error("Invalid refresh token"), req, 401)
            }

            if (incomingRefreshToken !== user?.refreshToken) {
                return httpError(next, new Error("Refresh token is expired or used"), req, 401)

            }

            const options = {
                httpOnly: true,
                secure: true
            }

            const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefereshTokens(user._id as string)
            res.cookie("refreshToken", newRefreshToken, options)
                .cookie("accessToken", accessToken, options)
                .status(200);
            return httpResponse(
                req,
                res,
                200,
                responseMessage.SUCCESS,
                { accessToken, refreshToken: newRefreshToken }
            )
        } catch (err) {
            logger.error("Error in refreshAccessToken", { meta: err })
            return httpError(next, err, req, 401)
        }

    },
    updateProfile: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email, mobile } = req.body;
            const userId = (req as any).user?._id;

            const updateData: any = {};
            if (name) updateData.name = name;
            if (email) updateData.email = email;
            if (mobile) updateData.mobile = mobile;
            if (req.file) updateData.profile = req.file.path;

            const user = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).select("-password -refreshToken");

            if (!user) {
                return httpError(next, new Error("User not found"), req, 404);
            }

            httpResponse(req, res, 200, responseMessage.SUCCESS, user);
        } catch (err) {
            httpError(next, err, req, 500);
        }
    }
}
