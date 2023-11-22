const express = require('express');
const cors = require('cors')
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const User = require('../api/model/User.js');
const Place = require('../api/model/Place.js');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'asdasduegu327y2391hsd'

app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(__dirname + '/uploads'))
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


// ----- Places -----

app.post('/upload-by-link', async (req, res) => {
    const {link} = req.body;
    const newName = 'photo_' + Date.now() + '.jpg'
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    });
    res.json(newName);
})

const photosMiddleware = multer({dest: 'uploads/'})
app.post('/upload', photosMiddleware.array('photos', 100), (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const {path, originalname} = req.files[i];
        const parts = originalname.split('.')
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads/', ''))
    }
    res.json(uploadedFiles);
});


app.post('/places', (req, res) => {
    const {token} = req.cookies;
    const {
        title, address, addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests, price
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, data) => {
        if (err) throw err;
        const placeDoc = await Place.create({
            owner: data.id,
            title, address, photos: addedPhotos, description,
            perks, extraInfo, checkIn, checkOut, maxGuests, price
        });
        res.json(placeDoc);
    })
})

app.get('/user-places', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, data) => {
        const {id} = data;
        res.json(await Place.find({owner: id}));
    });
});

app.get('/places/:id', async (req, res) => {
    const {id} = req.params;
    res.json(await Place.findById(id));

});

app.put('/places', async (req, res) => {
    const {token} = req.cookies;
    const {
        id, title, address, addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests, price
    } = req.body;


    jwt.verify(token, jwtSecret, {}, async (err, data) => {
        if (err) throw err;

        const placeDoc = await Place.findById(id);
        if (data.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title, address, photos: addedPhotos, description,
                perks, extraInfo, checkIn, checkOut, maxGuests, price
            })
            await placeDoc.save();
            res.json('ok')
        }
    })
});

app.get('/places', async (req, res) => {
    res.json(await Place.find())
});


app.listen(4000);