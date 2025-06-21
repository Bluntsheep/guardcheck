import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "sql6.jnb1.host-h.net",
  user: "puzzled_user",
  password: "z01W079712LSp7",
  database: "puzzled_new_database",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
