import mongoose from 'mongoose'
import express from 'express'
const app = express()
export const connectToDb = async (PORT) => {
    try {
        const res=await mongoose.connect(String(process.env.MONGO_URI))
        console.log("Database connected!");
    } catch (err) {
        console.log("Error:", err.message)
    }
}