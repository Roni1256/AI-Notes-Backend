import mongoose from 'mongoose'

const folder =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    maximumFiles:{
        type:Number,
        required:true,
        default:10
    },
    tags:[{
        type:String,
    }],
    files:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Note',
        required:true
    }],
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    created:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
    
})

export const Folder= mongoose.model('folders',folder)
