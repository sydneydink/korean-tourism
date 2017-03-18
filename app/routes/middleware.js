var express = require('express');
var router = express.Router();

// middleware to add trailing slash to url
/*router.use(function(req, res, next) {
   if(req.url.substr(-1) != '/' && req.url.length > 1)
       res.redirect(301, req.url+"/");
   else
       next();
});*/

// middleware to remove trailing slash to url
/*router.use(function(req, res, next) {
   if(req.url.substr(-1) == '/' && req.url.length > 1)
       res.redirect(301, req.url.slice(0, -1));
   else
       next();
});*/

module.exports = router;