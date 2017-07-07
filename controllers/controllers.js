const models = require('../models');
const session = require('express-session');
const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = {
  home: function(req, res){
    res.redirect('/user/signup');
  },

  //SIGNUP
  signup: function(req, res) {
    res.render('signup', {});
  },

  signupPost: function(req, res) {
    //validate form
    req.checkBody('username', 'Please pick a username').notEmpty();
    req.checkBody('password', 'Please pick a password').notEmpty();
    req.checkBody('passconf', "Oops, your passwords don't match").notEmpty().equals(req.body.password);

    //if form checks out, create user
    req.getValidationResult().then(function(result){
      if(result.isEmpty()) {
        let newUser = req.body.username
          , password = req.body.password;
        models.User.create({
          username: newUser,
          password: password

        }).then(function(user){
          //catch and display errors
          console.log(user);
        }).catch(Sequelize.UniqueConstraintError, function (err) {
          error = {message: 'Sorry, that username is taken', err: err, username: newUser, password: password};
          res.render('signup', { error: error });
        }).catch(Sequelize.ValidationError, function (err) {
          error = {message: 'Oh no! Something went wrong.', err: err, username: newUser, password: password};
          res.render('signup', error);
        }).catch(function (err) {
          // handle all other errors
          error = {message: 'Oh no! Something went wrong.', err: err, username: newUser, password: password};
          res.render('signup', error);
        }).then(function(user){
        //then log in the new user
            req.session.user = user.id;
            req.session.name = user.username;
            let id = user.id;
            res.redirect('/gab/' + id);
          })
      } else {
        errors = result.mapped();
        firstError = result.array();
        console.log(firstError[0].msg);
        res.render('signup', {errors: firstError[0].msg, username: req.body.username});
      }
    })
  },

  //LOGIN
  login: function(req, res){
    res.render('login', {});
  },

  loginPost: function(req, res) {
    //validate form
    req.checkBody('username', 'Please enter your username').notEmpty();
    req.checkBody('password', 'Please enter your password').notEmpty();

    //if form checks out, log user in
    req.getValidationResult().then(function(result){
      if(result.isEmpty()) {
        let user = req.body.username
          , password = req.body.password;

        models.User.findOne({
          where: {
            username: req.body.username,
            password: req.body.password
          }
          //then log in
        }).then(function(user){
          req.session.user = user.id;
          req.session.name = user.username;
          let id = user.id;
          res.redirect('/gab/' + id);
        })
      } else {
        res.render('login', {errors: result.mapped(), username: req.session.name});
      }
    })

  },

  //GAB HOME
  //get request
  gabHome: function(req, res){
    models.Post.findAll({
      include: [
        {model: models.User, as: 'user'},
        {model: models.User, as: 'postLikes'}
      ],
      order: [['createdAt', 'DESC']]
    }).then(function(posts){
      posts.forEach(function(post){
        post.likeCount = post.postLikes.length;
        post.userName = post.user.username;
        post.canLike = true;
        date = moment(post.createdAt, moment.ISO_8601).calendar();
        post.posted = date;
        if(post.userName == req.session.name) {
          post.userName = 'You';
          post.canLike = false;
        }

      });
      let context = {
        user: req.session.name,
        posts: posts,
      }
      res.render('home', context);
    });
  },

  //post new
  newGab: function(req, res) {
    models.Post.create(
      {
        post: req.body.post,
        userId: req.session.user
      }).then(function(){
      models.Post.findAll({
        include: [
          {
            model: models.User,
            as: 'user',
          },
          {
            model: models.User,
            as: 'postLikes'
          }
        ],
        order: [['createdAt', 'DESC']]
      }).then(function(){
          res.redirect('/gab/' + req.session.user);
        });
      });

  },

  //like a post
  like: function(req, res){
    models.Like.create({
      postId: req.body.id,
      userId: req.session.user
    }).then(function(){
      models.Post.findAll({
        include: [
          {
            model: models.User,
            as: 'user',
          },
          {
            model: models.User,
            as: 'postLikes'
          }
        ],
        order: [['createdAt', 'DESC']]
      }).then(function(){
          res.redirect('/gab/' + req.session.user);
        });
    });
  },

  delete: function(req, res){
    models.Post.destroy({
      where: {
        id: req.body.id,
        userId: req.session.user
      }
    }).then(function(){
      models.Post.findAll({
        include: [
          {
            model: models.User,
            as: 'user',
          },
          {
            model: models.User,
            as: 'postLikes'
          }
        ],
        order: [['createdAt', 'DESC']]
      }).then(function(){
          res.redirect('/gab/' + req.session.user);
        });
      });
  },

  //view gab on one page, showing likes
  viewGab: function(req, res){
    let gabId = req.body.id;
    res.redirect('/gab/viewGab/' + gabId);
  },

  displayGab: function(req, res){
    models.Post.findOne({
      where: {
        id: req.params.gabId,
      },
      include: [
        {
          model: models.User,
          as: 'user',
        },
        {
          model: models.User,
          as: 'postLikes'
        }
      ],
    }).then(function(post) {
      let likes = []
        , postLikes = post.postLikes
        , date = moment(post.createdAt, moment.ISO_8601).calendar();
      postLikes.forEach(function(like){
        likes.push(like);
      });
      let context = {
        post: post,
        userName: post.user.username,
        posted: date,
        likeCount: post.postLikes.length,
        likes: likes
      };
      res.render('post', context);
    })
  },



  logOut: function(req, res){
    delete req.session.user;
    delete req.session.name;
    res.redirect('/user/login');
  }





  //end exports obj
};
