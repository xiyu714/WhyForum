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


// //存储用户信息
// User.prototype.save = function(callback) {
//   //要存入数据库的用户文档
//   var user = {
//       name: this.name,
//       password: this.password,
//       email: this.email
//   };
//   //打开数据库
//   mongodb.open(function (err, db) {
//     if (err) {
//       return callback(err);//错误，返回 err 信息
//     }
//     //读取 users 集合
//     db.collection('users', function (err, collection) {
//       if (err) {
//         mongodb.close();
//         return callback(err);//错误，返回 err 信息
//       }
//       //将用户数据插入 users 集合
//       collection.insert(user, {
//         safe: true
//       }, function (err, user) {
//         mongodb.close();
//         if (err) {
//           return callback(err);//错误，返回 err 信息
//         }
//         callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
//       });
//     });
//   });
// };

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
     collection.insert(user, {
       safe: true
     }, function (err, user) {
       client.close();
       if (err) {
         console.log('插入失败')
         return callback(err);//错误，返回 err 信息
       }
       callback(null, user[0]);//成功！err 为 null，并返回存储后的用户文档
     });
   });
  })
}

//读取用户信息
// User.get = function(name, callback) {
//     //读取 users 集合
//     mongodb.collection('users', function (err, collection) {
//       if (err) {
//         mongodb.close();
//         return callback(err);//错误，返回 err 信息
//       }
//       //查找用户名（name键）值为 name 一个文档
//       collection.findOne({
//         name: name
//       }, function (err, user) {
//         mongodb.close();
//         if (err) {
//           return callback(err);//失败！返回 err 信息
//         }
//         callback(null, user);//成功！返回查询的用户信息
//       });
//     });
// };

User.get = function(name, callback) {
  Mongpromise.then((mongodb) => {
    db = mongodb.db('blog');
    db.collection('users', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //查找用户名（name键）值为 name 一个文档
      collection.findOne({
        name: name
      }, function (err, user) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err 信息
        }
        callback(null, user);//成功！返回查询的用户信息
      });
    })
  })
}
