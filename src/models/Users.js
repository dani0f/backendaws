const mongoose = require('mongoose');
const { Schema } = mongoose;


const UserSchema = new Schema({
    name: String,
    username: {
        type: String,
        unique: true
    },
    password: String,
    accessLevel: {
        type:Number,
        default: 1
    }
});

module.exports = mongoose.model('User', UserSchema);

