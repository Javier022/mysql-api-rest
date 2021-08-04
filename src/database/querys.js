const getTasks = "SELECT * FROM tasks WHERE user_id=?",
  getTaskById = "SELECT * FROM tasks  WHERE user_id=? AND id=?",
  getAllTasks = "SELECT COUNT (id) FROM tasks WHERE user_id=:user_id",
  createNewTask =
    "INSERT INTO tasks (title, description, user_id) VALUES (:title, :description, :user_id)",
  deleteTaskById = "DELETE FROM tasks WHERE id=:id AND user_id=:user_id",
  updateTaskById =
    "UPDATE tasks SET title=:title, description=:description WHERE id=:id AND user_id=:user_id";

module.exports = {
  getTasks,
  getTaskById,
  getAllTasks,
  createNewTask,
  deleteTaskById,
  updateTaskById,
};
