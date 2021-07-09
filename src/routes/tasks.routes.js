const router = require("express").Router();
const {
  getTasks,
  getTaskById,
  getTotalTasks,
  createTask,
  deleteTask,
  updateTask,
} = require("../controllers/tasks.controller");

router.get("/tasks", getTasks);

router.get("/tasks/:id", getTaskById);

router.get("/tasks-total", getTotalTasks);

router.post("/tasks", createTask);

router.delete("/tasks/:id", deleteTask);

router.put("/tasks/:id", updateTask);

module.exports = router;
