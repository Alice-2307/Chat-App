const express = require('express');
const cors = require("cors");
require('dotenv').config();
const path = require("path");

const sequelize = require("./utils/database");

const userRoute = require('./routes/user');
const messageRoute = require('./routes/message');

const userModel = require("./models/user")
const messageModel = require("./models/message")

const app = express();

app.use(cors({
    origin: "http://localhost:5000/",
}));

app.use(express.json());

app.use('/', userRoute);

app.use('/', messageRoute)

app.use((req,res)=> {
    res.sendFile(path.join(__dirname, `public/${req.url}`))
})

userModel.hasMany(messageModel);
messageModel.belongsTo(userModel);

sequelize.sync().then(result => {
    app.listen(5000);
    console.log("Listen Port 5000");
}).catch(err => console.log(err));
