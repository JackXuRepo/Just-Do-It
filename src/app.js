const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const randomParagraph = require('random-paragraph')
const txtgen = require('txtgen')

const http = require('http')
const app = express()
app.use(bodyParser.json())
app.use(cors({credentials: true, origin: true}))

require('./routes')(app)
app.use(express.static(__dirname + "/../public/"))
app.get(/.*/, (req, res) => res.sendFile(__dirname + '/../public/index.html'))

let server = app.listen(process.env.PORT || 8081)

// Connecting Mongo DB
mongoose.connect(keys.mongoURI)
mongoose.connection.on('error',()=>{
  console.log("Error in database connection")
})
mongoose.connection.once('open',function(){
  console.log("DB connection established")
})

let io = require('socket.io').listen(server);
let users = new Set();
let connections = [];
let sockets = {};

let Player = function(username) {
	let self = {
		id: username,
		timeEnd: 0,
		correctCount: 0,
		incorrectCount: 0
	}
	return self;
}

let GameState = function(){
	let self = {
		time: 0,
		words: [],
		players: {},
	}
	return self;
}

let RoomMember = function(member){
	let self = {
		id: member,
		ready: false
	}
	return self;
}

let Room = function(admin, privacy=false){
	let self = {
		admin: admin,
		members: [],
		status: 'Waiting',
		private: privacy,
		gamestate: {}
	}
	return self;
}

let isGameOver = function(room){
	let players = rooms[room].gamestate.players;
	let gameOver = true;
	let maxScore = 0;
	let winner = '?';
	for(let playerId in players){
		gameOver = gameOver && (players[playerId].timeEnd != 0)
		if(players[playerId].correctCount > maxScore){
			maxScore = (players[playerId].correctCount) / (players[playerId].timeEnd);
			winner = playerId;
		}
	}
	if(gameOver){
		io.in(room).emit('gameOver', winner);
	}
}

let leaveRoom = function(user, room){
	let userSocketId = sockets[user];
	let userSocket = io.sockets.connected[userSocketId];


	if(rooms[room]){
		for (let member in rooms[room].members){
			if(rooms[room].members[member].id == user){
				rooms[room].members.splice(member, 1);
			}
		}

		if(rooms[room].gamestate.players){
			delete rooms[room].gamestate.players[user];
		}

		if(userSocketId && userSocket){
			console.log(rooms[room]);
			io.to(userSocketId).emit('leftRoom');
			userSocket.leave(room);
		}
		io.in(room).emit('updateRoom', rooms[room]);
		if(rooms[room].members.length == 0){
			delete rooms[room];
		}
		io.sockets.emit('waitingRooms', rooms);
	}
}

let rooms = {};
let makeRandomSentences = function () {
	let words = [];
	let random = txtgen.paragraph(7);
	words = random.split(/[ ]+/);
	return words;
}

app.get('/getWaitingRooms', function(req, res){
	return res.json(rooms);
});

app.get('/getRoom/:id', function(req, res){
	let room = req.params.id;
	if(!rooms[room]){
		return res.status(500).end('Room does not exist');
	}
	else{
		console.log(rooms[room])
		return res.json(rooms[room]);
	}
});

