const User = require('../models/user');
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:'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'
  }
}));

exports.getLogin = (req, res, next) => {
  //console.log('getLogin function');
  let message= req.flash('error')
  if(message.length <= 0){
    message=null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage:message //will be removed from session once displayed
  });
};

exports.getSignup=(req,res,next)=>{
  let message= req.flash('error')
  if(message.length <= 0){
    message=null;
  }
  res.render('auth/signup',{
    path:'/signup',
    pageTitle: 'Signup',
    errorMessage:message
  });
};

exports.postLogin = (req, res, next) => {
  //console.log('PostLogin function')
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email:email})
  .then(user => {
    if(!user){
      req.flash('error','Invalid E-mail or Password.')
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
          req.flash('error','Invalid E-mail or Password.')
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
      req.flash('error','Email already exists')
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
      return transporter.sendMail({
        to:email,
        from:'Manavgargpkl@gmail.com',
        subject:"Signup successful",
        html:'<h1> You have successfully signed up ! </h1>'
      }).catch(err=>{
        console.log(err);
      })
      
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

exports.getReset=(req,res,next)=>{
  let message= req.flash('error')
  if(message.length <= 0){
    message=null;
  }
  res.render('auth/reset',{
    path:'/reset',
    pageTitle: 'ResetPassword',
    errorMessage:message
  });
}
exports.postReset = (req,res,next)=>{
  crypto.randomBytes(32,(err,buffer)=>{
    if(err) {
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({email:req.body.email}).then(user=>{
      if(!user){
        req.flash("error","No account with this email found");
        return res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now()+3600000
      return user.save();
    }).then(result=>{
      res.redirect('/')
       transporter.sendMail({
        to:req.body.email,
        from:'Manavgargpkl@gmail.com',
        subject:"Password reset",
        html:`
        <p>You requested a password reset </p>
        <p> Click this  <a href="http://localhost:3000/reset/${token}">link </a> to reset password </p>
        `
    })
    .catch(err=>{
      console.log(err);
    })

  })
})
}

exports.getNewPassword=(req,res,next)=>{
  const token=req.params.token;
  User.findOne({ resetToken:token , resetTokenExpiration : {$gt : Date.now()}}).then(user=>{
    let message= req.flash('error')
  if(message.length <= 0){
    message=null;
  }
  res.render('auth/new-password',{
    path:'/new-password',
    pageTitle: 'New Password',
    errorMessage:message,
    userId: user._id.toString(),
    passwordToken:token
  });
  }).catch(err=>{
    console.log(err);
  });
  
}

exports.postNewPassword=(req,res,next)=>{
  const newpassword = req.body.password;
  const userId=req.body.password;
  const passwordToken= req.body.passwordToken;
  let resetUser;
  User.findOne({resetToken:passwordToken,
    resetTokenExpiration:{$gt:Date.now()},
    _id:userId})
    .then(user=>{
      resetUser=user;
      return bcrypt.hash(newpassword,12);
    }).then(hashedPassword=>{
      resetUser.password=hashedPassword;
      resetUser.token=null;
      resetUser.resetToken=undefined;

    })
    .catch()
}