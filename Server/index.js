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
var tournamentsMap = new Map();
var rooms = ['Lobby'];
var pendingRooms = [];
var roomCount = 0;

// Middleware
app.use(bodyParser.json())
app.use(cors())

// Make requests to users & tournament api
const users = require('./userCollection')
app.use('/api/users',users)

const tournaments = require('./tournamentCollection')
app.use('/api/tournaments',tournaments)

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
        if (game === "randomGame") {
            if (pendingRooms.length === 0) {
                let randomRoomID = 'game' + Math.round(Math.random() * 100).toString();
                pendingRooms.push(randomRoomID);
                socket.emit("setGameSession", { gameID: randomRoomID });
                console.log("New room created: " + randomRoomID);

                socket.emit('PLAYERCOLOR', 'white');
            }
            else {
                console.log("New game started: " + pendingRooms[0]);

                rooms.push(pendingRooms[0]);
                socket.emit("setGameSession", { gameID: pendingRooms[0] });
                socket.emit('PLAYERCOLOR', 'black');

                io.emit('STARTGAME','');

                pendingRooms.pop();
            }
        }
    });

    socket.on('beginTournament', function(data) {
        console.log(data)
        if (tournamentsMap.get(data.tournamentID) ==  null || tournamentsMap.get(data.tournamentID).length < data.maxPlayers) {
            console.log("added " + data.sessionID + " to tournament " + data.tournamentID)
            addValue(data.tournamentID, data.sessionID)
            socket.emit("setTournament", {tournamentID: data.tournamentID})
        } 
        
        if (tournamentsMap.get(data.tournamentID).length == data.maxPlayers) {
            console.log("Tournament lobby is full")
            var sessionIDsInTournament = tournamentsMap.get(data.tournamentID)
            var shuffledSessionList = sessionIDsInTournament.sort(() => 0.5 - Math.random())
            var tournamentGroups = data.maxPlayers / 2
            var test = []

            if (shuffledSessionList.length > 2) {
                while(shuffledSessionList.length > 0) {
                    test.push(shuffledSessionList.splice(0, tournamentGroups))
                }
            } else {
                test = shuffledSessionList;
            }
            
            console.log(test)
            if (test.length == 2) {
                var gameID = 'game' + Math.round(Math.random() * 100).toString();
                var colors = ["black", "white"]
                io.emit("startTournamentGame", {gameID: gameID , sessionIDs: test, colors: colors})
            } else {

                test.forEach (sessionIDPair => {
                    var gameID = 'game' + Math.round(Math.random() * 100).toString();
                    var colors = ["black", "white"]
                    io.emit("startTournamentGame", {gameID: gameID , sessionIDs: sessionIDPair, colors: colors})
                });
            }
            io.emit("STARTGAME", test)
        }
        tournamentsMap.delete(data.tournamentID)
    })

    socket.on('LEAVEQUEUE', function() {
        pendingRooms.pop();
    });

    socket.on('INITGAME', function(gameRoom) {
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

    socket.on('disconnect', function() {
        usersMap.delete(socket.id);
        socket.leave(socket.room);
        io.emit('USERLIST', Array.from(usersMap.values()));
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

    socket.on('changeRoom', function(newRoom, maxPlayers) {
        if (roomCount < maxPlayers) {

            if (roomCount == maxPlayers) {

                // pick 2 random people from the room
                io.emit('STARTGAME', '');
            }
            console.log("user added to room " + roomCount);
        } else {
            console.log("room full");
        }
    });


});

function addValue(key, value) {

    tournamentsMap.set(key, tournamentsMap.get(key) || []);
    tournamentsMap.get(key).push(value);
}

const port = process.env.PORT || 9000
app.listen(port, () => console.log(`Server started on port: ${port}`))

http.listen(3000, function() {
    console.log('listening on *:3000');
});
