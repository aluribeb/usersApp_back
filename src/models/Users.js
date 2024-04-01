const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Users = sequelize.define('users', {
    email: {
        type: DataTypes.STRING(100),
        unique:true
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    firstName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    country: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

Users.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
}

module.exports = Users;