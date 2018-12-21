const poolPromise = require('./mssqlDb').poolPromise;
const mssql = require('./mssqlDb').mssql;

function Comment(comment) {
  this.title = comment.title;
  this.content = comment.content;
}

module.exports = Comment;

Comment.prototype.save = function(callback) {
  var comment = new Comment(this);
  //console.log(comment);
  poolPromise.then(function(pool) {
    pool.request()
    .input('title', mssql.NChar, comment.title)
    .input('content', mssql.NText, comment.content)
    .query('insert into comments values(@title, @content, getdate())')
    .then(function(recordset) {
      return callback(recordset)
    })
  })
}

Comment.get = function(title, callback) {
  poolPromise.then(function(pool) {
    pool.request()
    .input('title', mssql.NChar, title)
    .query('select * from comments where Title=@title')
    .then(function(recordset) {
      callback(recordset.recordset)
    })
  })
}
