const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose')

const errorController = require('./controllers/error');
//const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5ef844d92822b2101e0adf3a')
    .then(user => {
      //console.log("user")
      req.user = user;
      next();
    })
    .catch(err => console.log("Error occured while retrieving the user"));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);



mongoose.connect('mongodb+srv://Manav:jtHknBGHjakFB1Hu@cluster0-mgtvm.mongodb.net/shop?retryWrites=true&w=majority')
.then(result=>{
  console.log("Connected")
  User.findOne().then(user=>{
    if(!user){
      const user=new User({
        name:'Manav',
        email:"Manavgargpkl@gmail.com",
        cart:{
          items:[]
        }
      });
      user.save()
    }
  })
  
  app.listen(3000)
}).catch(err=>{
  console.log("Error while connecting")
})