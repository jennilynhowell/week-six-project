const express = require('express');
const controllers = require('./controllers/controllers.js');

//endpoints:
  // / = redir to signup
  // /signup = signup form
  // /signup/login = login form
  //
  // login redir to /user router
  //
  // /user/home = lists gabs & allows interaction (likes)
  //   --this is going to req dynamic routing
  // /user/gab = write & post new gab
  // /user/gab/likes = see gab alone w list of likes
  //   --this is going to req dynamic routing

module.exports = function(app){

  app.get('/', controllers.home);
  //login router
  const signupRouter = express.Router();

  //user router
  const userRouter = express.Router();

  // mount these after /signup

  signupRouter.get('/signup', controllers.signup);

  // homeRouter.get('/', homeController.index);
  // homeRouter.get('/about', homeController.about);
  // homeRouter.get('/contact', homeController.contact);

  // mount these after /app
  // appRouter.get('/dog/', dogController.list);
  // appRouter.get('/dog/:id', dogController.detail);
  //^ this middleware only applies to the '/dog/:id' endpoint

  // app.use('/home', homeRouter);
  // app.use('/app', appRouter);
};
