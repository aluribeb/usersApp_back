const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const EmailCode = sequelize.define('emailCode', {
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
//userId, no tiene codigo porque es una llave foranea en el indexjs
});

module.exports = EmailCode;