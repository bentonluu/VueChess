<template>
  <div>
    <div class="playerMoveTitle">
      <span>Current Move</span>
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
      currentColor: String,
    },
    methods: {
      updateCurrentPlayerDisplayed() {
        if (this.currentColor === 'white') {
          return 'White';
        }
        else if (this.currentColor === 'black') {
          return 'Black';
        }
        else {
          return 'White';
        }
      },
    },
  }
</script>

<style scoped>
  .playerMoveTitle {
    padding-top: 20px;
    text-decoration: underline;
    font-size: 26px;
    font-weight: bold;
    color: coral;
  }

  .currentPlayerMove {
    margin-bottom: 5px;
    font-size: 32px;
    font-weight: bolder;
    padding: 5px;
    border-radius: 50px;
    display: inline-block;
  }
</style>
