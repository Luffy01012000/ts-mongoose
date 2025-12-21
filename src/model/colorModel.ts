import { Schema, model } from 'mongoose'

const colorSchema = new Schema({
    color: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
})

const Color = model('Color', colorSchema)

export default Color
