// This is a default model template. 
// The schema need to be registered in the main file
// using require('./app/models/{{name_of_file}}');

var mongoose = require('mongoose');
var modelName = "Product" //Todo 1 - name the model 
 
var modelSchema = new mongoose.Schema({ 	
  name: {type: String, unique: false},
  slug: {type: String, unique: true}, 
});

mongoose.model(modelName, modelSchema);