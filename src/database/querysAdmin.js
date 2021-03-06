const getUsers = `
SELECT users.id, users.username, users.email, users.created_at, roles.name AS rol, users.state 
FROM users 
INNER JOIN roles ON users.rol_id=roles.id 
WHERE users.rol_id<>?
`;
const deleteUserById = "UPDATE users SET state=false WHERE id=?";

module.exports = {
  getUsers,
  deleteUserById,
};
