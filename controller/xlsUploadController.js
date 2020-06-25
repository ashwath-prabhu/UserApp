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
    destination: './public/xlsfiles/',
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
  }).single('myXlsx');
  
  // Check File Type
  function checkFileType(file, cb){
    
    // check file mime type
    if ( file.mimetype != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        return cb(new Error('Wrong file type'))
    } else{
      return cb(null,true); 
    }
  }
// =================================================

module.exports= { 
    xlsUploadController :(req, res) => {
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
                        userFile : req.file.filename
                        
                     }}, function(err, result){
                        if(err){
                            console.log(err);
                        }
                        console.log('Xls uploaded updated');
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