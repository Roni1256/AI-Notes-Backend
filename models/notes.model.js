import mongoose from 'mongoose'

const note= new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true
    },
    notes:{
        type:String,
        required:true
    },
    category:{
        type:String,
        default:'General'
    },
    tags:{
        type:[String],
        default:[]
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})



export const  Note=mongoose.model('Note',note)
