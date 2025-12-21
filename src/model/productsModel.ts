import { Schema, model } from 'mongoose'

const productsSchema = new Schema({
    product_name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    color: {
        type: Schema.Types.ObjectId,
        ref: 'Color',
        required: true,
    },
    size: {
        type: Schema.Types.ObjectId,
        ref: 'Size',
        required: true,
    },
    images: {
        type: [String],
        required: true,
    }
}, {
    timestamps: true
})

const Products = model('Products', productsSchema)

export default Products
