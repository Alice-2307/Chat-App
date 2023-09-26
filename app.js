const express = require('express');
const cors = require("cors");
require('dotenv').config();
const path = require("path");

const sequelize = require("./utils/database");

const userRoute = require('./routes/user');
const messageRoute = require('./routes/message');
const groupRoute = require('./routes/group');

const userModel = require("./models/user")
const messageModel = require("./models/message")
const groupModel = require("./models/group");
const userGroupModel = require("./models/userGroup");

const app = express();

app.use(cors())

app.use(express.json());

app.use('/', userRoute);

app.use('/', messageRoute)

app.use('/', groupRoute)


app.use((req, res) => {
    res.sendFile(path.join(__dirname, `public/${req.url}`))
})

userModel.hasMany(messageModel);
messageModel.belongsTo(userModel);

groupModel.hasMany(messageModel);
messageModel.belongsTo(groupModel);

userModel.belongsToMany(groupModel, { through: userGroupModel });
groupModel.belongsToMany(userModel, { through: userGroupModel });


sequelize.sync().then(result => {
    const server = app.listen(5000);
    const io = require('socket.io')(server)
    io.on('connection', socket => {
        socket.on('send', message => {
            socket.broadcast.emit('receive', message)
        })
    })

}).catch(err => console.log(err));

