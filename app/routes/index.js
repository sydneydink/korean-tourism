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
		  bcc: ['sydney.wu@dink.com.sg', 'Michele.LowRichards@clearchannel.com.sg', 'timothy.seow@dink.com.sg'],
		  subject: 'Korea Tourism',
		  html: `
			<div class="container" style="max-width:800px">

				<div class="main-img">
					<img src="http://52.220.58.82:3020/image/korea-man.jpg" />
				</div>
				
			</div>

		  `,
	        attachments: [
		        // String attachment
		       {
			  		filename: 'image.png', 
			  		path:req.body.imgPost
			  	},
			  	]
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
