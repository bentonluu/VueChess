<template>
  <div id="chessboard">
    <span class="playerName playerBlack">{{ playerBlack }}</span>
    <chessboard class="cg-board-wrap" :fen="currentFenString" @onMove="showInfo"/>
    <span class="playerName playerWhite">{{ playerWhite }}</span>

  </div>
</template>

<script>
  import { chessboard } from 'vue-chessboard'
  import 'vue-chessboard/dist/vue-chessboard.css'

  export default {
    name: "Chessboard",
    data() {
      return {
        positionInfo: {},
        playerWhite: 'player1',
        playerBlack: 'player2',
      }
    },
    props: {
      currentFenString: String,
    },
    components: {
      chessboard
    },
    methods: {
      showInfo(data) {
        this.positionInfo = data;
        this.$emit('positionInfo', { currentPlayerMove: data.turn, moveList: data.history, fenString: data.fen });
      },
    },
  }
</script>

<style>
  #chessboard {
    text-align: center;
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
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .playerWhite {
    margin-top: 25px;
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

  @media (min-height: 800px) and (min-width: 1150px) {
    .cg-board-wrap {
      height: 720px;
      width: 720px;
    }
  }

  @media (min-height: 900px) and (min-width: 1250px) {
    .cg-board-wrap {
      height: 800px;
      width: 800px;
    }
  }

</style>
