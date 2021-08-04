const mysql = require("mysql2/promise");

const getConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.LOCAL_HOST,
      user: process.env.LOCAL_USER,
      database: process.env.LOCAL_DBNAME,
      password: process.env.LOCAL_PASS,
      port: process.env.LOCAL_PORT,
    });

    connection.config.namedPlaceholders = true;

    console.log("conexion exitosa");

    return connection;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = getConnection;
