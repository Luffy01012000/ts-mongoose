import mongoose from 'mongoose'
import config from '../config/config'

export default {
    connect: async () => {
        try {
            await mongoose.connect(config.DATABASE_URL as string)
            return mongoose.connection
        } catch (err) {
            throw err
        }
    },
    disconnect: async () => {
        try {
            await mongoose.disconnect()
        } catch (err) {
            throw err
        }
    }
}
