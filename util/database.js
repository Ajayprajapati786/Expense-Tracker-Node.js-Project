const Sequelize=require('sequelize');


const sequelize = new Sequelize("expensetracker", "root", "Sani@123", {
    host: "localhost",
    dialect: "mysql",
  });

  module.exports = sequelize;

  