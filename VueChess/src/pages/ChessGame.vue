<template>
  <div id="chessGame">
    <div class="gridContainer">
      <div class="chessGameColumn">
        <div v-if="playerColor === 'white'">
          <Chessboard :key="windowResize" :playerList="playerList" :endState="endState" :currentFenString="currentFenString" :currentColor="currentColor" :playerColor="playerColor" v-on:positionInfo="updatePositionInfo"/>
        </div>
        <div v-else>
          <Chessboard :key="windowResize" :playerList="playerList" :endState="endState" :currentFenString="currentFenString" :currentColor="currentColor" :playerColor="playerColor" v-on:positionInfo="updatePositionInfo"/>
        </div>
      </div>
      <div class="secondColumn divider">
        <CurrentPlayerDisplay class="currentMoveDisplayRow" :currentColor="currentColor"/>
        <MoveList class="moveListRow" :positionMoveList="positionMoveList"/>
        <div class="pauseButtonRow button" @click="showGameSettingsModal">Pause ||</div>
        <GameSettingsModal class="topLayer" v-show="isGameSettingsModalVisible" @close="hideGameSettingsModal" @leave="leaveGame"/>
      </div>
    </div>
    <disconnectedModal class="topLayer" v-show="isDisconnectedModalVisible" @returnMain="returnMainMenu"/>
  </div>
</template>

<script>
  import Chess from 'chess.js'
  import Chessboard from "../components/Chessboard";
  import MoveList from "../components/MoveList";
  import CurrentPlayerDisplay from "../components/CurrentPlayerDisplay";
  import GameSettingsModal from '../components/gameSettingsModal';
  import disconnectedModal from "../components/disconnectedModal";
  import io from 'socket.io-client';
  import UsersDB from "../UsersDB";

  export default {
    name: 'ChessGame',
    data() {
      return {
        positionMoveList: [{color: '', move: '', fenString: '' }],
        windowResize: 0,
        currentFenString: '',
        currentColor: '',
        socket: io('http://localhost:3000'),
        playerColor: '',
        endState: '',
        isGameSettingsModalVisible: false,
        isDisconnectedModalVisible: false,
        playerList: [],
      }
    },
    created() {
      window.addEventListener('resize', this.handleResize);
      this.handleResize();

      // Gets the player's color for this game
      this.playerColor = sessionStorage.getItem('playerColor');
      console.log(this.playerColor);

      // Changes the players' sockets to be in the same room
      let gameRoom = sessionStorage.getItem('gameRoomID');
      this.socket.emit('INITGAME', gameRoom);

      this.socket.on('USERLIST', (userList) => {
        this.playerList = userList;
      });

      // Used for chess logic to check for a checkmate or draw in the game
      this.game =  new Chess();
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize);
    },
    mounted() {
      // Keeps tracks of all the moves both players have made and updates pieces after a player moved
      this.socket.on('UPDATEGAME', (game) => {
        this.checkGameEnd(game);

        this.currentFenString = game.position;
        this.currentColor = game.color;

        if (game.color === 'black') {
          this.positionMoveList.push({color: 'White', move: game.history, fenString: game.fenString })
        }
        else {
          this.positionMoveList.push({color: 'Black', move: game.history, fenString: game.fenString })
        }
      });

      // If an opponent disconnects from game, current player wins the game
      this.socket.on('SHOWDISCONNECT', (message) => {
        let user = this.$cookies.get('username');
        UsersDB.incrementWins(user);
        if (message.reason === 'randomDisconnect') {
          message.users.forEach(player => {
            if (player !== user) {
              UsersDB.incrementLosses(player);
            }
          });
        }
        console.log('disconnect by leaving');
        sessionStorage.setItem('playerColor', '');
        this.isDisconnectedModalVisible = true;
      });
    },
    components: {
      Chessboard,
      MoveList,
      CurrentPlayerDisplay,
      GameSettingsModal,
      disconnectedModal,
    },
    methods: {
      updatePositionInfo(position) {
        let moveListLength = position.moveList.length;
        if (position.moveList[moveListLength - 1] != undefined) {
          // Sends the server the latest chess game information
          this.socket.emit('PIECEMOVED', { gamePosition: position.fenString, gameRoomID: sessionStorage.getItem('gameRoomID'), color: position.currentPlayerMove, gameHistory: position.moveList });
        }
      },
      handleResize() {
        this.windowResize = window.innerWidth + window.innerHeight;
      },
      checkGameEnd(game) {
        this.game.load(game.position);
        if (this.game.game_over() === true) {
          if (this.game.in_checkmate() === true) {
            console.log("checkmate " + this.currentColor);
            this.endState = this.currentColor;
          }
          else if (this.game.in_draw() === true) {
            this.endState = 'draw';
          }
        }
      },
      showGameSettingsModal() {
        this.isGameSettingsModalVisible = true;
      },
      hideGameSettingsModal() {
        this.isGameSettingsModalVisible = false;
      },
      leaveGame() {
        // Resets the player's color
        sessionStorage.setItem('playerColor', '');

        // Gives the leaving player a lose in their record
        let user = this.$cookies.get('username');
        UsersDB.incrementLosses(user);

        this.socket.emit('LEAVEGAME', '');

        // Returns to the main menu
        this.$router.push('/');
      },
      returnMainMenu() {
        this.$router.push('/');
      },
    }
  }
