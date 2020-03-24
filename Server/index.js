// Express
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

// Socket.io
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });

var usersMap = new Map();
var rooms = ['Lobby'];

// Middleware
app.use(bodyParser.json())
app.use(cors())

// Make requests to users api
const users = require('./userCollection')
app.use('/api/users',users)

// Socket setup
io.on('connection', function(socket) {

    console.log("user joined");
    socket.on('newUser', function(username){
        socket.username = username;
        usersMap.set(socket.id, username);
        socket.room = 'Lobby';
        socket.join('Lobby');
    });

    socket.on('createRoom', function(room) {
        rooms.push(room);
    });

    socket.on('pieceMoved', function(){

    });

    socket.on('changeRoom', function(newRoom) {
        var oldRoom = socket.room;
        socket.leave(socket.room);
        socket.join(newRoom);
        socket.room = newRoom;
    });

    socket.on('disconnect', function() {
        usersMap.delete(socket.id);
        socket.leave(socket.room);
        console.log("user left");
    });
});

const port = process.env.PORT || 9000
app.listen(port, ()=>console.log(`Server started on port: ${port}`))

http.listen(3000, function(){
    console.log('listening on *:3000');
  });