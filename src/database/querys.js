const getTasks = "SELECT * FROM tasks",
  getTaskById = "SELECT * FROM tasks  WHERE id=:id",
  getAllTasks = "SELECT COUNT (id) FROM tasks",
  createNewTask =
    "INSERT INTO tasks (title, description) VALUES (:title, :description)",
  deleteTaskById = "DELETE FROM tasks WHERE id=:id",
  updateTaskById =
    "UPDATE tasks SET title=:title, description=:description WHERE id=:id";

module.exports = {
  getTasks,
  getTaskById,
  getAllTasks,
  createNewTask,
  deleteTaskById,
  updateTaskById,
};
