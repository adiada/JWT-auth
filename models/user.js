const mongoose = require('mongoose');
const {isEmail} =require('validator')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail,'Please enter a valid email']
    },
    password : {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [8, 'Minimum password length is 8 characters'],
    }
})

//fire a function  after a user has been created
userSchema.post('save',function (doc, next) {

    console.log('New user was created and saved',doc)
    next();
    console.log('this comes after next')
})


//fire a function before doc saved to db
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password,salt)
    console.log('User about to be created', this)
    next();
})


//static method to login user
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email})
    if(user){
       const auth = await bcrypt.compare(password,user.password)
       if(auth){
           return user;
       } else{
           throw Error('incorrect password')
       }
    }
    throw Error('incorrect email')
}

//this is important to be user, as it should be singular of whatever we define our db collection to be (eg: users)
const User = mongoose.model('user',userSchema)

module.exports = User;