const express = require('express')
const app =  express()
const ejsLayout = require('express-ejs-layouts')
const mongoose = require('mongoose')
const db = require('./config/dbconfig')
const passport = require('passport');
const falsh = require('express-flash')
const session = require('express-session')
const multer = require('multer')
const path = require('path') 

require('./config/passport')(passport)
// Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Port
const PORT = 8080
//Connection to the databse
mongoose.connect(db.url, {useNewUrlParser : true,useUnifiedTopology: true,useFindAndModify: false })
.then(()=> console.log('Connection established!'))
.catch((err => console.log('Connection failed :(')))

app.use(falsh())
app.use(session({
    secret : 'secret',
    resave : false,
    saveUninitialized:false
}))
// Passport
app.use(passport.initialize());
app.use(passport.session());

// EJS Setup
app.use(ejsLayout)
app.set('view engine', 'ejs')



// Bodyparser
app.use(express.urlencoded( {extended : false}))

 


// Routes
app.use('/', require('./routes/index'))
app.use('/users',require('./routes/users'))



app.listen(PORT, console.log(`server started on port : ${PORT}`))