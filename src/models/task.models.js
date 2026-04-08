import mongoose, {Schema} from "mongoose";

import {TaskStatus,AvailableTaskStatus} from "../utils/constants.js";

const taskSchema=new Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    project:{
        type:Schema.Types.ObjectId,
        ref:'Project',
        required:true
    }, 
    assignedTo:{
        type:Schema.Types.ObjectId,
        ref:'Project'
    },
    assignedBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    status:{
        type:String,
        enum:AvailableTaskStatus,
        default:TaskStatus.TODO
    },
    attachments:{
        type:[{
            url:String,
            mimetype:String
        }],
        default:[] 
    }
},{
    timestamps:true
})

export const Task=mongoose.model('Task',taskSchema)