</script>

<style>
.topLayer {
  z-index: 2;
}

.button {
  border: 2px solid lightgray;
  border-radius: 50px;
  transition: ease-out 0.2s all;
  cursor: pointer;
  padding: 20px;
  flex:1;
  margin-left: 30%;
  margin-right: 30%;
  align-self: center;
  font-size:18px;
}

.button:hover{
   background-color: coral;
   border-color:coral;
   color:white;
 }

.button:active{
   background-color: lightsalmon;
   border-color:lightsalmon;
 }

* {
  padding: 0;
  margin: 0;
}

.gridContainer {
  box-sizing: border-box;
  display: grid;
  box-shadow: 0 0 12px lightgrey;
  grid-template-rows: 1fr 2fr;
  border-radius: 10px;
  padding: 20px;
  grid-gap: 10px;
  width: 85vw;
  background: white;
  height: 100vh;
  overflow-y: scroll;
}

.chessGameColumn {
  margin: 0;
  justify-self: center;
  z-index: 1;
  grid-column: 1;
  grid-row: 1;
}

.secondColumn {
  display: grid;
  grid-column: 1;
  grid-row: 2;
  grid-template-rows: 1fr 3fr 1fr;
  padding-bottom: 10px;
}

.currentMoveDisplayRow {
  grid-column: 1;
  grid-row: 1;
  border-top: 1px solid lightgray;
}

.moveListRow {
  grid-column: 1;
  grid-row: 2;
  text-align: center;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0 0 12px lightgrey;
  overflow: scroll;
  max-height: 400px;
}

.pauseButtonRow {
  border-style: solid;
  grid-column: 1;
  grid-row: 3;
  text-align: center;
  color: coral;
  margin-top: 10px;
}

@media (min-width: 1100px) {
  .gridContainer {
    box-sizing: border-box;
    display: grid;
    box-shadow: 0 0 12px lightgrey;
    border-radius: 10px;
    grid-template-columns: 65%;
    grid-template-rows: 1fr 3fr 1fr;
    grid-gap: 10px;
    width: 95vw;
    height: 95vh;
    background: white;
  }

  .chessGameColumn {
    grid-column: 1;
    grid-row: span 2;
    justify-self: center;
    padding-left: 10vw;
    padding-right: 10vw;
  }

  .secondColumn {
    border-left: 1px solid lightgray;
    padding-left: 2vw;
    display: grid;
    grid-column: 2;
    grid-template-rows: 1fr 6fr 1fr;
    grid-row: span 3;
  }

  .currentMoveDisplayRow {
    border-style: solid;
    border-color: white;
    grid-column: span 2;
    grid-row: 1;
  }

  .moveListRow {
    grid-column: span 2;
    grid-row: 2;
    text-align: center;
    overflow: scroll;
    margin: 0 auto;
    border-radius: 10px;
    box-shadow: 0 0 12px lightgrey;
    max-height: 950px;
  }

  .pauseButtonRow {
    border-style: solid;
    grid-column: span 2;
    grid-row: 3;
    text-align: center;
    color: coral;
    margin-top: 10px;
  }
}
</style>
