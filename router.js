const express = require('express');
const bodyParser = require('body-parser');
const models = require('./models');
const controllers = require('./controllers/controllers.js');

//endpoints:
  //USER ROUTER
  // / = redir to signup
  // /signup = signup form
  // /login = login form

  //GAB ROUTER:
  // /gab/:userId = home; lists gabs & allows interaction (likes)
  //   --this is going to req dynamic routing
  // /gab/new = write & post new gab
  // /gab/:gabId = see gab alone w list of likes
  //   --this is going to req dynamic routing

module.exports = function(app){
  app.get('/', controllers.home);
  const userRouter = express.Router();
  const gabRouter = express.Router();

  // mount these after /user
  userRouter.get('signup', controllers.signup);
  userRouter.post('signup', controllers.signupPost);
  userRouter.get('login', controllers.login);
  userRouter.post('login', controllers.loginPost);
  app.use('/', userRouter);

  //mount these after /gab
  gabRouter.get('/:id', controllers.gabHome);
  app.use('/gab', gabRouter);

  // app.use('/home', homeRouter);
  // app.use('/app', appRouter);
};
