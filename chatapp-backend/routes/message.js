const express = require('express');
const userController = require('../controllers/message');
const userAuthorization = require('../middlewares/authorization').authentication;

const router = express.Router();

router.post('/message', userAuthorization, userController.userMessage)

module.exports = router;