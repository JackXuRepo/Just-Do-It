
# Just Do It
![alt text](https://i.imgur.com/R3te5P4.png)
### Quick Links

Rest API Documentation: [Here](doc/README.md)

## Team Members

* Kevin Bato
* Haosen Xu

## Project Description

Just Do It is an online multiplayer game site that hosts a game that users can play together and compete.

Users have to register for an account through username and password. The features of being a registered user: access to play a game, chat globally with current users that are online and a friend system where you can add and remove a friend.

Upon starting the game, a registered user can play Type It and create a waiting room or join one. This room can be either public or private. In this room players can communicate through messaging. The player that created the room is given an admin role to the room. The admin may choose to give another player this role, or kick other players out of the room. Once all players status are set to ready then the game starts.

Here is the breakdown of Type It:

#### Type It
A text based racing game that allows users to type on their keyboard the same sentence displayed on screen. First user to finish wins and score is based on how quickly one finishes. This game records real time statistics about the player's word per second and how many the player types a word correctly and incorrectly. The players in the game can see each other's progress on how far they are to finishing the given text on screen. 

## Beta Version Release
* Type It (game itself, scoring, ...)
* User authentication and management
* Messaging (global chat)

## Final Version Release
* Friend system (adding and removing friends)
* Waiting room (chatroom)
* Overall application layout (structure and CSS)
* Security

## Technology Used
MongoDb for database management, ExpressJs for backend, VueJs for frontend, NodeJs for dependency installation. We also utilize socket.io mainly for our game, waiting room, friends system (i.e. checks if friend is online or offline), and real time chatting. Our final project will be deployed to Heroku.

## Technical Challenges:
* Learn VueJs, both developers have not had prior experience with VueJs so it will be a challenge to learn it.
* Using socket.io and different interactions with many clients to one server
* Integration of multiple npm packages
* Allowing current game state to be displayed for all users in real time
* Deploying an application
