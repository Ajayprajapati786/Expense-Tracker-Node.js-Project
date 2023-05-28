const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Links = sequelize.define('links', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    Link: Sequelize.STRING,
})

module.exports = Links;