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
		  subject: 'Korea Tourism',
		  html: `
			<div class="container" style="max-width:800px">

				<div class="main-img">
					<img src="http://localhost:3020/image/korea-man.jpg" />
				</div>
				
				<div class="terms" style="padding:0 20px">
					<p style="text-align: justify; font-family: arial; font-size: 12px; line-height:15px"> Terms & Conditions <br>
						Korea Tourism 'Spot the ad' contest will commence from 12 October till 8 November 2017.
						10 shortlisted participants with the best photos will be announced on 15 November on 
						Korea Tourism Organization Facebook page (www.facebook.com/Koreatourismoganizationsingaporeoffice) 
						where the public will vote for the winner from 15 November till 21 November 2017.
						The 2 shortlisted participants with the highest votes will be announced on Korea Tourism Organization page 
						on 28 November 2017 and will win the return air ticket to Korea prize. The winners will be contacted
						via email on 28 November 2017 and has to acknowledge by 30 November 2017. Otherwise, the next eligible
						participant will be selected. Winners will have to be in Singapore to collect the prize. 
						The return air ticket is only valid for flight section from Singapore to Incheon International Airport.
						Issued tickets will result in a contract of carriage between the travelling passenger. Korea Tourism Organization
						is not held responsible. Please note that the winners voucher validity is valid for 6 months starting from 28 Nov 2017 
						and the ticket validity is valid for 3 months from ticket issuance date.
						All fuel and tax surcharges are to be borne by the winner. This ticket is not redeemable for cash,
						is non-transferable and non re-routable. Once ticket has been issued, it is not exchangeable or refundable.
						Korea Tourism Organization reserver the right to make changes to the contest without prior notice.
						Korea Tourism Organization reserves the right to use participants photo for any Korea Tourism Organization 
						collaterals for marketing or promotional purposes.
					</p>
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
