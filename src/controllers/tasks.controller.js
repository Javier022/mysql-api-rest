const { getConnection, querys } = require("../database/index");

const getTasks = async (req, res) => {
  try {
    const pool = await getConnection();
    const result = await pool.execute(querys.getTasks);

    res.status(200);
    res.json({
      succes: true,
      tasks: result[0],
    });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const getTaskById = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getConnection();
    const result = await pool.execute(querys.getTaskById, { id: id });

    res.status(200);
    res.json({
      succes: true,
      task: result[0][0],
    });
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
        title,
        description,
      },
    });
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

    res.status(200).json({
      succes: true,
      message: "task deleted",
    });
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

    res.status(200).json({
      succes: true,
      product: {
        title,
        description,
      },
    });
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
