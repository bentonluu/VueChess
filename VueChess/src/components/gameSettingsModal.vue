<template>
  <div class="modal-backdrop">
    <div class="modal">
      <section class="body">
        <div>Game is paused</div>
      </section>

      <footer class="footer">
        <div class="btn" v-on:click="leave">Leave</div>
        <div class="btn" v-on:click="close">Close</div>
      </footer>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'gameSettingsModal',
    data () {
      return {
      }
    },
    methods: {
      close() {
        this.$emit('close');
      },
      leave() {
        this.$emit('leave');
      },
    }
  }
</script>

<style lang="scss">
  .btn{
    border:2px solid lightgray;
    padding:15px 55px;
    flex:1;
    font-size:18px;
    margin-bottom: 20px;
    margin-left: 5px;
    margin-right: 5px;
    border-radius: 50px;
    transition: ease-out 0.2s all;
    cursor:pointer;
    &:hover{
      background-color: coral;
      border-color:coral;
      color:white;
    }
    &:active{
      background-color: lightsalmon;
      border-color:lightsalmon;
    }
  }
  .modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
  }
  .body {
    position: relative;
    padding: 20px 10px;
  }
  input{
    font-size: 18px;
    margin: 20px;
    width: 90%;
    display: block;
    border: none;
    padding: 10px 0;
    border-bottom: solid 2px grey;
    transition:ease-in 0.2s all;
    &:focus{
      outline: none;
      border-color: coral;
    }
  }
  .footer {
    display: flex;
    flex-direction: row;
  }
</style>
