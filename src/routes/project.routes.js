import {getProject,
    createProject,
    updateProject,
    deleteProject,
    addmemberToProject,
    getProjectMembers,
    updateProjectMemberRole,
    getAllProjects,
    deleteProjectMember} from "../controllers/project.controllers.js";

import {validateProjectPermission,verifyJWT} from "../middlewares/auth.middleware.js";
import { AvailableRole, UserRole } from "../utils/constants.js";
import { Router } from "express";


    const router = Router();

    router.get(
        "/",
        verifyJWT,
        getAllProjects
      );
    router.get("/:projectId",verifyJWT,validateProjectPermission(AvailableRole),getProject);
    router.post("/",verifyJWT,createProject);   
    router.put("/:projectId",verifyJWT,validateProjectPermission([UserRole.ADMIN]),updateProject);
    router.delete("/:projectId",verifyJWT,validateProjectPermission([UserRole.ADMIN]),deleteProject);


    router.post("/:projectId/members",verifyJWT,validateProjectPermission([UserRole.ADMIN]),addmemberToProject);
    router.get("/:projectId/members",verifyJWT,validateProjectPermission(AvailableRole),getProjectMembers);
    router.put("/:projectId/members/:userId",verifyJWT,validateProjectPermission([UserRole.ADMIN]),updateProjectMemberRole);
    router.delete("/:projectId/members/:userId",verifyJWT,validateProjectPermission([UserRole.ADMIN]),deleteProjectMember);

export default router;