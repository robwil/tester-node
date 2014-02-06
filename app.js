
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var ObjectId = require('mongodb').ObjectID;
var db = null;

app.get('/users/:id', function(req, res) {
	var collection = db.collection('users');
	collection.find({"_id": new ObjectId(req.params.id)}).nextObject(function(err, doc) {
		res.end(JSON.stringify(doc));
	});
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
	MongoClient.connect('mongodb://127.0.0.1:27017/rails_tester_development', function(err, _db) {
		if(err) throw err;
		db = _db;
		console.log("Mongodb connection established");
	});
});

process.on('SIGTERM', function () {
	console.log("Closing");
	app.close();
});

app.on('close', function () {
	console.log("Closed");
	db.close();
});