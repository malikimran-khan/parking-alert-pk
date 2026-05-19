const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    Number: {
        type: String,
        required: true,
        unique: true
    },
    color:{
        type: String,
        required: true
    },
    model:{
        type: String,
        required: true
    },
    Owner:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    }
});
    