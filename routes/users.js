const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const isAuthenticated = require('../config/isAuth')
const appCntrl = require('../controller/controller')
const multer = require('multer') 

const path = require('path')
const fileUploadCntrl = require('../controller/imageupload')
const xlscontroler = require('../controller/xlsUploadController')
const adusrscontroler = require('../controller/adusercontroller')




router.get('/', (req,res)=>{res.render('index')})
router.get('/register', (req,res)=>{res.render('register')})
router.get('/login',(req,res)=>{
    res.render('login')
})


router.get('/updateuser/:id',(req,res)=>{
    console.log('inside update user')
    console.log(req.params.id)
    User.findOne({_id: req.params.id}, function (err, user) { 
        if(err){
            console.log(err)
        }
        if(user){
            const usrdata = user
            res.render('updateuser',
        { "usrdata" : usrdata })
        }
      });  
   })

router.get('/logout',appCntrl.logoutController)

router.post('/dashboard/:id',isAuthenticated.ensureAuthenticated,appCntrl.dashboardUpdateController)


router.get('/dashboard/:id',isAuthenticated.ensureAuthenticated,appCntrl.dashboardGetController)

router.get('/uddateusr/:id',isAuthenticated.ensureAuthenticated,appCntrl.updateUser)

router.get('/dashboard',isAuthenticated.ensureAuthenticated,appCntrl.dashboardController)

router.post('/register', appCntrl.registerController)


router.post('/login', appCntrl.loinController)


router.post('/upload/:id',isAuthenticated.ensureAuthenticated,fileUploadCntrl.imageUploadController )

router.post('/uploadxls/:id',isAuthenticated.ensureAuthenticated, xlscontroler.xlsUploadController )

router.get('/downlodxls',(req,res)=>{
    console.log('hello inside display upload')
    res.render('updateuser', {
        msg: 'File Uploaded!',
        file: `/${req.file.filename}`,
        "usrdata" : usrdata
      });
})
    
router.get('/upload',(req,res)=>{
    console.log('hello inside display upload')
    res.render('updateuser', {
        msg: 'File Uploaded!',
        file: `/${req.file.filename}`,
        "usrdata" : usrdata
      });
})

router.post('/adusrs', adusrscontroler.saveController)

module.exports = router;