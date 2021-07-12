const { getConnection, querys } = require("../database/index");

const getTasks = async (req, res) => {
  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querys.getTasks);

    res.status(200);
    res.json({
      succes: true,
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
    const [rows] = await pool.query(querys.getTaskById, [id]);

    if (rows[0] === undefined) {
      return res.status(404).json({
        succes: false,
        message: "task doesn't exist",
      });
    }

    res.status(200);
    res.json({
      succes: true,
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
    const result = await pool.execute(querys.getAllTasks);

    res.status(200);
    res.json({
      succes: true,
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
      succes: false,
      message: "bad request, please fill field title",
    });
  }

  try {
    const pool = await getConnection();
    const result = await pool.execute(querys.createNewTask, {
      title: title,
      description: description,
    });

    res.status(200).json({
      succes: true,
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
    const result = await pool.execute(querys.deleteTaskById, { id: id });

    if (result[0]["affectedRows"] === 0) {
      return res.status(404).json({
        succes: false,
        message: "task not found, 0 rows affected",
      });
    }

    res.status(200).json({
      succes: true,
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
      succes: false,
      message: "bad request, please fill all fields",
    });
  }

  try {
    const pool = await getConnection();
    const result = await pool.execute(querys.updateTaskById, {
      title: title,
      description: description,
      id: id,
    });

    if (!result[0]["affectedRows"]) {
      return res.status(404).json({
        succes: false,
        message: "task not found, 0 rows affected",
      });
    }

    res.status(200).json({
      succes: true,
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
