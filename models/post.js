var mongodbClientPromise = require('./db');

//------------mssql
const mssql = require('mssql');
const config = {
  user: 'sa',
  password: 'xiyu',
  server: 'localhost',
  database: 'luntan',
  port: 1443
}
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
  console.log('这里值了吧')
  var poolPromise = mssql.connect(config);
  console.log(poolPromise)
  poolPromise.then(function(pool) {
    return pool.request()
      .input('name', mssql.Char, post.name)
      .input('title', mssql.Char, post.title)
      .input('content', mssql.Text, post.post)
      .query('insert into posts(Title, Content, AuthorName, CreateDate, LastDate) values(@title, @content, @name, getdate(), getdate())')
  }).then(result => {
    console.log(result)
    console.log('执行了吗');
  })

  //打开数据库
  mongodbClientPromise.then(function(client) {
    var db = client.db('blog');
    db.collection('posts', function(err, collection) {
      if (err) {
        callback(err)
      } else {
        collection.insert(post, {
          safe: true
        }, function (err) {
          if(err) {
            callback(err);
          } else {
            callback(null);
          }
        })
      }
    })
  })

}

Post.get = function(name, callback) {
  //打开数据库
  mongodbClientPromise.then(function(client) {
    var db = client.db('blog');
    db.collection('posts', function(err, collection) {
      if (err) {
        callback(err)
      } else {
        var query = {};
        if (name) {
          query.name = name;
        }
        collection.find(query).sort({
          time: -1
        }).toArray(function (err, docs) {
          if(err) {
            callback(err);
          } else {
            callback(null, docs);
          }
        })
      }
    })
  })
}
