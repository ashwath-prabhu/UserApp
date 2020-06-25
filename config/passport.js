const  LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose')
const User = require('../models/user')

module.exports= function(passport) {
passport.use(new LocalStrategy({usernameField : 'email'},
   (email, password, done) => {
    User.findOne({ email : email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (user.password != password) {
          console.log(user.password )
          console.log(password)
          console.log('Incorrect password')
        return done(null, false, { message: 'Incorrect password.' });
      } 
      return done(null, user);

    });
  }
));


passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser( (id, done) => {
    User.findById(id,  (err, user) => {
      done(err, user);
    });
  });

}