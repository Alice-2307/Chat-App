const Sequelize = require('sequelize');

const sequelize = new Sequelize('chatApp', 'root', '*******',{
    dialect: "mysql",
    host: "localhost"
});

module.exports = sequelize;