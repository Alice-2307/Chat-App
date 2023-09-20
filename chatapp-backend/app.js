const express = require('express');
const cors = require("cors");

const sequelize = require("./utils/database");

const userRoute = require('./routes/user');

const userModel = require("./models/user")

const app = express();

app.use(cors());

app.use(express.json());

app.use('/user', userRoute);

sequelize.sync().then(result => {
    app.listen(5000);
}).catch(err => console.log(err));
