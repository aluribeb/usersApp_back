const { getAll, createUser, getOneUser, removeUser, updateUser, verifyEmail, login, getLoggedUser } = require('../controllers/users.controllers.js');
const express = require('express');
const verifyJWT = require( '../utils/verifyJWT.js' );

const userRouter = express.Router();

userRouter.route('/users')
    .get(verifyJWT, getAll)
    .post(createUser);

userRouter.route('/users/verify/:code')
    .get(verifyEmail)

userRouter.route('/users/login')
    .post(login)

userRouter.route('/users/me')
    .get(verifyJWT, getLoggedUser)

userRouter.route('/users/:id')
    .get(verifyJWT, getOneUser)
    .delete(verifyJWT, removeUser)
    .put(verifyJWT, updateUser);

module.exports = userRouter;