const poolPromise = require('./mssqlDb').poolPromise;
const mssql = require('./mssqlDb').mssql;

var reply = {};
module.exports = reply;

reply.save = function(data, callback) {
  poolPromise.then(function(pool) {
    pool.request()
    .input('index', mssql.Int, data.index)
    .input('title', mssql.NChar, data.title)
    .input('content', mssql.NText, data.content)
    .query('insert into replies values(@index, @title, @content, getdate())')
    .then(function(recordset) {
      return callback(recordset)
    })
  })
}

reply.get = function(data, callback) {
  poolPromise.then(function(pool) {
    pool.request()
    //.input('index', mssql.Int, data.index)
    .input('title', mssql.NChar, data.title)
    .query('select * from replies where Title=@title order by CreateDate')
    .then(function(recordset) {
      callback(recordset.recordset)
    })
  })
}
