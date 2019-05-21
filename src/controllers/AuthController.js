const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const config = require('../config/JwtConfig')
const User = require('../models/users')

function generateSalt (){
  return crypto.randomBytes(16).toString('base64');
}

function generateHash (password, salt){
  var hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  return hash.digest('base64');
}

module.exports = {
  register (req, res) {
    let userName = req.body.username;
    let password = req.body.password;
    let salt = generateSalt();
    let hash = generateHash(password, salt);
    let friendList = [];
    let pendingList = [];
    let userSave = new User({
      username: userName,
      hashPassword: hash,
      salt: salt,
      name: req.body.name,
      friendList: friendList,
      pendingList: pendingList
    });
    User.findOne({ username: userName }, function(err, singleUser){
      if (err) return res.status(500).end(err);
      if (singleUser) return res.status(409).end("Username exists");
      userSave.save(function (err, user) {
        if (err) return res.status(500).end(err);
        return res.json(user);
      })
    })
  },
  login (req, res) {
    let userName = req.body.username;
    let password = req.body.password;
    User.findOne({ username: userName }, function(err, user){
      if (err) return res.status(500).end(err);
      if (!user) return res.status(401).end("Incorrect login information")
      if (user.hashPassword !== generateHash(password, user.salt)) return res.status(401).end("Incorrect login information");
      return res.send({
        user: user,
        token: jwt.sign(userName, config.authentication.jwtSecret)
      })
    })
  },
  isAuthenticated (req, res) {
    if (!req.user) return res.status(401).end("access denied");
    return res.send("User Authenticated")
  }
}
