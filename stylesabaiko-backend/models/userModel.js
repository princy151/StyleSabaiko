const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: false
    },
    // phone: {
    //     type: String,
    //     required: true
    // },
    otp: {
        type: String,
        required: false 
    },
    failedLoginAttempts: {
    type: Number,
    default: 0
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  lockUntil: {
    type: Date,
    default: null
  }
})
const user = mongoose.model('users', userSchema)
module.exports = user;