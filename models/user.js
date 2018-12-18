var mongodb = require('./db');

function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};

module.exports = User;

//数据库操作
var MongoClient = require('mongodb').MongoClient,
	assert = require('assert');

var url = 'mongodb://localhost:27017';

var Mongpromise = MongoClient.connect(url, {useNewUrlParser: true});

User.prototype.save = function(callback) {
  var user = {
    name: this.name,
    password: this.password,
    email: this.email
  };
  Mongpromise.then((client) => {
    db = client.db('blog');
    db.collection('users', function (err, collection) {
     if (err) {
       client.close();
       return callback(err);//错误，返回 err 信息
     }
     //将用户数据插入 users 集合
     collection.insertOne(user,function (err, result) {
       client.close();
       if (err) {
         console.log(user)
         console.log('插入失败')
         return callback(err);//错误，返回 err 信息
       }
       console.log('成功存入一个新用户')
       callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
     });
   });
  })
}

User.prototype.get = function(callback) {
  Mongpromise.then((mongodb) => {
    db = mongodb.db('blog');
    db.collection('users', function(err, collection) {
      if (err) {
        mongodb.close();
        console.log('get 错误')
        return callback(err);//错误，返回 err 信息
      }
      //查找用户名（name键）值为 name 一个文档
      collection.findOne({
        name: this.name
      }, function (err, user) {
        mongodb.close();
        if (err) {
          console.log('get错误')
        }
        if(user){
            console.log('找到数据')   //我犯了一个错误，将err当作指示是否找到
        }
      });
    })
  })
}
