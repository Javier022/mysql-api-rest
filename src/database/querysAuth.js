const createUser =
  "INSERT INTO users (username, email, password, rol_id) VALUES (?, ?, ?, ?)";

module.exports = {
  createUser,
};
