const express = require('express');
const cors = require('cors')
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const User = require('../api/model/User.js');
const {raw} = require("express");
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'asdasduegu327y2391hsd'

app.use(express.json())
app.use(cookieParser())
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

app.post('/login', async (req, res) => {
    const {email, password} = req.body;

    const userDoc = await User.findOne({email});
    if (userDoc) {
        const isPassOkay = bcrypt.compareSync(password, userDoc.password)
        if (isPassOkay) {
            jwt.sign({email: userDoc.email, id: userDoc._id, name:userDoc.name}, jwtSecret, {}, (err, token)=>{
                if (err) throw err;
                res.cookie('token', token).json(userDoc)
            })
        }
        else
            res.status(422).json('pass is not okay')
    } else {
        res.json('not found')
    }

});

app.get('/profile', async (req, res) => {
    const {token} = req.cookies; // needs cookie-parser middleware to work on cookies
    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, data) => {
            if (err) throw err;
            const {name, email, _id} = await User.findById(data.id);
            res.json(name, email, _id);
        })
    } else {
        res.json(null)
    }
});

app.post('/logout', async (req, res) => {
    res.cookie('token', '').json(true);
});

app.listen(4000);