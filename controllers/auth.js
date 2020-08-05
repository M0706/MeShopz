const User = require('../models/user');
const bcrypt = require('bcryptjs')
exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.getSignup=(req,res,next)=>{
  res.render('auth/signup',{
    path:'/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email:email})
  .then(user => {
    if(!user){
      res.redirect('/login')
    }
      bcrypt.compare(password,user.password).then(doMatch=>{
        if(doMatch){
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(cb => {
            //console.log(cb);
          res.redirect('/');
          });
        }
        else{
          res.redirect('/login');
        }
      })
    }).catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({email:email})
  .then(userDoc=>{
    if(userDoc){
      res.redirect('/signup')
    }
    else{
    return bcrypt
    .hash(password,12)
    .then(hashedPassword=>{
      const user = new User({
        email:email,
        password:hashedPassword,
        cart:{items:[]}
      });
      return user.save();
    })
    .then(result=>{
      res.redirect('/login');
  })
}
  })
  .catch(err=>console.log(err)); 
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(cb => {
    //console.log(cb);
    res.redirect('/');
  });
};
