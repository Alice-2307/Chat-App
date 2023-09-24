const express = require('express');
const groupController = require('../controllers/group');
const userAuthorization = require('../middlewares/authorization').authentication;

const router = express.Router();

router.post('/groupname', userAuthorization, groupController.addGroupName)
router.get('/groupname', userAuthorization, groupController.getGroup)
router.post('/invite', userAuthorization, groupController.inviteUser)


module.exports = router;