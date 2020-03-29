<template>
  <div id="chessGame">
    <div class="gridContainer">
      <div class="chessGameColumn">
        <div v-if="playerColor === 'white'">
          <Chessboard :key="windowResize" :endState="endState" :currentFenString="currentFenString" :currentColor="currentColor" :playerColor="playerColor" v-on:positionInfo="updatePositionInfo"/>
        </div>
        <div v-else>
          <span>Test</span>
          <Chessboard :key="windowResize" :endState="endState" :currentFenString="currentFenString" :currentColor="currentColor" :playerColor="playerColor" v-on:positionInfo="updatePositionInfo"/>
        </div>
      </div>
      <div class="secondColumn">
        <CurrentPlayerDisplay class="currentMoveDisplayRow" :currentColor="currentColor"/>
        <MoveList class="moveListRow" :positionMoveList="positionMoveList"/>
        <input class="settingButton" type="image" src="./src/img/icons8-settings.svg" @click="showGameSettingsModal"/>
        <GameSettingsModal class="topLayer" v-show="isGameSettingsModalVisible" @close="hideGameSettingsModal" @leave="leaveGame"/>
        <p>{{ currentFenString }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import Chess from 'chess.js'
  import Chessboard from "../components/Chessboard";
  import MoveList from "../components/MoveList";
  import CurrentPlayerDisplay from "../components/CurrentPlayerDisplay";
  import GameSettingsModal from '../components/gameSettingsModal';
  import io from 'socket.io-client';

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
      }
    },
    created() {
      window.addEventListener('resize', this.handleResize);
      this.handleResize();

      this.playerColor = sessionStorage.getItem('playerColor');
      console.log(this.playerColor);
      let gameRoom = sessionStorage.getItem('gameRoomID');

      // Changes the players' sockets to be in the same room
      this.socket.emit('INITGAME', gameRoom);

      this.game =  new Chess();
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize);
    },
    mounted() {
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
      })
    },
    components: {
      Chessboard,
      MoveList,
      CurrentPlayerDisplay,
      GameSettingsModal,
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
        this.$router.replace('/');
      }
    }
  }
</script>

<style>
  .topLayer {
    z-index: 2;
  }
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.gridContainer {
  display: grid;
  border-style: solid;
  border-color: red;
  grid-gap: 10px;
}

.chessGameColumn {
  grid-column: 1;
  grid-row: 1;
  justify-self: center;
  padding-left: 10vw;
  padding-right: 10vw;
  z-index: 1;
}

.secondColumn {
  border-style: solid;
  border-color: green;
  grid-column: 2;
  grid-row: 1;
  text-align: center;
  overflow: scroll;
}

@media (min-width: 1100px) {
  .gridContainer {
    display: grid;
    border-style: solid;
    border-color: red;
    grid-template-columns: 70%;
    grid-gap: 10px;
    width: 100vw;
    height: 100vh;
  }

  .chessGameColumn {
    grid-column: 1;
    grid-row: span 2;
    justify-self: center;
    padding-left: 10vw;
    padding-right: 10vw;
  }

  .secondColumn {
    border-style: solid;
    border-color: orange;
    grid-template-rows: 1fr 2fr;
    grid-row: span 2;
  }

  .currentMoveDisplayRow {
    border-style: solid;
    border-color: white;
    grid-column: 2;
    grid-row: 0;
  }

  .moveListRow {
    border-style: solid;
    border-color: purple;
    grid-column: 2;
    grid-row: 1;
    text-align: center;
    overflow: scroll;
  }

  .settingButtonRow {
    border-style: solid;
    border-color: dodgerblue;
    grid-column: 2;
    grid-row: 2;
    text-align: center;
  }
}
</style>
