import z from "zod";

const signupSchema = z.object({
    name: z.string().min(3).max(255),
    email: z.email(),
    password: z.string().min(6).max(255),
    mobile: z.string().optional(),
})

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(255),
})

const refreshTokenSchema = z.object({
    refreshToken: z.string(),
})

export default {
    signupSchema,
    loginSchema,
    refreshTokenSchema
}
