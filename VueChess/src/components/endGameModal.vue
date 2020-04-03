<template>
  <div class="modal-backdrop">
    <div class="modal">
      <div v-if="(endState === 'black' && blackEndState === 'WON') || (endState === 'white' && whiteEndState === 'WON')">
        <section class="body">
          <div>You <span class="won">WON</span></div>
        </section>
      </div>
      <div v-else-if="whiteEndState === 'DRAW' || blackEndState === 'DRAW'">
        <section class="body">
          <div><span class="draw">DRAW</span></div>
        </section>
      </div>
      <div v-else>
        <section class="body">
          <div>You <span class="lost">LOST</span></div>
        </section>
      </div>

      <footer class="footer">
        <div class="btn" v-on:click="close">Return to Main Menu</div>
      </footer>
    </div>
  </div>
</template>

<script>
  import io from 'socket.io-client';
  import UsersDB from "../UsersDB";
  export default {
    name: 'endGameModal',
    data () {
      return {
        socket: io('http://localhost:3000'),
      }
    },
    props: {
      endState: String,
      whiteEndState: String,
      blackEndState: String,
    },
    methods: {
      close() {
        this.$emit('close');
      },
      wonGame(username) {
        UsersDB.incrementWins(username);
        sessionStorage.setItem('playerColor', '');
      },
      lostGame(username) {
        UsersDB.incrementLosses(username);
        sessionStorage.setItem('playerColor', '');
      }
    },
    watch: {
      whiteEndState: function() {
        let user = this.$cookies.get('username');
        if (this.whiteEndState === 'WON') {
          this.wonGame(user);
          console.log('white WON');
        }
        else if (this.whiteEndState === 'LOST') {
          this.lostGame(user);
          console.log('white LOST');
        }
      },
      blackEndState: function() {
        let user = this.$cookies.get('username');
        if (this.blackEndState === 'WON') {
          this.wonGame(user);
          console.log('black WON');
        }
        else if (this.blackEndState === 'LOST') {
          this.lostGame(user);
          console.log('black LOST');
        }
      }
    }
  }
</script>

<style lang="scss">
  .won {
    color: forestgreen;
    font-weight: bold;
  }
  .lost {
    color: red;
    font-weight: bold;
  }
  .draw {
    color: orange;
    font-weight: bold;
  }
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
