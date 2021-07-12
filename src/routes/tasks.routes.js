const router = require("express").Router();
const {
  getTasks,
  getTaskById,
  getTotalTasks,
  createTask,
  deleteTask,
  updateTask,
} = require("../controllers/tasks.controller");

// add a seccion with swagger
/**
 * @swagger
 *  tags:
 *    name: Tasks
 *    description: tasks end-point
 */

/**
 * @swagger
 *  /tasks:
 *  get:
 *    summary: Get all tasks
 *    tags: [Tasks]
 */
router.get("/tasks", getTasks);

/**
 * @swagger
 *  /tasks/id:
 *  get:
 *    summary: Get task by id
 *    tags: [Tasks]
 */
router.get("/tasks/:id", getTaskById);
/**
 * @swagger
 *  /taks-total:
 *  get:
 *    summary: Get all tasks
 *    tags: [Tasks]
 */
router.get("/tasks-total", getTotalTasks);

/**
 * @swagger
 *  /tasks:
 *  post:
 *    summary: create a new task
 *    tags: [Tasks]
 */
router.post("/tasks", createTask);

/**
 * @swagger
 *  /tasks/id:
 *  delete:
 *    summary: Delete a task by id
 *    tags: [Tasks]
 */
router.delete("/tasks/:id", deleteTask);

/**
 * @swagger
 *  /tasks/id:
 *  put:
 *    summary: Update a task by id
 *    tags: [Tasks]
 */
router.put("/tasks/:id", updateTask);

module.exports = router;
