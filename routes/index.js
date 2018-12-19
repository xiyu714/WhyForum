var express = require('express');
var router = express.Router();

var crypto = require('crypto'),   //crypto是Node.js的一个核心模块，用它生成散列值来加密密码
  User = require('../models/user.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
     title: '主页',
     user: req.session.user,
     success: req.flash('success').toString(),
     error: req.flash('error').toString()
   });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'login',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
})

router.get('/reg', function(req, res, next) {
  res.render('reg', {
     title: '注册',
     user: req.session.user,
     success: req.flash('success').toString(),
     error: req.flash('error').toString()
   });
})


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

    //f 检测用户是否存在
    newUser.check(function(valid) {
        //存储用户
        if(valid) {
        newUser.save(function(err, result){
          if (err){
            console.log('存储用户失败');
            res.redirect('/reg')
          } else {
            console.log('存储用户成功')
            req.session.user = result;  //我怀疑result有问题
            req.flash('success', '注册成功！');
            res.redirect('/')
          }
        });
      }else {
        req.flash('error', '用户已存在')
        res.redirect('/reg');
      }
  })
})

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
    if (user.password != req.body.password) {
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



module.exports = router;
