const express = require("express");
const jwt = require('jsonwebtoken')
const { createUser, login } = require("./controller/usersController");
const { jwtMiddleware } = require('../util/index')

const router = express.Router();

router.post("/create-user", createUser);

router.post('/login', login);

module.exports = router;