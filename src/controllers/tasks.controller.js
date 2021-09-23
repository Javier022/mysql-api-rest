const { getConnection, querys } = require("../database/index");

const getTasks = async (req, res) => {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querys.getTasks, [req.user.id]);

    res.status(200).json({
      success: true,
      tasks: rows,
    });

    pool.end();
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querys.getTaskById, [req.user.id, id]);

    if (rows[0] === undefined) {
      return res.status(404).json({
        success: false,
        message: "task doesn't exist",
      });
    }

    res.status(200);
    res.json({
      success: true,
      task: rows[0],
    });

    pool.end();
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const getTotalTasks = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.execute(querys.getAllTasks, {
      user_id: req.user.id,
    });

    res.status(200);
    res.json({
      success: true,
      tasks: result[0][0]["COUNT (id)"],
    });

    pool.end();
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const createTask = async (req, res) => {
  const { title, description } = req.body;

  if (!title.trim()) {
    return res.status(400).json({
      success: false,
      message: "bad request, please fill field title",
    });
  }

  try {
    const pool = await getConnection();
    const result = await pool.execute(querys.createNewTask, {
      title: title,
      description: description,
      user_id: req.user.id,
    });

    res.status(200).json({
      success: true,
      task: {
        id: result[0]["insertId"],
        title,
        description,
      },
    });

    pool.end();
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getConnection();
    const result = await pool.execute(querys.deleteTaskById, {
      id: id,
      user_id: req.user.id,
    });

    if (result[0]["affectedRows"] === 0) {
      return res.status(404).json({
        success: false,
        message: "task not found, 0 rows affected",
      });
    }

    res.status(200).json({
      success: true,
      message: "task deleted",
      id_task: id,
    });

    pool.end();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!(title.trim() && description.trim())) {
    return res.status(400).json({
      success: false,
      message: "bad request, please fill all fields",
    });
  }

  try {
    const pool = await getConnection();
    const result = await pool.execute(querys.updateTaskById, {
      title: title,
      description: description,
      id: id,
      user_id: req.user.id,
    });

    if (!result[0]["affectedRows"]) {
      return res.status(404).json({
        success: false,
        message: "task not found, 0 rows affected",
      });
    }

    res.status(200).json({
      success: true,
      task: {
        title,
        description,
      },
    });

    pool.end();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  getTotalTasks,
  createTask,
  deleteTask,
  updateTask,
};
