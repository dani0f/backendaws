const mongoose = require('mongoose');
const { Schema } = mongoose;


const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Category required'],
        minlength:[3,'Minimun code length 3 characters']
    },
    username: {
        type: String,
        required: [true, 'Category required'],  
        minlength:[3,'Minimun code length 3 characters'],
        maxlength:[25, 'Maximun code length 25 characters'],              
        unique: true
    },
    password:{
        type: String,
        required: [true, 'Category required'],
        minlength:[7,'Minimun code length 7 characters'], 
        
    },
    accessLevel: {
        type:Number,
        min: [1, ''],
        max: [2,' ']
    }
});

module.exports = mongoose.model('User', UserSchema);


