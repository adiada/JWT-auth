const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt


    //check json web token exists and is verified aka valid
    if(token){
        jwt.verify(token,'net ninja secret',(error,decodedToken) => {
            if(error){
                console.log(error.message)
                res.redirect('/login')
            } else {
                console.log(decodedToken)
                return next()
            }
        })

    }else {
        res.redirect('/login')
    }
}

//check current user
const checkUser = (req,res,next) =>{
    const token = req.cookies.jwt

    if(token){
        jwt.verify(token,'net ninja secret',async (error,decodedToken) => {
            if(error){
                console.log(error.message)
                res.locals.user = null;
                return next()
            } else {
                console.log(decodedToken)
                let user = await User.findById(decodedToken.id)
                //note , res.locals is available only while the view is being rendered, and not after it is already rendered
                //so this does not pose a security risk
                res.locals.user = user;
                return next()
            }
        })
    } else {
        res.locals.user = null
        return next()
    }
}


module.exports = { requireAuth, checkUser };
