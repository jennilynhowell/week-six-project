module.exports = {
  home: function(req, res){
    res.redirect('/signup');
  },

  //get signup
  signup: function(req, res) {
    res.send('SIGNUP')
    // res.render('signup', {})
  }






  //end exports obj
};
