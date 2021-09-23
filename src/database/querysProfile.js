const getDataProfile =
  "SELECT username, email, created_at, fullname FROM users WHERE id=?";

module.exports = {
  getDataProfile,
};
