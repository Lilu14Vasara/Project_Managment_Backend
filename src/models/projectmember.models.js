import mongoose,{Schema} from "mongoose";
import {AvailableRole} from "../utils/constants.js";
import {Project} from "./project.models.js";

const projectMemberSchema=new Schema({
    
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    project:{
        type:Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    role:{
        type:String,
        enum:AvailableRole,
        default:AvailableRole[0],
        required:true
    }
},{
    timestamps:true
})

export const ProjectMember=mongoose.model("ProjectMember",projectMemberSchema);//project member model export name converted to lower with end s