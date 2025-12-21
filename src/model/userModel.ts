import { Schema, model, Document } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt, { SignOptions } from 'jsonwebtoken'
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from '../config/env'

export interface IUser extends Document {
    name: string
    email: string
    password: string
    profile?: string
    mobile?: string
    refreshToken?: string
    isPasswordCorrect(password: string): Promise<boolean>
    generateAccessToken(): string
    generateRefreshToken(): string
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
    },
    mobile: {
        type: String,
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    const options: SignOptions = {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    };
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        ACCESS_TOKEN_SECRET,
        options
    )
}
userSchema.methods.generateRefreshToken = function () {
    const options: SignOptions = {
        expiresIn: REFRESH_TOKEN_EXPIRY,
    };
    return jwt.sign(
        {
            _id: this._id,
        },
        REFRESH_TOKEN_SECRET,
        options
    )
}


const User = model<IUser>('User', userSchema)

export default User