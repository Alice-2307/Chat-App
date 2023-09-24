const express = require('express');
const groupController = require('../controllers/group');
const userAuthorization = require('../middlewares/authorization').authentication;

const router = express.Router();

router.post('/groupname', userAuthorization, groupController.addGroupName)
router.get('/groupname', userAuthorization, groupController.getGroup)
router.post('/invite', userAuthorization, groupController.inviteUser)
router.get('/members', userAuthorization, groupController.groupMembers)
router.get('/makeadmin', userAuthorization, groupController.makeAdmin)
router.delete('/deleteuser', userAuthorization, groupController.deleteUser)


module.exports = router;