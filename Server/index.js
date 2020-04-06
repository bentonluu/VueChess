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
var gamesMap = new Map();
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
        console.log("tournament size: " + tournamentsMap.get(data.tournamentID).length)
        if (tournamentsMap.get(data.tournamentID).length == data.maxPlayers) {
            console.log("Tournament lobby is full")
            console.log(tournamentsMap.get(data.tournamentID))

            if (tournamentsMap.get(data.tournamentID).length == 2) {
                var gameID = 'game' + Math.round(Math.random() * 100).toString();
                var colors = ["black", "white"]
                io.emit("startTournamentGame", {gameID: gameID , sessionIDs: tournamentsMap.get(data.tournamentID), colors: colors, 
                    maxPlayers: data.maxPlayers})
                io.emit("STARTGAME", tournamentsMap.get(data.tournamentID))

            } else {

                var playerPairsList = shufflePlayersList(data)
                console.log(playerPairsList)
                console.log(tournamentsMap.get(data.tournamentID))

                playerPairsList.forEach (sessionIDPair => {
                    console.log(sessionIDPair)
                    var gameID = 'game' + Math.round(Math.random() * 100).toString();
                    var colors = ["black", "white"]
                    io.emit("startTournamentGame", {gameID: gameID , sessionIDs: sessionIDPair, colors: colors, 
                        maxPlayers: data.maxPlayers})
                    io.emit("STARTGAME", sessionIDPair)
                });
            }
        }
    })

    socket.on('winTournament', function(tournamentInfo) {

        if (tournamentInfo.gameLoser != null) {
            removeValue(tournamentInfo.tournamentID, tournamentInfo.gameLoser)
            console.log(tournamentsMap.get(tournamentInfo.tournamentID))
        }

        var newShuffledPlayersList = shufflePlayersList(tournamentInfo)
        console.log(newShuffledPlayersList)
        console.log("players left in tournament" + newShuffledPlayersList.length)
        if (newShuffledPlayersList.length == 1) {
            tournamentsMap.delete(tournamentInfo.tournamentID)
            socket.emit("wonEntireTournament")
        }

        if (newShuffledPlayersList.length == 2) {
            var gameID = 'game' + Math.round(Math.random() * 100).toString();
            var colors = ["black", "white"]
            io.emit("startTournamentGame", {gameID: gameID , sessionIDs: newShuffledPlayersList, colors: colors,
                maxPlayers: data.maxPlayers})
            io.emit("STARTGAME", newShuffledPlayersList)
        } else if (newShuffledPlayersList.length > 2) {

            newShuffledPlayersList.forEach (sessionIDPair => {
                var gameID = 'game' + Math.round(Math.random() * 100).toString();
                var colors = ["black", "white"]
                io.emit("startTournamentGame", {gameID: gameID , sessionIDs: sessionIDPair, colors: colors,
                    maxPlayers: data.maxPlayers})
                io.emit("STARTGAME", sessionIDPair)
            });
        }

        console.log("New tournament player list: " + newShuffledPlayersList)
    })

    socket.on('LEAVEQUEUE', function() {
        pendingRooms.pop();
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
        io.to(gamesMap.get(socket.id)).emit('SHOWDISCONNECT', '');

    });

    socket.on('disconnect', function() {
        let currentGameRoom = gamesMap.get(socket.id);
        gamesMap.delete(socket.id);

        let gameRoomList = gamesMap.values();
        for (let i = 0; i < gameRoomList.length; i++) {
            console.log(gameRoomList[i]);
            if (gameRoomList[i] === currentGameRoom) {
                console.log(gameRoomList[i]);
            }
        }
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
    tournamentsMap.set(key, tournamentsMap.get(key)|| []);
    tournamentsMap.get(key).push(value)
}

function removeValue(key, value) {
    var indexOfValue = tournamentsMap.get(key).indexOf(value);
    tournamentsMap.get(key).splice(indexOfValue, indexOfValue);
}

function shufflePlayersList(data) {
    var sessionIDsInTournament = tournamentsMap.get(data.tournamentID)
    var shuffledSessionList = sessionIDsInTournament.sort(() => 0.5 - Math.random())
    var tournamentGroups = data.maxPlayers / 2
    var playerPairsList = []

    if (shuffledSessionList.length == 1) {
        playerPairsList = shuffledSessionList
    } else {
        for(var i =0; i < shuffledSessionList.length; i += tournamentGroups){
            playerPairsList.push(shuffledSessionList.slice(i, i+tournamentGroups))
        }
    }

    return playerPairsList
}

const port = process.env.PORT || 9000
app.listen(port, () => console.log(`Server started on port: ${port}`))

http.listen(3000, function() {
    console.log('listening on *:3000');
});
