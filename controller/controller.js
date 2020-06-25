const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const isAuthenticated = require('../config/isAuth')


module.exports = {
    registerController : (req,res)=>{
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
                        res.redirect('login')
                     })
                     .catch(err => res.send("error"))
                }
            }).catch(err=>res.send('something went wrong'))  
        }
    },

    loinController : (req,res, next)=>{
        console.log('inside login')
        passport.authenticate('local', {
            successRedirect: '/users/dashboard',
            failureRedirect: '/users/login',
            failureFlash:true
          })(req, res, next);
    },
    dashboardController : (req,res)=>{
        User.find({}).select('-password').exec(function(err, users) {   
            if (err) throw err
            console.log(req.user)

            console.log('===========================================users===========================')
            console.log(users)
            console.log('------=====================================')
            console.log("User obj : ")
            const usrdata =  {
                "image" : req.user.image,
                "userFile": req.user.userFile,
                "_id":  req.user._id,
                "name": req.user.name,
                "email": req.user.email,
                "username": req.user.username 
            }
            console.log(usrdata)
            res.render('dashboard', { "users": users , "usrdata" : usrdata })
        })
    },
    dashboardUpdateController : (req,res)=>{
        console.log(req.params.id);
        User.findByIdAndUpdate({ _id: req.params.id },
        { $set : {
            name : req.body.name,
            username : req.body.username,
            email : req.body.email
         }}, function(err, result){
            if(err){
                console.log(err);
            }
            console.log("RESULT: " + result);
        });
        res.redirect('/users/dashboard')
    },
    dashboardGetController : (req,res)=>{
        User.findByIdAndRemove(req.params.id, function(err, user) {
    
            if (err) {
                res.send("err")
            }
            
               
                res.redirect('/users/dashboard')
            
            console.log("Success");
    
        });  
       
        console.log(req.params.id)
    },
    logoutController : (req,res)=>{
        req.logout()
        res.redirect('/')
    },
    updateUser:(req,res)=>{
        console.log("inside update user")

        console.log(req.params.id)
       
        res.redirect('/users/updateuser')
    }
}