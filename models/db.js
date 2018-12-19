/*
  暂时舍弃使用
*/

// var settings = require('../settings'),
//   Db = require('mongodb').Db,
//   Connection = require('mongodb').Connection,
//   Server = require('mongodb').Server;
// module.exports = new Db(settings.db, new Server(settings.host, settings.port),
//   {safe: true});

var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');

var url = 'mongodb://localhost:27017';

var MongoClientPromise = MongoClient.connect(url, {useNewUrlParser: true});

module.exports = MongoClientPromise;
