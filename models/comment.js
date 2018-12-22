const poolPromise = require('./mssqlDb').poolPromise;
const mssql = require('./mssqlDb').mssql;

function Comment(comment) {
  this.title = comment.title;
  this.content = comment.content;
  this.name = comment.name;
}

module.exports = Comment;

Comment.prototype.save = function(callback) {
  var comment = new Comment(this);
  //console.log(comment);
  var x = 1;
  poolPromise.then(function(pool) {
    pool.request()
    .input('title', mssql.NChar, comment.title)
    .input('content', mssql.NText, comment.content)
    .input('name', mssql.NChar, comment.name)
    .input('x', mssql.Int, x)
    .query('set @x = (select count(*) from comments where Title=@title) insert into comments values(@title, @content, getdate(), @name, @x)')
    .then(function(recordset) {
      return callback(recordset)
    })
  })
}

Comment.get = function(title, callback) {
  poolPromise.then(function(pool) {
    pool.request()
    .input('title', mssql.NChar, title)
    .query('select * from comments where Title=@title order by CreateDate')
    .then(function(recordset) {
      callback(recordset.recordset)
    })
  })
}
