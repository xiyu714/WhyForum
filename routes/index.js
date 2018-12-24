var express = require('express');
var router = express.Router();

var crypto = require('crypto'),   //crypto是Node.js的一个核心模块，用它生成散列值来加密密码
  User = require('../models/user.js'),
  Post = require('../models/post.js'),
  md = require('markdown-it')(),
  Comment = require('../models/comment.js'),
  Reply = require('../models/reply.js')
  ;

/* GET home page. */
router.get('/', function(req, res, next) {
  Post.get(req.session.user, function (err, posts) {
    if (err) {
      posts = [];
    }
    res.render('index', {
      title: '主页',
      user: req.session.user,
      posts: posts,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    })
  })
});

router.get('/u/:name/:title', function (req, res) {
  //获取article
  Post.getByTitle(req.params.title, function (err, posts) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    posts[0].Content = md.render(posts[0].Content)
    posts[0].CreateDate = posts[0].CreateDate.toString();
    Comment.get(req.params.title, function(comments) {
      //渲染
      Reply.get({
        title: req.params.title
      }, function(replies) {
        res.render('article', {
          title: req.params.title,
          post: posts[0],
          user: req.session.user,
          replies: replies,
          comments: comments,
          success: req.flash('success').toString(),
          error: req.flash('error').toString()
        })
      })
    })
  })
})

router.post('/u/:name/:title', function(req, res) {
  if (!req.body.comment){
    return res.redirect('back')
  }
  if (req.body.comment) {
    var comment = new Comment({
      title: req.params.title,
      content: req.body.comment,
      name: req.session.user.name
    })
    comment.save(function() {
      res.redirect('back')
    });
  }
})

router.post('/u/:name/:title/:index', function(req, res) {
  if (req.body.reply) {
    Reply.save({
      index: req.params.index,
      title: req.params.title,
      content: req.body.reply
    }, function() {
          return res.redirect('back')
    })
  } else if(req.body.delete){
    console.log(req.body)
    return res.redirect('back')
  } else if(req.body.alter){
    console.log(req.body)
    return res.redirect('back')
  } else {
    console.log('无法响应');
    return res.redirect('back');
  }

})


 router.get('/login', checkNotLogin);
router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'login',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
})

router.get('/reg', checkNotLogin);
router.get('/reg', function(req, res, next) {
  res.render('reg', {
     title: '注册',
     user: req.session.user,
     success: req.flash('success').toString(),
     error: req.flash('error').toString()
   });
})

router.post('/reg', checkNotLogin);
router.post('/reg', function(req, res) {
  var name = req.body.name,
    password = req.body.password,
    password_re = req.body['password-re'];
    //f 检测用户两次输入密码

    //f 生成密码的md5值

    // 创建用户对象
    var newUser = new User({
      name: name,
      password: password,
      email: req.body.email
    })
  // 检测用户是否存在
  User.get(newUser.name, function(err, result) {
    if(result) {
      req.flash('error', '用户已存在');
      res.redirect('/reg');
    } else {
      newUser.save(function(result) {
        console.log('存储用户成功')
        console.log(result)
        req.session.user = null;
        req.flash('success', '注册成功！请登录');
        res.redirect('/')
      })
    }
  })
})

router.post('/login', checkNotLogin)
router.post('/login', function (req, res) {
  //生成密码的 md5 值
  // var md5 = crypto.createHash('md5'),
  //     password = md5.update(req.body.password).digest('hex');
  //检查用户是否存在
  User.get(req.body.name, function (err, user) {
    if (!user) {
      req.flash('error', '用户不存在!');
      console.log(user)
      return res.redirect('/login');//用户不存在则跳转到登录页
    }
    //检查密码是否一致
    console.log(user)
    if (user.password.trim() != req.body.password) {
      req.flash('error', '密码错误!');
      return res.redirect('/login');//密码错误则跳转到登录页
    }
    //用户名密码都匹配后，将用户信息存入 session
    req.session.user = user;
    req.flash('success', '登陆成功!');
    res.redirect('/');//登陆成功后跳转到主页
  });
});

router.get('/logout', function(req, res) {
  req.session.user = null;
  req.flash('success', '登出成功!');
  res.redirect('/');
})

router.get('/post', checkLogin);
router.get('/post', function (req, res) {
  res.render('post', {
    title: '发表',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.post('/post', checkLogin);
router.post('/post', function (req, res) {
  var currentUser = req.session.user,
    post = new Post(currentUser.name, req.body.title, req.body.post);
  post.save(function(err) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/')
    }
    req.flash('success', '发表成功！');
    res.redirect('/');
  })
});

function checkLogin(req, res, next) {
  if(!req.session.user) {
    req.flash('error', '未登录')
    res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录！');
    res.redirect('back'); //返回之前的页面
  }
  next();
}


module.exports = router;
