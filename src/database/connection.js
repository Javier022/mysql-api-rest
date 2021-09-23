const mysql = require("mysql2/promise");

const getConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
    });

    connection.config.namedPlaceholders = true;

    console.log("connect to db");
    return connection;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = getConnection;
