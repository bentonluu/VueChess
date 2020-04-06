<template>
  <div id="chessboard">
    <div v-if="playerColor === 'white'">
      <div :class="chessboardLayerWhite ? chessboardLayer[1] : chessboardLayer[1]">
        <span class="playerName playerBlack">{{ playerList[1] }}</span>
        <chessboard class="cg-board-wrap" :fen="currentFenString" @onMove="showInfo"/>
        <endGameModal :endState="endState" :whiteEndState="whiteEndState" class="topLayer" v-show="isEndGameModalVisible" @close="returnToMainMenu"/>
        <span class="playerName playerWhite">{{ playerList[0] }}</span>
      </div>
    </div>
    <div v-else>
      <div :class="chessboardLayerBlack ? chessboardLayer[1] : chessboardLayer[0]">
        <span class="playerName playerWhite">{{ playerList[0] }}</span>
        <chessboard class="cg-board-wrap" orientation="black" :fen="currentFenString" @onMove="showInfo"/>
        <endGameModal :endState="endState" :blackEndState="blackEndState" class="topLayer" v-show="isEndGameModalVisible" @close="returnToMainMenu"/>
        <span class="playerName playerBlack">{{ playerList[1] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import { chessboard } from 'vue-chessboard'
  import 'vue-chessboard/dist/vue-chessboard.css'
  import endGameModal from "./endGameModal";

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
        blackEndState: '',
        whiteEndState: '',
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
      endGameModal
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
      returnToMainMenu() {
        sessionStorage.setItem('gameRoomID', '');
        this.$router.replace('/');
      },
    },
    created() {
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
