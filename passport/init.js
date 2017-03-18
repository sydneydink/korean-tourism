// Main function for serializing and deserializing user.
// The actual strategies are in login.js and signup.js
// To connect passport to the main app, put the following 
// in app.js after app=express();
/*  
app.use(expressSession({
  secret: config.secret, 
  resave: true, 
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
var initPassport = require('./passport/init');
initPassport(passport);
*/
var login = require('./login');
var signup = require('./signup');
var mongoose = require('mongoose');
var User = mongoose.model('User');


module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user: successful');
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('deserializing user: successful');
            done(err, user);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);

}