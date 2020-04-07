<template>
  <div id="chessboard">
    <div v-if="playerColor === 'white'">
      <div :class="chessboardLayerWhite ? chessboardLayer[1] : chessboardLayer[1]">
        <span class="playerName playerBlack">{{ playerList[1] }}</span>
        <chessboard class="cg-board-wrap" :fen="currentFenString" @onMove="showInfo"/>
        <endGameModal :endState="endState" :whiteEndState="whiteEndState" class="topLayer" v-show="isEndGameModalVisible" @close="navigateAway"/>
        <wonTournament v-show="isWonTournamentVisible" @close="hideWonTournament"></wonTournament>
        <span class="playerName playerWhite">{{ playerList[0] }}</span>
      </div>
    </div>
    <div v-else>
      <div :class="chessboardLayerBlack ? chessboardLayer[1] : chessboardLayer[0]">
        <span class="playerName playerWhite">{{ playerList[0] }}</span>
        <chessboard class="cg-board-wrap" orientation="black" :fen="currentFenString" @onMove="showInfo"/>
        <endGameModal :endState="endState" :blackEndState="blackEndState" class="topLayer" v-show="isEndGameModalVisible" @close="navigateAway"/>
        <wonTournament v-show="isWonTournamentVisible" @close="hideWonTournament"></wonTournament>
        <span class="playerName playerBlack">{{ playerList[1] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { chessboard } from 'vue-chessboard'
  import 'vue-chessboard/dist/vue-chessboard.css'
  import endGameModal from "./endGameModal";
  import wonTournament from './wonTournamentModal'
  import TournamentsDB from "../TournamentsDB";
  import io from 'socket.io-client';

  export default {
    name: "Chessboard",
    data() {
      return {
        positionInfo: {},
        playerWhite: 'player1',
        playerBlack: 'player2',
        chessboardLayer: ['chessboardWrapperDisable','chessboardWrapperActive'],
        chessboardLayerWhite: true,
        chessboardLayerBlack: false,
        isEndGameModalVisible: false,
        isWonTournamentVisible: false,
        blackEndState: '',
        whiteEndState: '',
        socket: io('http://localhost:3000'),
      }
    },
    props: {
      // Assigned player color at start of game
      playerColor: String,
      // Current player color move
      currentColor: String,

      currentFenString: String,
      endState: String,
      playerList: Array,
    },
    components: {
      chessboard,
      endGameModal,
      wonTournament
    },
    methods: {
      showInfo(data) {
        this.positionInfo = data;
        // Sends chessboard information to ChessGame component
        this.$emit('positionInfo', { currentPlayerMove: data.turn, moveList: data.history, fenString: data.fen });
      },
      showEndGameModal() {
        this.isEndGameModalVisible = true;
      },
      navigateAway() {
        this.isEndGameModalVisible = false

        if (this.playerColor === "white") {
          if (this.whiteEndState === "WON") {
            this.updateTournament()
          } else {
            this.removeSessionStorageItems()
            this.$router.push('/').catch(err => {});
          }
        } else {
          if (this.blackEndState === "WON") {
            this.updateTournament()
          } else {
            this.removeSessionStorageItems()
            this.$router.push('/').catch(err => {});
          }
        }
      },
      updateTournament() {
        var tournamentGamePlayerSessions = JSON.parse(sessionStorage.getItem('tournamentGamePlayers'));
        var tournamentId = sessionStorage.getItem('tournamentId');
        var maxPlayers = sessionStorage.getItem('maxPlayers');

        if (tournamentId != null) {
          var winnerSessionId = sessionStorage.getItem('sessionId');
          var loserSessionId = tournamentGamePlayerSessions.filter(i => i !== winnerSessionId)[0]

          var tournamentInfo = {
            tournamentID: tournamentId,
            maxPlayers: maxPlayers,
            gameWinner: winnerSessionId,
            gameLoser: loserSessionId
          }

          this.socket.emit("winTournament", tournamentInfo)
        }
      },
      hideWonTournament () {
        this.removeSessionStorageItems()
        this.isWonTournamentVisible = false
        this.$router.push('/').catch(err => {});
      },
      removeSessionStorageItems() {
          sessionStorage.removeItem('tournamentId')
          sessionStorage.removeItem('gameRoomID')
          sessionStorage.removeItem('tournamentGamePlayers')
          sessionStorage.removeItem("maxPlayers")
      }
    },
    created() {
    },
    mounted() {
      this.socket.on("wonEntireTournament", () => {
        this.isWonTournamentVisible = true
      });

      this.socket.on("startTournamentGame", (data) => {
        console.log(data)
        let sessionId = sessionStorage.getItem('sessionId');
        if (data.sessionIDs.includes(sessionId)) {

          sessionStorage.setItem('playerColor', data.colors[data.sessionIDs.indexOf(sessionId)]);
          sessionStorage.setItem('maxPlayers', data.maxPlayers)
          sessionStorage.setItem('tournamentGamePlayers', JSON.stringify(data.sessionIDs))

          // Sets the gameRoomID into browser storage
          console.log("sessions for tourn game:" + data.sessionIds)
          if (data.sessionIDs.includes(sessionId)) {
            sessionStorage.setItem('gameRoomID', data.gameID);
          }

                this.socket.on('STARTGAME', (game) => {
                // Will only start a chess game if player is in the same game
                    let gameID = sessionStorage.getItem('gameRoomID');
                    if (gameID === game) {
                        this.$router.go();
                    }
                });
          }
        })
    },
    watch: {
      // Enables or disables the corresponding player's chessboard when the currentPlayerMove changes
      currentColor: function() {
        if (this.endState === '') {
          if (this.currentColor === 'white') {
            this.chessboardLayerWhite = true;
            this.chessboardLayerBlack = false;
          }
          else {
            this.chessboardLayerWhite = false;
            this.chessboardLayerBlack = true;
          }
        }
        else {
          this.chessboardLayerWhite = true;
          this.chessboardLayerBlack = true;
        }
      },
      endState: function() {
        if (this.endState === 'black') {
          this.blackEndState = 'WON';
          this.whiteEndState = 'LOST';
          this.showEndGameModal();
        }
        else if (this.endState === 'white') {
          this.blackEndState = 'LOST';
          this.whiteEndState = 'WON';
          this.showEndGameModal();
        }
        else if (this.endState === 'draw') {
          this.blackEndState = 'DRAW';
          this.whiteEndState = 'DRAW';
          this.showEndGameModal();
        }
      }
    }
  }
</script>

<style>
  #chessboard {
    text-align: center;
  }

  .topLayer {
    z-index: 2;
  }

  .chessboardWrapperDisable {
    position: relative;
    z-index: -1;
  }

  .chessboardWrapperActive {
    position: relative;
    z-index: 1;
  }

  .playerName {
    font-size: 26px;
    font-weight: bold;
    min-width: 120px;
    display: inline-block;
    text-align: center;
  }

  .playerBlack {
    margin-bottom: 20px;
    margin-top: 2vh;
  }

  .playerWhite {
    margin-top: 20px;
    color: coral;
  }

  @media (min-height: 600px) and (min-width: 1100px) {
    .cg-board-wrap {
      height: 410px;
      width: 410px;
    }
  }
  @media (min-height: 650px) and (min-width: 1100px) {
    .cg-board-wrap {
      height: 430px;
      width: 430px;
    }
  }
  @media (min-height: 700px) and (min-width: 1100px) {
    .cg-board-wrap {
      height: 440px;
      width: 440px;
    }
  }
  @media (min-height: 750px) and (min-width: 1100px) {
    .cg-board-wrap {
      height: 490px;
      width: 490px;
    }
  }
  @media (min-height: 800px) and (min-width: 1100px) {
    .cg-board-wrap {
      height: 590px;
      width: 590px;
    }
  }
  @media (min-height: 850px) and (min-width: 1100px) {
    .cg-board-wrap {
      height: 630px;
      width: 630px;
    }
  }
  @media (min-height: 900px) and (min-width: 1100px) {
    .cg-board-wrap {
      height: 680px;
      width: 680px;
    }
  }
</style>
