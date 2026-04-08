import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    getSubtasks,
    createSubtask,
    updateSubtask,
    deleteSubtask
} from '../controllers/task.controller.js';
import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.get("/projects/:projectId/tasks", getTasks);
router.post("/projects/:projectId/tasks",verifyJWT,createTask);
router.put("/tasks/:taskId", updateTask);
router.delete("/tasks/:taskId", deleteTask);

router.get("/tasks/:taskId/subtasks", getSubtasks);
router.post("/tasks/:taskId/subtasks",verifyJWT,createSubtask);
router.put("/subtasks/:subtaskId", updateSubtask);
router.delete("/subtasks/:subtaskId", deleteSubtask);

export default router;