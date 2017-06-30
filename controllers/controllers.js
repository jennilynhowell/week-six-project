const models = require('../models');
const session = require('express-session');

module.exports = {
  home: function(req, res){
    res.redirect('/signup');
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
          console.log('session.userId', req.session.user);
          let id = user.id;
          res.redirect('/gab/' + id);
        })
      } else {
        res.render('login', {errors: result.mapped(), username: req.session.name});
      }
    })

  },

  //GAB HOME
  gabHome: function(req, res) {


    let context = {
      user: req.session.name,
    };
    res.render('home', context);
  },





  //end exports obj
};
