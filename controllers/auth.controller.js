const User = require('../models/user')
const jwt = require('jsonwebtoken')

const maxAge = 3 * 24 * 60 * 60;

function handleErrors(err){
    // console.log(err.message,err.code)
    let errors = { email:'',password:''}
    
    //duplicate error code
    if(err.code === 11000){
        errors.email = 'that email is already registered'
        return errors;
    }
    //validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}


const createToken = (id) => {
    return jwt.sign({ id },'net ninja secret',{
        expiresIn: maxAge
    });
}

class AuthController{

    
    static async signup_get(req,res,next){
        res.render('signup');
    }

    static async login_get(req,res,next){
        res.render('login');
    }

    static async signup_post(req,res,next){
        const {email, password} = req.body
        try {
            const user = await User.create({email, password});
            const token = createToken(user._id)
            res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
            res.status(201).json({user:user._id});
        } catch(e) {
            // console.error(e.message)
            const errors = handleErrors(e)
            res.status(400).json({errors})
        }

        // console.log(email,' ', password)
        // res.status(200).json('new signup : ' + JSON.stringify(req.body))
    }


    static async login_post(req,res,next){
        const {email, password} = req.body
        try{
            const user = await User.login(email,password)
            res.status(200).json({user:user._id})
        } catch(e){
            console.error(e.message)
            res.status(400).json({})
        }
        // console.log(email,'', password)
        // res.status(200).json('new login : ' + JSON.stringify(req.body))
    }

}

module.exports = AuthController;