io.sockets.on('connection', function(socket){
	connections.push(socket);
	socket.username = socket.handshake.query['username'];
	sockets[socket.handshake.query['username']] = socket.id;
	console.log('Connected: %s sockets connected', connections.length);

	socket.on('joinRoom', (data) => {
		console.log(data);
		let username = data.id;
		let room = data.room;
		socket.join(room);
		if(!rooms[room]){
			rooms[room] = Room(username);
		}
		if(rooms[room].members.length < 4){
			rooms[room].members.push(RoomMember(username));
			socket.room = room;
			socket.to(room).emit('updateRoom', rooms[room]);
			io.sockets.emit('waitingRooms', rooms);
		}
		console.log(rooms);
	});

	socket.on('updateRoom', (data) => {
		let room = data.room;
		let properties = data.properties;

		rooms[room] = properties;
		console.log(rooms)
		socket.to(room).emit('updateRoom', rooms[room]);
		io.sockets.emit('waitingRooms', rooms);
	});

	socket.on('leaveRoom', (data) => {
		let room = data.room;
		let user = data.user;
		leaveRoom(user, room);
	});


	socket.on('destroyRoom', (room) => {
		delete rooms[room];
		io.sockets.emit('waitingRooms', rooms);
	});

	socket.on('waitingRooms', () => {
		io.sockets.emit('waitingRooms', rooms);
	});

	socket.on('sendMessage', function(data){
		console.log(data);
		if(!data.room){
			io.sockets.emit('receiveMessage', data);
		}
		else{
			io.in(data.room).emit('receiveMessage', data);
		}
	});

	socket.on('playerOnline', function(data){
		console.log(data);
		users.add(data);
		socket.username = data;
		socket.room = null;
		socket.game = null;
		sockets[data] = socket.id;
		console.log(users);
		io.sockets.emit('playerOnline', [...users]);
	});

	socket.on('gameStart', function(data){
		io.in(data.room).emit('gameStart');
		let wordList = makeRandomSentences();
		console.log(wordList);
		let room = data.room;
		let gameState = GameState();

		for(let player in rooms[room].members){
			gameState.players[rooms[room].members[player].id] = Player(rooms[room].members[player].id);
		}
		gameState.words = wordList;
		rooms[room].gamestate = gameState;
		io.in(data.room).emit('gameUpdate', rooms[room].gamestate);

		let interval = setInterval(()=>{ 
			if(rooms[room]){
				rooms[room].gamestate.time++;
          		io.in(data.room).emit('gameUpdate', rooms[room].gamestate);
			}
			else {
				clearInterval(interval);
			}
        }, 1000);
	});

	socket.on('gameUpdate', function(data){
		let player = data.player;
		let room = data.room;

		rooms[room].gamestate.players[player.id] = player;
		io.in(data.room).emit('gamesUpdate', rooms[room].gamestate);

		isGameOver(room);
	});

	let isGameOver = function(room){
		let players = rooms[room].gamestate.players;
		let gameOver = true;
		let maxScore = 0;
		let winner = '?';
		for(let playerId in players){
			gameOver = gameOver && (players[playerId].timeEnd != 0)
			if(players[playerId].correctCount > maxScore){
				maxScore = (players[playerId].correctCount) / (players[playerId].timeEnd);
				winner = playerId;
			}
		}
		if(gameOver){
			io.in(room).emit('gameOver', winner);
		}
	}

	/* Friends Online */
	socket.on('friendOnline', function(data){
		socket.broadcast.emit('friendOnline', data)
	});
	socket.on('onlineResponse', function(data){
		io.sockets.emit('onlineResponse', {
			name: data.name
		})
	});

	/* Friends Offline */
	socket.on('friendOffline', function(data){
		socket.broadcast.emit('friendOffline', data)
	});
	socket.on('offlineResponse', function(data){
		io.sockets.emit('offlineResponse', {
			name: data.name
		})
	});

	/* Update Pending List */
	socket.on('addToPendingList', function(data){
		socket.broadcast.emit('addToPendingList', data)
	});

	/* Send Online Response */
	socket.on('checkOnline', function(data){
		socket.broadcast.emit('checkOnline', data)
	});

	socket.on('sendName', function(data){
		socket.to(data.socketId).emit('currentOnline', {
			name: data.name,
			socketId: data.socketId
		})
	})
	/* Delete Online Friend */
	socket.on('deleteOnlineFriend', function(data){
		socket.broadcast.emit('deleteOnlineFriend', data)
	});


	socket.on('disconnect', function(data){
		connections.splice(connections.indexOf(socket), 1);
		if(socket.username){
			users.delete(socket.username);
			io.sockets.emit('playerOnline', [...users]);
		}
		console.log(socket.room + " " + socket.username);
		if(socket.room && socket.username){
			console.log("EXITTTT");
			leaveRoom(socket.username, socket.room);
		}
		console.log('Disconnected: %s sockets connected', connections.length);
	});
});