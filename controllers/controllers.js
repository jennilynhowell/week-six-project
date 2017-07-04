const models = require('../models');
const session = require('express-session');

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! TODO create displayGabs function for render callbacks

// const displayGabs = function(posts){
//   posts.forEach(function(post){
//     post.likeCount = post.postLikes.length;
//     post.userName = post.user.username;
//     post.canLike = true;
//
//     if (post.userName == req.session.name) {
//       post.userName = 'You';
//       post.canLike = false;
//     };
//   });
//   let context = {
//     user: req.session.name,
//     posts: posts,
//   };
//   res.render('home', context);
// };

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
    req.checkBody('passconf', "Oops, your passwords don't match").notEmpty()/*.matches()*/;

    //if form checks out, create user
    req.getValidationResult().then(function(result){
      if(result.isEmpty()) {
        let newUser = req.body.username
          , password = req.body.password;
        models.User.create({
          username: newUser,
          password: password
          //then log in the new user
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! TODO fix this... it's not automatically logging in new users
        }).then(function(user){
          req.session.user = user.id;
          req.session.name = user.name;
          console.log('user.id', user.id);
          console.log('session.userId', req.session.user);
          let id = user.id;
          res.redirect('/gab/' + id);
        })
      } else {
        res.render('signup', {errors: result.mapped(), username: req.body.username});
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
          console.log('user.id', user.id);
          console.log('session.user', req.session.user);
          console.log('user.username', user.username);
          console.log('session.name', req.session.name);
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
        if(post.userName == req.session.name) {
          post.userName = 'You';
          post.canLike = false;
        }
      });
      let context = {
        user: req.session.name,
        posts: posts
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
        }).then(function(posts){
          posts.forEach(function(post){
            post.likeCount = post.postLikes.length;
            post.userName = post.user.username;
            post.canLike = true;
            if(post.userName == req.session.name) {
              post.userName = 'You';
              post.canLike = false;
            }
          });
          let context = {
            user: req.session.name,
            posts: posts
          }
          res.render('home', context);
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
      }).then(function(posts){
        posts.forEach(function(post){
          post.likeCount = post.postLikes.length;
          post.userName = post.user.username;
          post.canLike = true;
          if(post.userName == req.session.name) {
            post.userName = 'You';
            post.canLike = false;
          }
        });
        let context = {
          user: req.session.name,
          posts: posts
        }
        res.render('home', context);
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
      }).then(function(posts){
      posts.forEach(function(post){
        post.likeCount = post.postLikes.length;
        post.userName = post.user.username;
        post.canLike = true;
        if(post.userName == req.session.name) {
          post.userName = 'You';
          post.canLike = false;
        }
      });
      let context = {
        user: req.session.name,
        posts: posts
      }
      res.render('home', context);
    });
  });
  },



  logOut: function(req, res){
    delete req.session.user;
    delete req.session.name;
    res.redirect('/user/login');
  }





  //end exports obj
};
