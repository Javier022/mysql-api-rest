const mysql = require("mysql2/promise");

const getConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.SEVER,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
    });

    connection.config.namedPlaceholders = true;

    return connection;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = getConnection;
