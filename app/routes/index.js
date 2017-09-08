var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreplydanielntda@gmail.com',
    pass: 'qwert1234'
  }
});



/* Call sub-routes */
router.use('/', require('./middleware.js'))
router.use('/user', require('./users.js'));
router.use('/product', require('./product.js'));

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/email', function(req,res,next){

	console.log('req.body is ', req.body)

	var mailOptions = {
	  from: 'noreplydanielntda@gmail.com',
	  to: req.body.emailPost,
	  subject: 'HPB Healthy Living Recipe',
	  text: req.body.messagePost,

      attachments: [
        // String attachment
       {
	  		filename: req.body.recipePost, 
	  		path:"./app/public/files/" + req.body.recipePost
	  	},
	  	]
	};
	
	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
	  } else {
	    console.log('Email sent: ' + info.response);
	    res.send(true)
	  }
	});

})

// Catch all for 404 error.
router.use(function(req,res,next){
	console.log ('call error');
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
})

module.exports = router;