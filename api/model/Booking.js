const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    place: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Place'
    },
    name: {type: String, required: true},
    phone: {type: String, required: true},
    checkIn: {type: Date, required: true},
    checkOut: {type: Date, required: true},
    maxGuests: {type: Number, required: true},
    price: {type: Number, required: true},
})

const BookingModel = mongoose.model('Booking', BookingSchema);

module.exports = BookingModel;