import z from "zod";

const createSizeSchema = z.object({
    name: z.string().min(1).max(255),
})

export default {
    createSizeSchema,

}
