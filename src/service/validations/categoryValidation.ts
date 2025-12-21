import z from "zod";

const createCategorySchema = z.object({
    name: z.string().min(3).max(255),
})

export default {
    createCategorySchema,

}
