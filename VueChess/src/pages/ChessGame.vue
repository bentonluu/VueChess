<template>
  <div id="chessGame">
    <div class="gridContainer">
      <div class="firstColumn">

        <Chessboard :key="windowResize" :currentFenString="currentFenString" v-on:positionInfo="updatePositionInfo"/>
      </div>
      <div class="secondColumn">
        <CurrentPlayerDisplay :positionMoveList="positionMoveList"/>
        <MoveList :positionMoveList="positionMoveList"/>
        <GameSettings/>
      </div>
    </div>
  </div>
</template>

<script>
  import Chessboard from "../components/Chessboard";
  import MoveList from "../components/MoveList";
  import CurrentPlayerDisplay from "../components/CurrentPlayerDisplay";
  import GameSettings from '../components/GameSettings'

  export default {
    name: 'ChessGame',
    data() {
      return {
        positionMoveList: [{color: '', move: '', fenString: '' }],
        window: {
          width: 0,
          height: 0
        },
        windowResize: 0,
        currentFenString: '',
      }
    },
    created() {
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize);
    },
    components: {
      Chessboard,
      MoveList,
      CurrentPlayerDisplay,
      GameSettings,
    },
    methods: {
      updatePositionInfo(position) {
        let moveListLength = position.moveList.length;
        if (position.moveList[moveListLength - 1] != undefined) {
          if (position.currentPlayerMove === 'black') {
            this.positionMoveList.push({color: 'White', move: position.moveList[moveListLength - 1], fenString: position.fenString })
          }
          else {
            this.positionMoveList.push({color: 'Black', move: position.moveList[moveListLength - 1], fenString: position.fenString })
          }
        }
      },
      handleResize() {
        this.window.width = window.innerWidth;
        this.window.height = window.innerHeight;
        this.windowResize = this.window.width + this.window.height;
        this.currentFenString = this.positionMoveList[this.positionMoveList.length-1].fenString;
      },
    }
  }
</script>

<style>
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

.firstColumn {
  grid-column: 1;
  grid-row: 1;
  justify-self: center;
  padding-left: 10vw;
  padding-right: 10vw;
}

.secondColumn {
  border-style: solid;
  border-color: green;
  grid-column: 1;
  grid-row: 2;
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

  .firstColumn {
    grid-column: 1;
    grid-row: span 2;
    justify-self: center;
    padding-left: 10vw;
    padding-right: 10vw;
  }

  .secondColumn {
    border-style: solid;
    border-color: green;
    grid-column: 2;
    grid-row: span 2;
    text-align: center;
    overflow: scroll;
  }
}
</style>
