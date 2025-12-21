import { Schema, model } from 'mongoose'

const sizeSchema = new Schema({
    size: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
})

const Size = model('Size', sizeSchema)

export default Size
