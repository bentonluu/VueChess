// Express
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

// Socket.io
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var usersMap = new Map();
var gamesMap = new Map();
var rooms = ['Lobby'];
var pendingRooms = [];
var gameTrackerMap = new Map();
var roomCount = 0;

// Middleware
app.use(bodyParser.json())
app.use(cors())

// Make requests to users api
const users = require('./userCollection')
app.use('/api/users',users)

// Socket setup
io.on('connection', function(socket) {
    console.log("user joined");
    io.emit('USER', socket.id);

    socket.on('beginSession', function(data) {
        if (data.sessionID == null) {
            let randomSessionID = Math.round(Math.random() * 100).toString();
            console.log("sessionID: " + randomSessionID);
            socket.emit("setSession", { sessionID: randomSessionID });
            usersMap.set(randomSessionID, data.username);
        }
        else {
            console.log("sessionID: " + data.sessionID);
            socket.emit("setSession", { sessionID: data.sessionID });
        }
    });

    socket.on('NEWGAME', function(game) {
        if (game.gameType === "randomGame") {
            if (pendingRooms.length === 0) {
                let randomRoomID = 'game' + Math.round(Math.random() * 100).toString();
                pendingRooms.push(randomRoomID);
                gameTrackerMap.set(randomRoomID,[game.user]);
                socket.emit("setGameSession", { gameID: randomRoomID });
                console.log("New room created: " + randomRoomID);

                socket.emit('PLAYERCOLOR', 'white');
            }
            else {
                console.log("New game started: " + pendingRooms[0]);
                gameTrackerMap.get(pendingRooms[0]).push(game.user);
                rooms.push(pendingRooms[0]);
                socket.emit("setGameSession", { gameID: pendingRooms[0] });
                socket.emit('PLAYERCOLOR', 'black');

                io.emit('STARTGAME','');

                pendingRooms.pop();
            }
        }
    });

    socket.on('LEAVEQUEUE', function() {
        pendingRooms.pop();
        //gameTrackerMap.pop();
    });

    socket.on('INITGAME', function(gameRoom) {
        gamesMap.set(socket.id, gameRoom);
        socket.join(gameRoom);
        console.log('room: ' + gameRoom);
    });

    socket.on('PIECEMOVED', function(game) {
        console.log("room: " + game.gameRoomID);
        console.log("position: " + game.gamePosition);
        console.log("color: " + game.color);
        console.log("history: " + game.gameHistory);
        io.to(game.gameRoomID).emit('UPDATEGAME', { position: game.gamePosition, color: game.color, history: game.gameHistory });
    });

    socket.on('LEAVEGAME', function() {
        socket.leave(gamesMap.get(socket.id));
        let userList = gameTrackerMap.get(gamesMap.get(socket.id));
        io.to(gamesMap.get(socket.id)).emit('SHOWDISCONNECT', { reason: 'leftGame', users: userList });

    });

    socket.on('disconnect', function() {
        let currentGameRoom = gamesMap.get(socket.id);
        if (currentGameRoom !== undefined) {
            let userList = gameTrackerMap.get(currentGameRoom);
            io.to(currentGameRoom).emit('SHOWDISCONNECT', { reason: 'randomDisconnect', users: userList });
        }
        gamesMap.delete(socket.id);

        //console.log(socket.id);
        /*
        usersMap.delete(socket.id);
        socket.leave(socket.room);
        io.emit('USERLIST', Array.from(usersMap.values()));
        */
        console.log("user left");
        roomCount--;
    });


    socket.on('newUser', function(username){
        socket.username = username;
        usersMap.set(socket.id, username);

        socket.room = 'Lobby';
        socket.join('Lobby');

        console.log("new user added");
        io.emit('USERLIST', Array.from(usersMap.values()));
    });

    socket.on('changeRoom', function(newRoom) {
        if (roomCount < 2) {
            var oldRoom = socket.room;
            socket.leave(socket.room);

            socket.join(newRoom);
            socket.room = newRoom;

            io.emit('USERROOM', { old: oldRoom, new: socket.room });
            roomCount += 1;
            if (roomCount == 2) {
                io.emit('GAMESTART', '');
            }
            console.log("user added to room " + roomCount);
        }

        else {
            console.log("room full");
        }
    });


});

const port = process.env.PORT || 9000
app.listen(port, () => console.log(`Server started on port: ${port}`))

http.listen(3000, function() {
    console.log('listening on *:3000');
});
