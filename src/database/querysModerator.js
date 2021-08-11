const getUsers = `
SELECT users.username, users.email, users.created_at, roles.name AS rol, users.state 
FROM users 
INNER JOIN roles ON users.rol_id=roles.id 
WHERE users.rol_id=?
`;

module.exports = {
  getUsers,
};
