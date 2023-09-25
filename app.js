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

app.use(cors({
    origin: "http://3.26.144.193:5000/",
}));

app.use(express.json());

app.use('/', userRoute);

app.use('/', messageRoute)

app.use('/', groupRoute)


app.use((req,res)=> {
    res.sendFile(path.join(__dirname, `public/${req.url}`))
})

userModel.hasMany(messageModel);
messageModel.belongsTo(userModel);

groupModel.hasMany(messageModel);
messageModel.belongsTo(groupModel);

userModel.belongsToMany(groupModel, { through: userGroupModel });
groupModel.belongsToMany(userModel, { through: userGroupModel });


sequelize.sync().then(result => {
    app.listen(5000);
}).catch(err => console.log(err));
