const { getConnection } = require("../database/index");
const { querysProfile } = require("../database/index");

const getProfile = async (req, res) => {
  const { id } = req.user;

  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysProfile.getDataProfile, [id]);

    // console.log(rows, "how to rename");

    if (!(rows && rows.length !== 0)) {
      pool.end();
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0],
    });

    pool.end();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const editProfile = async (req, res) => {
  const { id } = req.user;
  const { fullname, location, bio } = req.body;

  try {
    const pool = await getConnection();
    const [rows] = await pool.query(querysProfile.editProfile, [
      fullname,
      location,
      bio,
      id,
    ]);

    if (rows.affectedRows === 0) {
      pool.end();
      return res.status(304).json({
        success: false,
        message: "profile not updated",
      });
    }

    res.status(200).json({
      success: true,
      message: "profile updated",
      data: {
        fullname,
        location,
        bio,
      },
    });

    pool.end();
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = {
  getProfile,
  editProfile,
};
