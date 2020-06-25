const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const isAuthenticated = require('../config/isAuth')



module.exports= {
   saveController : (req,res)=>{
        const {name , email, username, password } = req.body
        let err = []
    
       console.log(req.body)
        if(!name || !email || !username || !password){
            err.push({msg : "Please enter valid credentials!"})
            // res.send('please enter something')
        }
            if(password.length < 6 ){
                err.push({msg : "Password should be atleast 6 charecters..!!"})
            }
        if(err.length > 0)
        {
            res.render('register', {
                err,
                name,
                email,
                username,
                password
            })
        }else {
            User.findOne({email : email})
            .then((data)=>{
                if(data){
                    res.send('User exists!')
                }else{
                    const newUser = new User({
                        name,
                        email,
                        username,
                        password
                    })
                     newUser.save()
                     .then((data)=>{
                        res.redirect('/users/dashboard')
                     })
                     .catch(err => res.send("error"))
                }
            }).catch(err=>res.send('something went wrong'))  
        }
    }
}