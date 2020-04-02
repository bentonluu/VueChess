<template>
  <div class="main-container">
    <h1>Main Page, Welcome <span v-bind:style="{color:'coral'}">{{this.$cookies.get("username")}}</span></h1>
    <div class="btn" v-on:click="goToQuickPlay">Quick Play</div>
    <div class="btn" v-on:click="goToLeaderBoard">Leader Board</div>
    <div class="btn" v-on:click="logOut">Log Out</div>
  </div>
</template>

<script>
import auth from '../../auth'
import io from 'socket.io-client';

export default {
  name: 'Main',
  data () {
    return {
      socket: io('http://localhost:3000'),
    }
  },
  methods:{
    logOut(){
      setTimeout(() => {
        this.$router.replace('/logout')
      },1000)
    },
    goToQuickPlay() {
      this.$router.replace({path: '/quickPlay'});
    },
    goToLeaderBoard() {
      this.$router.replace({path: '/leaderboard'});
    }
  },
  created() {
    let sessionID;
    let data = sessionStorage.getItem('sessionId');
    console.log(data);
    if (data == null) {
      sessionID = null;
      this.socket.emit('beginSession', { sessionID: sessionID, username: this.$cookies.get("username") });
    }
    else {
      sessionID = data;
      this.socket.emit('beginSession', { sessionID: sessionID, username: this.$cookies.get("username") });
    }

    // Sets the sessionID into browser storage
    this.socket.on("setSession", function(data) {
      console.log("Session ID: " + data.sessionID);
      sessionStorage.setItem('sessionId', data.sessionID);
    });
  }
}
</script>

<style lang="scss">
.main-container{
    display:flex;
    flex-direction: column;
    align-items: center;
    padding:20px;
    min-width: 300px;
    width:50%;
    border-radius: 10px;
    background: white;
}
.btn{
  border:2px solid lightgray;
  padding:15px 55px;
  flex:1;
  font-size:18px;
  margin-bottom: 20px;
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
</style>
