const express =  require('express');
const app = express();
const path =  require('path');
const session =  require('express-session');
const passport = require('passport');   
const localStrategy = require('passport-local');   
const User = require('./models/user');  
const flash = require('connect-flash');
const {isLoggedIn} = require('./middleware');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profile');
const postsApiRoute = require('./routes/api/posts');
const mongoose = require('mongoose');
const { ppid } = require('process');
mongoose.connect('mongodb://localhost:yourport/twitterclone')
.then(()=>{
    console.log("db connected");
})
.catch((err)=>{
    console.log(err);
})



app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname , '/public')));
app.use(express.urlencoded({ extended: true })) 
app.use(express.json());

app.use(session({
    secret: 'we need a better secret',
    resave: false,
    saveUninitialized: true,
    
  }))

  app.use(flash());
  app.use(passport.session());

  app.use(passport.initialize());

  passport.use(new localStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

app.use(authRoutes);
app.use(profileRoutes);

app.use(postsApiRoute);



app.get('/',(req,res)=>{
 res.send("welcome to twitter clone");
if(!req.isAuthenticated()){
     return res.redirect('/login');
  }
  else{
       res.render('home');
  }
 })
app.get('/',isLoggedIn,(req,res)=>{
        res.render('home');
})

app.listen(3000,()=>{
    console.log("server running on 3000");
})