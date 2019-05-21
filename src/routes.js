const AuthController = require('./controllers/AuthController')
const AuthControllerValidator = require('./validators/AuthControllerValidator')
const ChatController = require('./controllers/ChatController')
const FriendController = require('./controllers/FriendController')
const JwtValidator = require('./validators/JwtValidator')

module.exports = (app) => {
  //Authentication		
  app.post('/register', AuthControllerValidator.register, AuthController.register)
  app.post('/login', AuthController.login)
  app.post('/isAuthenticated', JwtValidator.isAuthenicated, AuthController.isAuthenticated)

  //Chat
  app.post('/send', ChatController.send)
  
  //Friend
  app.patch('/addFriend', FriendController.addFriend)
  app.patch('/deleteFriend', FriendController.deleteFriend)
  app.patch('/acceptFriend', FriendController.acceptFriend)
  app.patch('/rejectFriend', FriendController.rejectFriend)
}
