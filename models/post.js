//------------mssql
const poolPromise = require('./mssqlDb').poolPromise;
const mssql = require('./mssqlDb').mssql;
const Comment = require('./comment');

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
  // if(!user) {   //检测是否用户登录
  //   return callback(true);  //有错误
  // }
  // var name = user.name;
  poolPromise.then(function(pool) {
    pool.request()
    // .input('name', mssql.NChar, name)
    // .query('select * from posts where AuthorName=@name order by CreateDate desc')
    //--显示特定用户的帖子
    //显示所有用户的帖子
    .query('select * from posts order by LastDate desc')
    .then(function(recordset) {
      callback(null, recordset.recordset);
    })
    .catch(function(err) {
      console.log(err);
      callback(err);
    })
  })
}

Post.getByTitle = function(title, callback) {
  poolPromise.then(function(pool) {
    pool.request()
    .input('title', mssql.NChar, title)
    .query('select * from posts where Title = @title')
    .then(function(recordset) {
      callback(null, recordset.recordset);
    })
    .catch(function(err) {
      console.log(err);
      callback(err);
    })
  })
}

Post.deleteByTitle = function(title, callback) {
  poolPromise.then(function(pool) {
    pool.request()
    .input('title', mssql.NChar, title)
    .query('delete from posts where Title = @title')
    .then(function(recordset) {
      callback(null, recordset.recordset);
    })
    .catch(function(err) {
      console.log(err);
      callback(err);
    })
  })
}

Post.alterByTitle = function(title, newTitle, content, callback) {
  poolPromise.then(function(pool) {
    pool.request()
    .input('title', mssql.NChar, title)
    .input('content', mssql.NText, content)
    .input('newTitle', mssql.NChar, newTitle)
    .query('update posts set Content=@content, Title=@newTitle, LastDate=getdate() where Title = @title')
    .then(function(recordset) {
      callback(null, recordset.recordset);
    })
    .catch(function(err) {
      console.log(err);
      callback(err);
    })
  })
}
