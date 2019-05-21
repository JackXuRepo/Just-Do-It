const User = require('../models/users')

module.exports = {
  addFriend (req, res) { 
    let friendUser = req.body.friend;
    let user = req.body.user;
    User.findOne({ username: friendUser }, function (err, userFriend){
      if (err) return res.status(500).end(err);
      if (!userFriend) return res.status(409).end("User does not exist");
      if (userFriend.friendList.find(function (e) { return e == user })) return res.status(409).end("User is already a friend");
      if (userFriend.pendingList.find(function (e) { return e == user })) return res.status(409).end("Friend request already sent");
      if (friendUser === user) return res.status(409).end("Cannot add yourself");
      User.update({ username: friendUser }, { $push: { pendingList: user } }, function(err, usr){
          if (err) return res.status(500).end(err);
          if (!usr) return res.status(409).end("Current user does not exist");
          return res.json(userFriend);
      })
    })
  },
  deleteFriend (req, res) {
    let friendUser = req.body.friend;
    let user = req.body.user;
    User.findOne({ username: user }, function (err, currentUser){
      if (err) return res.status(500).end(err);
      if (!currentUser) return res.status(409).end("User does not exist");
      User.update({ username: user }, { $pull: { friendList: friendUser }}, function (err, usr){
        if (err) return res.status(500).end(err);
        if (!usr) return res.status(409).end("User does not exist");
      })
      User.update({ username: friendUser }, { $pull: { friendList: user }}, function (err, usr){
        if (err) return res.status(500).end(err);
        if (!usr) return res.status(409).end("Friend user does not exist");
      })
      return res.json(currentUser)
    })
  },
  rejectFriend (req, res) {
    let user = req.body.user;
    let friendUser = req.body.friend;
    User.findOne({ username: user }, function (err, currentUser){
      if (err) return res.status(500).end(err);
      if (!currentUser) return res.status(409).end("User does not exist");
      User.update({ username: user }, { $pull: { pendingList: friendUser }}, function (err, usr){
        if (err) return res.status(500).end(err);
        if (!friendUser) return res.status(409).end("Friend user does not exist");
        return res.json(friendUser)
      })
    })
  },
  acceptFriend (req, res) {
    let user = req.body.user;
    let friendUser = req.body.friend;
    User.findOne({ username: user }, function (err, currentUser){
      if (err) return res.status(500).end(err);
      if (!currentUser) return res.status(409).end("User does not exist");
      if (user === friendUser) return res.status(409).end("Cannot accept friend request");
      User.update({ username: user }, { $pull: { pendingList: friendUser }}, function (err, usr){
        if (err) return res.status(500).end(err);
        if (!usr) return res.status(409).end("Friend user does not exist");
      })
      User.update({ username: user }, { $push: { friendList: friendUser }}, function (err,  currentUser){
        if (err) return res.status(500).end(err);
        if (!currentUser) return res.status(409).end("User does not exist");
      })
      User.update({ username: friendUser }, { $push: { friendList: user }}, function (err, currFriendUser){
        if (err) return res.status(500).end(err);
        if (!currFriendUser) return res.status(409).end("User does not exist");
      })
      return res.json(currentUser)
    })
  }  
}