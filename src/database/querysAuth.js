const createUser =
    "INSERT INTO users (username, email, password, rol_id, hash_email) VALUES (?, ?, ?, ?, ?)",
  activeEmail = "UPDATE users SET verified_email = true WHERE id = ?",
  createUserWithGoogle =
    "INSERT INTO users (username, email, password, rol_id, verified_email, picture) VALUES (?, ?, ?, ?, ?, ?)";

module.exports = {
  createUser,
  activeEmail,
  createUserWithGoogle,
};
