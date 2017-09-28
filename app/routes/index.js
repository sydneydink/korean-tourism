var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var fetch = require('isomorphic-fetch');
var request = require('superagent');

var transporter = nodemailer.createTransport({
    host: 'mail.dinkevents.com',
    port: 26,
    secure: false,
    tls: {
        rejectUnauthorized:false
    },
  auth: {
    user: 'noreply@dinkevents.com',
    pass: 'Tornado13245678'
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

	var BusStopCode = req.query.BusStopCode
	console.log(BusStopCode)
	request
		//.get('http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode=83139')
		.get('http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?BusStopCode='+ BusStopCode)
		.set('AccountKey', 'rye8ZK3+QHutdz5yd8JPJw==')
		.set('Accept', 'application/json')
		.end(function(err, data){
		 if (err || !data.ok) {
		   console.log('Oh no! error');
		 } else {
		   	//console.log('yay got ' + JSON.stringify(data.body));
		 	res.json(data.body)
		 }
	});


	
})

router.post('/email', function(req,res,next){

	console.log('req.body is ', req.body)

	var mailOptions = {
	  from: 'noreply@dinkevents.com',
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
router.post('/korean-tourism-test', function(req,res,next){
	res.json({message:JSON.stringify(req.body)})
})

router.post('/korean-tourism-email', function(req,res,next){

	if(req.body.emailPost){
		console.log('req.body is ', req.body)

		var mailOptions = {
		  from: 'noreply@dinkevents.com',
		  to: req.body.emailPost,
		  subject: 'Korea Tourism',
		  html: `
		  <b> Hello World </b>
		  <div> <p> Hi Hi ${req.body.emailPost}</p></div>
		  <img src=${req.body.imgPost} />
		  `
		};
		
		transporter.sendMail(mailOptions, function(error, info){
		  if (error) {
		    console.log(error);
		  } else {
		    console.log('Email sent: ' + info.response);
		    res.json({status: "success"})
		  }
		});

	} else {
		res.json({status:"nothing"})
	}

})
// Catch all for 404 error.
router.use(function(req,res,next){
	console.log ('call error');
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
})

module.exports = router;
