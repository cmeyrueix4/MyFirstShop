const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'mainRootBSTuser$328', {dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;