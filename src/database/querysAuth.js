const createUser =
  "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

module.exports = {
  createUser,
};
