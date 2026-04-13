import {Project} from "../models/project.models.js";
import {User} from "../models/User.js";
import {ProjectMember} from "../models/projectmember.models.js";
import mongoose from "mongoose";
import { AvailableRole } from "../utils/constants.js";
import APiResponse from "../utils/api-response.js";
import ApiError from "../utils/api-error.js";



const getAllProjects = async (req, res) => {
    const projects = await Project.find({
      createdBy: req.user._id
    });
  
    return res.status(200).json(
      new APiResponse(200, projects, "Projects fetched successfully")
    );
  };

const getProject=async(req,res)=>{
    const{ projectId}=req.params;

    const project=await Project.findById(projectId)

    if (!project) {
        throw new Error(404,"Project Not Found")
    }

    return res.status(200).json(
        new APiResponse(200,project,"Project fetched successfully")
    )
}

const createProject=async(req,res)=>{

    const {name,description}=req.body;

  const project= await Project.create({
        name,
        description,
        createdBy: new mongoose.Types.ObjectId(req.user._id)
    });

    await ProjectMember.create({
        user:new mongoose.Types.ObjectId(req.user._id),
        project:new mongoose.Types.ObjectId(project._id),
        role:AvailableRole.ADMIN
    })

    return res.status(201).json(
        new APiResponse(200,project,"Project created successfully")
    )

}

const updateProject=async(req,res)=>{
    const {name,description}=req.body;
    const {projectId}=req.params;

    const project= await Project.findByIdAndUpdate(
        projectId,
        {
            name,
            description
        },
        {new:true} 
    )
    if (!project) {
        throw new Error(404,"Project not Found")
    }
    return res.status(200).json(
        new APiResponse(200,project,"Project updated successfully")
    )
}

const deleteProject=async(req,res)=>{
    const {projectId}=req.params;

    const project=await Project.findByIdAndDelete(projectId);
    if (!project) {
        throw new Error(404,"Project Not Found");
    }

    return res.status(200).json(

        new APiResponse(200,"Project Deleted Successfully")
    )
}

const addmemberToProject=async(req,res)=>{
    const {email,role}=req.body;  
    const {projectId}=req.params;

    const user= await User.findOne({email})
    if (!user) {
        throw new ApiError(404,"User Not Found")
    }

    await ProjectMember.findOneAndUpdate(
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(projectId)
        },
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(projectId),
            role:role
        },
        {
          new:true,
          upsert:true
        }
    )

    return res.status(201).json(new APiResponse(201,{},"Member added to project successfully"))
}

const getProjectMembers=async(req,res)=>{

    const {projectId}=req.params;
    const project=await Project.findById(projectId);

    if(!project){
        throw new ApiError(404,"Project Not Found")
    }
    // const projectmember=await ProjectMember.find({projectId});

    const projectmember=await ProjectMember.aggregate([
        { 
            //filtering  based on the project id(like where clause in sql)
            $match:{
                project: new mongoose.Types.ObjectId(projectId)
            },
        },
        {
            //joining with the user collection to get the user details(like join in sql)
            $lookup:{
                from:"users",
                localField:"user",
                foreignField:"_id",
                as:"user",
                pipeline:[//to project only the required fields from the user collection(like select in sql)
                    {
                        $project:{
                          _id:1,
                          username:1,
                          fullName:1,
                          avatar:1  
                        }
                    }
                ]
            }
        },

        {
            //$lookup always returns an array so we need convert it into object using $arrayElemAt operator
            $addFields:{
                user:{
                    $arrayElemAt:["$user",0]
                }
            }
        },

        {
            $project:{
                project:1,
                role:1,
                user:1,
                createdAt:1,
                updatedAt:1,
                _id:1,
            }
        }

        
    ]);
    return res.status(200).json(new APiResponse(200,projectmember,"Project members fetched successfully"))
}

const updateProjectMemberRole=async(req,res)=>{
    const {projectId,userId}=req.params;

    const {newRole}=req.body;
    if (!AvailableRole.includes(newRole)) {
        throw new ApiError(400,"Invalid Role");
    }

    let projectMember=await ProjectMember.findOne({
        project:new mongoose.Types.ObjectId(projectId),
        user:new mongoose.Types.ObjectId(userId)

    })
    if (!projectMember) {
        throw new ApiError(404,"Project Member Not Found")
    }
  const projectmember=await ProjectMember.findOneAndUpdate(
        projectMember._id,
        {
            role:newRole
        },
        {
            new:true
        }
    ) 
    if(!projectmember){
        throw new ApiError(404,"Project Member Not Found")
    }

    return res.status(200).json(new APiResponse(200,projectmember,"Project member role updated successfully"))

}

const deleteProjectMember=async(req,res)=>{
    const {projectId,userId}=req.params;

    const projectMember=await ProjectMember.findOneAndDelete({
        project:new mongoose.Types.ObjectId(projectId),
        user:new mongoose.Types.ObjectId(userId)
    })

    if (!projectMember) {
        throw new ApiError(404,"Project Member Not Found")
    }

    return res.status(200).json(new APiResponse(200,{},"Project member removed successfully"))
}


export  {
    getProject,
    createProject,
    updateProject,
    deleteProject,
    addmemberToProject,
    getProjectMembers,
    updateProjectMemberRole,
    deleteProjectMember,
    getAllProjects
}












//Aggregation pipeline is a framework in MongoDB that processes documents through multiple stages, where each stage transforms the data and passes it to the next stage