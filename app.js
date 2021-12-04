const express = require('express');
const mongoose = require('mongoose');
const {dbURI} = require('./dburi');
const app = express();
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser  } = require('./middleware/auth.middleware')

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())
app.use(checkUser)
// view engine
app.set('view engine', 'ejs');


// database connection
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true })
  .then((result) => { app.listen(3000)
                      console.log('listening on port 3000') })
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

// //cookies
// app.get('/set-cookies', (req,res,next) =>{

//   // res.setHeader('Set-Cookie','newUser=true');
//   res.setHeader('Set-Cookie','anotherOne=true; Max-age=3000;HttpOnly; Secure')
//   res.cookie('newUser', false)
//   res.cookie('isEmployee', true,{maxAge: 1000*60*60*24,httpOnly:true,secure:true})
//   res.send('You got the cookie!')
// })

// app.get('/read-cookies', (req,res,next) =>{
  
//   const cookies = req.cookies;
//   console.log(cookies.newUser)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
//   res.json(cookies)
// })