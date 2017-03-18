// This is a default REST route template. 
// This  need to be registered in the route index file using
// router.use('/product', require('./product.js'));

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRETAPP', requireProperty:'payload'}); //todo, change the secret


/********************************/
/********** CONFIG **************/
/********************************/
var modelName = 'Product'; 	//todo1 - select the model
var Model = mongoose.model(modelName); 
var viewShowAll = modelName + "/show-all";
var viewShowOne = modelName + "/show-one";
var viewCreateOne = modelName + "/create-one";


/********************************/
/********** ROUTES **************/
/********************************/
/*Params */
router.param('param', param);

/* Render view file */
router.get('/', showAll);	//sometimes issue if without trailing slash
router.get('/show', showAll);
router.get('/create', createOne);
router.get('/id/:param', showOne);

/*CRUD calls */
router.post('/api/create', create); //create one
router.get('/api/all', getAll); //show all
router.get('/api/:param', getOne); //show one
router.post('/api/update/:param', update); //update one
router.post('/api/delete/:param', deleteOne); //delete one


/* CB functions */
function param (req, res, next, id){
	var query = Model.findById(id);
	query.exec (function (err, data){
		if (err) return next (err);
		if (!data) return next (new Error ('can\'t find data'))
		req.model = data;
		return next();
	});
}

function showAll (req, res, next){
	Model.find(
		{}, // find all
		function(err,models){
			if(err) return next(err);

			res.render( viewShowAll , {
				models: models, 
				modelName: modelName
			});
		})
}

function showOne(req, res){
	Model.findById (
		req.model._id,
		function (err, model){
			console.log("id is " + model.name)
			if(err) return next(err);
			res.render(viewShowOne , {
				model: model, 
				modelName: modelName
			});
		}
	)
}

function createOne(req, res){
	res.render(viewCreateOne)
}

/* CRUD CALLS */
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