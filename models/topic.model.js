import mongoose from "mongoose";

const topicSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    subtopics:[
        {
            type:String
        }
    ],
    notes:{
        type:String
    },
    subject:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subjects"
    }
})

const Topics= mongoose.model("Topics",topicSchema)

export default Topics;