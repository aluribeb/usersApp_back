const EmailCode = require("./EmailCode.js")
const Users = require( "./Users.js");

EmailCode.belongsTo(Users)
Users.hasOne(EmailCode)