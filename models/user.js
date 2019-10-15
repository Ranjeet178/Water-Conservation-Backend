var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    EMAIL_ID:String,
    PASSWORD: String,
    OWNER_NAME: String,
    APARTMENT_NAME: String,
    FLAT_NO: String,
    OCCUPANTS: Number,
    MOBILE: Number,
    CROSSED_THRESHOLD: String
})