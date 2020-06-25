const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const isAuthenticated = require('../config/isAuth') 
const multer = require('multer') 

const path = require('path')

// =================================================
// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Init Upload
  const upload = multer({
    storage: storage,
    limits:{fileSize: 10000000000000000},
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('myImage');
  
  // Check File Type
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif|xls/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }
// =================================================

module.exports= { 
    imageUploadController :(req, res) => {
        console.log('inside upload')
        console.log(req.params.id)
        upload(req, res, (err) => {
            const usrdata = req.user
            console.log(usrdata)
            console.log(req.file)
            if(err){
                console.log(err)
              res.render('index', {
                msg: err
              });
            } else {
              if(req.file == undefined){
                res.render('index', {
                  msg: 'Error: No File Selected!'
                });
              } else {

                // ============================update db
                User.findByIdAndUpdate({ _id: req.params.id },
                    { $set : {
                        image : req.file.filename
                        
                     }}, function(err, result){
                        if(err){
                            console.log(err);
                        }
                        console.log('Image updated');
                    });
                    // res.redirect('/users/dashboard')
                // ========================================

                res.render('updateuser', {
                  msg: 'File Uploaded!',
                  file: `${req.file.filename}`,
                  "usrdata" : usrdata
                });
              }
            }
        })}
}