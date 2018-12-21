const poolPromise = require('./mssqlDb').poolPromise;
const mssql = require('./mssqlDb').mssql;

function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
};

module.exports = User;

User.prototype.save = function(callback) {
  var name = this.name, password = this.password, email = this.email;
  poolPromise.then(function(pool) {
    pool.request()
    .input('name', mssql.NChar, name)
    .input('password', mssql.NVarChar, password)
    .input('email', mssql.Char, email)
    .query('insert into users(name, password, email) values(@name, @password, @email)')
    .then(function(result) {
        callback(result)
    })
    .catch(function(err){
      console.log(err)
    })
  })
}

User.prototype.check = function(callback) {
  Mongpromise.then(function(mongodb){
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
        if (err) {
          console.log('get错误')
        }
        if(user){
            console.log('找到数据')   //我犯了一个错误，将err当作指示是否找到
            callback(false);
        } else{
          callback(true);
        }
      });
    })
  })
}

User.get = function(name, callback) {
  // if(!suser) {
  //   return callback(true);
  // }
  // var name = suser.name;
  poolPromise.then(function(pool) {
    pool.request()
    .input('name', mssql.NChar, name)
    .query('select * from users where name=@name')
    .then(function(recordset) {
      callback(null, recordset.recordset[0]);
    })
  })
}
