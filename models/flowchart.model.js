import mongoose, { Schema } from 'mongoose'

const flowchartSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    type:{
        type:String,
    }
})

const Flowchart= mongoose.model("Flowchart",flowchartSchema);

export default Flowchart