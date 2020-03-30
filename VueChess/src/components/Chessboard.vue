<template>
  <div id="chessboard">
    <span class="playerName playerBlack">{{ playerBlack }}</span>
    <div v-if="playerColor === 'white'">
      <div :class="chessboardLayerWhite ? chessboardLayer[1] : chessboardLayer[1]">
        <chessboard class="cg-board-wrap" :fen="currentFenString" @onMove="showInfo"/>
        <endGameModal :endState="endState" :whiteEndState="whiteEndState" class="topLayer" v-show="isEndGameModalVisible" @close="returnToMainMenu"/>
      </div>
    </div>
    <div v-else>
      <div :class="chessboardLayerBlack ? chessboardLayer[1] : chessboardLayer[0]">
        <chessboard class="cg-board-wrap" orientation="black" :fen="currentFenString" @onMove="showInfo"/>
        <endGameModal :endState="endState" :blackEndState="blackEndState" class="topLayer" v-show="isEndGameModalVisible" @close="returnToMainMenu"/>
      </div>
    </div>
    <span class="playerName playerWhite">{{ playerWhite }}</span>
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
      currentFenString: String,
      // Assigned player color at start of game
      playerColor: String,
      // Current player color move
      currentColor: String,
      endState: String,
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
    padding: 15px;
    font-size: 24px;
    font-weight: bold;
    color: white;
    background: coral;
    border-radius: 50px;
    min-width: 120px;
    display: inline-block;
    text-align: center;
  }

  .playerBlack {
    margin-bottom: 20px;
  }

  .playerWhite {
    margin-top: 20px;
    margin-bottom: 10px;
  }

  @media (min-height: 400px) and (min-width: 750px) {
    .cg-board-wrap {
      height: 320px;
      width: 320px;
    }
  }

  @media (min-height: 500px) and (min-width: 850px) {
    .cg-board-wrap {
      height: 420px;
      width: 420px;
    }
  }

  @media (min-height: 600px) and (min-width: 950px) {
    .cg-board-wrap {
      height: 520px;
      width: 520px;
    }
  }

  @media (min-height: 700px) and (min-width: 1050px) {
    .cg-board-wrap {
      height: 620px;
      width: 620px;
    }
  }

  @media (min-height: 900px) and (min-width: 1250px) {
    .cg-board-wrap {
      height: 730px;
      width: 730px;
    }
  }
</style>
