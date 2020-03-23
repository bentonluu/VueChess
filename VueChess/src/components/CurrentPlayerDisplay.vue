<template>
  <div>
    <div class="playerMoveTitle">
      <span>Current Player Move</span>
    </div>
    <div class="currentPlayerMove">
      {{ updateCurrentPlayerDisplayed() }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CurrentPlayerDisplay',
    data() {
      return {
      }
    },
    props: {
      positionMoveList: Array,
    },
    methods: {
      updateCurrentPlayerDisplayed() {
        let arrayLength = this.positionMoveList.length;
        if (arrayLength == 0) {
          return 'White';
        }
        else if (this.positionMoveList[arrayLength - 1].color == 'White') {
          return 'Black';
        }
        else {
          return 'White';
        }

        //console.log(this.movePlayerHistory.length());
      },
    },
  }
</script>

<style scoped>
  .playerMoveTitle {
    padding-top: 30px;
    text-decoration: underline;
    font-size: 26px;
    font-weight: bold;
  }

  .currentPlayerMove {
    margin-top: 15px;
    margin-bottom: 30px;
    font-size: 26px;
    font-weight: bold;
    padding: 15px;
    border: 4px solid coral;
    border-radius: 50px;
    display: inline-block;
    min-width: 120px;
  }
</style>
