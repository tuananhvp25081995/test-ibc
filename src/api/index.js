const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
const request = require('request-promise');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const Token = require('./token.models');
mongoose.connect('mongodb://127.0.0.1:27017/token-facebook', {useNewUrlParser: true});

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// db.defaults({ token: [] }).write()


const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('./key');

const PORT = process.env.PORT || 3000;
app.listen(PORT,function(){
  console.log('Server listening on port' + PORT);
})

const names = ['Việt Nam','Đức An','Tuãn Anh','@@','🤣'];
var allMessages = [];
var allContent = [];

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
});

passport.use(
  new FacebookStrategy(
    {
      clientID: keys.FACEBOOK_APP_ID,
      clientSecret: keys.FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook-search'
    },
    async (accessToken) => {
      Token.update({},{
        token: accessToken,
      }, function (err, docs) {
          if(err){
            console.log(err);
          }
        });
    }
  )
);

app.get('/auth/facebook-search', passport.authenticate('facebook'));

// app.get('/facebook-search/2383037331934038',
//   passport.authenticate('facebook', { successRedirect: '/',
//     failureRedirect: '/auth/facebook-search' })
// );

app.use(
  cookieSession({
    maxAge: 7 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/facebook-search/:id', async (req, res) => {
  const userFieldSet = 'feed';
  var newToken = await Token.find({});
  const options = {
    method: 'GET',
    uri: `https://graph.facebook.com/v4.0/${req.params.id}`,
    qs: {
      access_token: newToken[0].token,
      fields: userFieldSet
    }
  };

request(options)
  .then(fbRes => {
    let content = JSON.parse(fbRes).feed.data;
    content.forEach(message => {
      if(message.message !== undefined){
        allMessages.push(message.message)
      }
    });
    for(var i = 0; i < allMessages.length; i++){
      for(var j = 0 ; j < names.length; j++){
        if(allMessages[i].includes(names[j]) === true){
          allContent.push(allMessages[i])
        }
      }
    }
    res.json(allContent)
  })
})
  
