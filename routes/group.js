const express = require('express');
const multer = require('multer');
const groupController = require('../controllers/group');
const userAuthorization = require('../middlewares/authorization').authentication;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/groupname', userAuthorization, groupController.addGroupName)

router.get('/groupname', userAuthorization, groupController.getGroup)

router.post('/invite', userAuthorization, groupController.inviteUser)

router.post('/upload', upload.single('file'), userAuthorization, groupController.uploadFile);

router.get('/members', userAuthorization, groupController.groupMembers)

router.get('/makeadmin', userAuthorization, groupController.makeAdmin)

router.delete('/deleteuser', userAuthorization, groupController.deleteUser)


module.exports = router;