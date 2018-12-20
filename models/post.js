//------------mssql
const poolPromise = require('./mssqlDb').poolPromise;
const mssql = require('./mssqlDb').mssql;

function Post(name, title, post) {
  this.name = name;
  this.title = title;
  this.post = post;
}

module.exports = Post;

Post.prototype.save = function(callback) {
  var date = new Date();
  //储存各种时间格式
  var time = {
    date: date,
    year : date.getFullYear(),
    month : date.getFullYear() + "-" + (date.getMonth() + 1),
    day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
    date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  }
  //要存入数据库的文档
  var post = {
    name: this.name,
    time: time,
    title: this.title,
    post: this.post
  };
  //使用mssql存储
  poolPromise.then(function(pool) {
    pool.request()
      .input('name', mssql.NChar, post.name)
      .input('title', mssql.NChar, post.title)
      .input('content', mssql.NText, post.post)
      .query('insert into posts(Title, Content, AuthorName, CreateDate, LastDate) values(@title, @content, @name, getdate(), getdate())')
      .then(function(result){
        callback(null);
      })
  })
}

Post.get = function(user, callback) {
  var name = user.name;
  poolPromise.then(function(pool) {
    pool.request()
    .input('name', mssql.NChar, name)
    .query('select * from posts where AuthorName=@name order by CreateDate desc')
    .then(function(recordset) {
      callback(null, recordset.recordset);
    })
    .catch(function(err) {
      console.log(err);
      callback(err);
    })
  })
}
