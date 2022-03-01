const getDataProfile =
    "SELECT username, email, fullname, location, bio, created_at, picture FROM users WHERE id=?",
  editProfile = "UPDATE users SET fullname=?, location=?, bio=? WHERE id=?";

module.exports = {
  getDataProfile,
  editProfile,
};
