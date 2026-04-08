import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import  ApiError  from "../utils/api-error.js";
import { ProjectMember } from "../models/projectmember.models.js";
import mongoose from "mongoose";

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
};

export const validateProjectPermission=(roles=[])=>{
  return async(req,res,next)=>{
    const {projectId}=req.params;

    if (!projectId) {
      throw new ApiError(400,"Project Id is missing")
    }

   const project= await ProjectMember.findOne({
      project:new mongoose.Types.ObjectId(projectId),
      user:new mongoose.Types.ObjectId(req.user._id)
    })

    if (!project) {
      throw new ApiError(400,"Project is not found")
    }

    const givenRole=project?.role;

    if (!roles.includes(givenRole)) {
      throw new ApiError(403,"You don't have permission to perform this action")
    }

 
 
    next();}
}