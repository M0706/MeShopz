const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('5ef84b5505c2b811b122483e')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(cb => {
        //console.log(cb);
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(cb => {
    //console.log(cb);
    res.redirect('/');
  });
};
