import z from "zod";

const createColorSchema = z.object({
    name: z.string().min(3).max(255),
})

export default {
    createColorSchema,

}
