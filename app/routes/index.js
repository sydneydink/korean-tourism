var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var fetch = require('isomorphic-fetch');
var request = require('superagent');

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


router.get('/bus', function(req,res,next){
	/*
	var myHeaders = new Headers();
	myHeaders.append("AccountKey", "rye8ZK3+QHutdz5yd8JPJw==");

	fetch('http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=83139',{
		method: 'get',
		headers: 'myHeaders',
	}).then(function(response){
		console.log('response is ', response)
	}).catch(function(err){
		console.log('err is ', err)
	})
	*/
	 request
	   .get('http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=83139')
	   .set('AccountKey', 'rye8ZK3+QHutdz5yd8JPJw==')
	   .set('Accept', 'application/json')
	   .end(function(err, data){
	     if (err || !data.ok) {
	       console.log('Oh no! error');
	     } else {
	       	console.log('yay got ' + JSON.stringify(data.body));
	     	res.json(data.body)
	     }
	   });


	
})

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