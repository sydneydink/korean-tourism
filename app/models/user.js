// This is a default model template. 
// The schema need to be registered in the main file
// using require('./app/models/{{name_of_file}}');

var modelName = "User" //Todo 1 - name the model
var config = require('../../config/config');
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var ModelSchema = new mongoose.Schema({
  //todo2 - set the parameters
  username: {type: String, lowercase: true, unique: true},
  password: {type: String},
  name: String,
  email: String,
});


mongoose.model(modelName, ModelSchema);