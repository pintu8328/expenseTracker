const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql", 
  }
);
    // "dev": "nodemon app.js",
    // "start":"node app.js"

module.exports = sequelize;
