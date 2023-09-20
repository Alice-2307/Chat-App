const express = require('express');
const cors = require("cors");

const sequelize = require("./utils/database");

const userRoute = require('./routes/user');

const userModel = require("./models/user")

const app = express();

app.use(cors({
    origin: "*",
}));

app.use(express.json());

app.use('/', userRoute);

sequelize.sync().then(result => {
    app.listen(5000);
    console.log("Listen Port 5000");
}).catch(err => console.log(err));
