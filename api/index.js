const express = require('express');
const cors = require('cors')
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const User = require('../api/model/User.js');
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);

app.use(express.json())

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))

mongoose.connect('mongodb://localhost:27017/booking')
    .then(success => {
        console.log("MongoDB connected...")
    })

app.post('/register', async (req, res) => {
    const {name, email, password} = req.body;

    try {
        const createdUser = await User.create({
            name,
            email,
            password:  bcrypt.hashSync(password, bcryptSalt)
        });
        res.json(createdUser)
    } catch (e) {
        res.status(422).json(e);
    }

});

app.listen(4000);