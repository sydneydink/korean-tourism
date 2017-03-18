var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');
var config = require('../../config/config')
var auth = jwt({secret: config.secret, requireProperty: 'payload'});
var mongoose = require('mongoose');

var User = mongoose.model('User');
var Model = mongoose.model('User');

var isAuthenticated = function (req, res, next){
	console.log('secret is ' + config.secret);
	console.log('checking authentication');
	if (req.isAuthenticated()){
		console.log('is authenticated');
		return next();
	}
	console.log('not authenticated');
	console.log('req.isAuthenticated is' + req.isAuthenticated())
	res.redirect('/user/login');
}

router.get('/login', function (req,res){
	res.render('user/login')
})

router.get('/signup', function (req, res) {
	res.render('user/sign-up');
})

/*API calls */
router.post('/api/create', create); //create one
router.get('/api/all', getAll); //show all
router.get('/api/:param', getOne); //show one
router.post('/api/update/:param', update); //update one
router.post('/api/delete/:param', deleteOne); //delete one


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/protected', isAuthenticated, function(req, res, next) {
  res.send('got a protected route');
});

/**************API CALLS ***************/

router.post('/api/signup', 
	passport.authenticate('signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	})
)

router.post('/api/login', 
	passport.authenticate('login',{
		successRedirect: '/',		//need to write this
		failureRedirect: '/user/login', 		//need to write this
		failureFlash: true
	})
)

/**************CRUD CALLS ***************/
function create (req, res, next){
	var model = new Model(req.body);

	model.save(function(err){
		if(err){return next(err);}
		res.end();
	});

}

function getAll (req, res, next){
	Model.find (function (err, model){
		if(err) return next(err);
		res.json(model);
	})
}

function getOne (req, res, next){
	Model.find (
		{_id: req.model._id},
		function (err, model){
			if(err) return next(err);
			res.json(model);
		}
	)
}

function update (req, res, next){
	Model.findOneAndUpdate(
		{_id: req.model._id},
		{$set:{
			//todo2 - update the fields to be same as parameter
			name: req.body.name,
			slug: req.body.slug,
			order: req.body.order,
		}},
		function (err, updatedModel){
			if(err) return next(err);
			res.send(updatedModel);
		}
	)
}

function deleteOne (req, res){
	Model.find({_id: req.model._id}).remove().exec();
	res.send('deleted');
}


module.exports = router;
