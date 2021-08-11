const { getConnection } = require("../database/index");
const { getUsers, deleteUserById } = require("../database/querysAdmin");

const contentAdmin = async (req, res) => {
  try {
    const pool = await getConnection();
    const users = await pool.query(getUsers, [1]);

    res.status(200).json({
      success: true,
      data: users[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  const adminId = req.user.id;
  const { id } = req.params;

  if (adminId == id) {
    return res.status(400).json({
      success: false,
      message: "action denied",
    });
  }

  try {
    const pool = await getConnection();
    const userDeleted = await pool.query(deleteUserById, [id]);

    if (!userDeleted[0].affectedRows) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "user deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  contentAdmin,
  deleteUser,
};
