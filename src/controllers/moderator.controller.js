const { getConnection } = require("../database/index");
const { getUsers } = require("../database/querysModerator");
const { user } = require("../lib/roles");

const contentModerator = async (req, res) => {
  try {
    const pool = await getConnection();
    const users = await pool.query(getUsers, [user]);

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

module.exports = {
  contentModerator,
};
