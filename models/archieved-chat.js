const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Message = sequelize.define("archievemessage", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    message: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});

module.exports = Message;