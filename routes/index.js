var express = require('express');
var router = express.Router();

var crypto = require('crypto'),   //crypto是Node.js的一个核心模块，用它生成散列值来加密密码
  User = require('../models/user.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'myblog'});
})

router.get('/reg', function(req, res, next) {
  res.render('reg', { title: 'myblog'});
})

router.post('/reg', function (req, res) {
  var name = req.body.name,
    password = req.body.password,
    password_re = req.body['password-repeat'];
    //检验用户两次输入的密码是否一致
    if (password_re != password) {
      req.flash('error', '两次输入的密码不一致！');
      return res.redirect('/reg');  //返回注册页
    }
    //生成密码的md5值
    var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex'); //update什么意思?
    var newUser = new User({
      name: name,
      password: password,
      email: req.body.email
    });

    //检测用户名是否已经存在
    User.get(newUser.name, function(err, user) {
      if (err) {
        req.flash('error', '用户已经存在！');
        console.log('error', '用户已经存在！')
        return res.redirect('/reg');
      }
      newUser.save(function (err, user) {
        if (err) {
          req.flash('error', err);
          console.log('注册失败');
          return res.redirect('/reg')
        }
        req.session.user = user;
        req.flash('success', '注册成功！');
        res.redirect('/');
      })
    })

})

module.exports = router;
