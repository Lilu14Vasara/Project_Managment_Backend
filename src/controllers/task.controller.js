import  {User}  from "../models/User.js";
import { Task } from "../models/task.models.js";
import {Subtask} from "../models/subtask.model.js";
import ApiResponse from "../utils/api-response.js";
import ApiError from "../utils/api-error.js";
import mongoose from "mongoose";
import { AvailableRole } from "../utils/constants.js";
import { Project } from "../models/project.models.js";



const getTasks = async (req, res) => {
    const{ projectId } = req.params;
    const project = await Project.findById(projectId)

 if (!project) {
    throw new ApiError(404,"Project not found");
 }
   const tasks=await Task.find({
    project:new  mongoose.Types.ObjectId(projectId)
 }).populate("assignedTo","avtar username email");

 return res.status(200).json(new ApiResponse(200,tasks,"Tasks retrieved successfully"));
}
// const getTasks = async (req, res) => {
//     const { projectId } = req.params;
  
//     const tasks = await Task.find({ project: projectId })
//       .populate("assignedTo", "username");
  
//     return res.status(200).json(
//       new ApiResponse(200, tasks, "Tasks retrieved successfully")
//     );
//   };

const getTaskById = async (req, res) => {
    const{taskId} = req.params;
    
    const task=await Task.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(taskId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"assignedTo",
                foreignField:"_id",
                as:"assignedTo",
                pipeline: [
                    {
                      $project: {
                        _id: 1,
                        username: 1,
                        fullName: 1,
                        avtar: 1
                      }
                    }
                  ]
            }
        },
        {
            $lookup:{
                from:"subtasks",
                localField:"_id",
                foreignField:"task",
                as:"subtasks",
                pipeline:[{
                    $lookup:{
                        from:"users",
                        localField:"createdBy",
                        foreignField:"_id",
                        as:"createdBy",
                        pipeline:[
                            {

                                $project:{
                                    _id:1,
                                    username:1,
                                    fullName:1,
                                    avtar:1
                                }
                            }
                        ]
                    }
                },
            {
             $addFields:{
                createdBy:{
                    $arrayElemAt:["$createdBy",0]
                }
             }   
            }]
            }
        },
        {
            $addFields:{
                assignedTo:{
                    $arrayElemAt:["$assignedTo",0]
                }
            }
        }
    ]);

    if (!task || task.length===0) {
        throw new ApiError(404,"Task not found");
    }
    return res.status(200).json(new ApiResponse(200,"Task retrieved successfully",task[0]));

}
const createTask = async (req, res) => {
    const { title, description, assignedTo, status } = req.body;
    const { projectId } = req.params;
  
    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(404, "Project not found");
    }
  
    const files = req.files || [];
  
    const attachments = files.map((file) => ({
      url: `${process.env.BASE_URL}/images/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size
    }));
  
    const task = await Task.create({
      title,
      description,
      assignedTo: assignedTo
        ? new mongoose.Types.ObjectId(assignedTo)
        : null,
      project: new mongoose.Types.ObjectId(projectId),
      status,
      assignedBy: new mongoose.Types.ObjectId(req.user._id),
      attachments
    });
  
    const createdTask = await Task.findById(task._id)
      .populate("assignedTo", "username email")
      .populate("assignedBy", "username");
  
      return res.status(200).json(
        new ApiResponse(200, task, "Tasks retrieved successfully")
      );
};

const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, description, status, assignedTo } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (assignedTo) {
        task.assignedTo = new mongoose.Types.ObjectId(assignedTo);
    }

    await task.save();

    return res
        .status(200)
        .json(new ApiResponse(200, "Task updated successfully", task));
};
const deleteTask = async (req, res) => {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    await Subtask.deleteMany({ task: task._id });

    await task.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, "Task deleted successfully"));
};

const getSubtasks = async (req, res) => {
    const { taskId } = req.params;
  
    const subtasks = await Subtask.find({
      task: new mongoose.Types.ObjectId(taskId),
    }).populate("createdBy", "username fullName avtar");
  
    return res.status(200).json(
      new ApiResponse(200, subtasks, "Subtasks fetched successfully")
    );
  };
const createSubtask = async (req, res) => {
    const { taskId } = req.params;
    const { title } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const subtask = await Subtask.create({
        title,
        task: task._id,
        createdBy: new mongoose.Types.ObjectId(req.user._id)
    });

    return res
        .status(201)
        .json(new ApiResponse(201, "Subtask created successfully", subtask));
};
const updateSubtask = async (req, res) => {
    const { subtaskId } = req.params;
    const { title, isCompleted } = req.body;

    const subtask = await Subtask.findById(subtaskId);

    if (!subtask) {
        throw new ApiError(404, "Subtask not found");
    }

    if (title) subtask.title = title;
    if (typeof isCompleted === "boolean") {
        subtask.isCompleted = isCompleted;
    }

    await subtask.save();

    return res
        .status(200)
        .json(new ApiResponse(200, "Subtask updated successfully", subtask));
};
const deleteSubtask = async (req, res) => {
    const { subtaskId } = req.params;
    const subtask = await Subtask.findById(subtaskId);
    if (!subtask) {
        throw new ApiError(404, "Subtask not found");
    }
    await subtask.deleteOne();
    return res
        .status(200)
        .json(new ApiResponse(200, "Subtask deleted successfully"));
};

export   {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getSubtasks,
    createSubtask,
    updateSubtask,
    deleteSubtask
}
