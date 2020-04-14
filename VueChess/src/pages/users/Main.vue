<template>
  <div class="main-container">
    <h2 class="logo ">Chess & Chill <span v-show="isAdmin">(Admin)</span></h2>
    <h1 class="main-title">Welcome <strong v-bind:style="{color:'coral'}">{{this.$cookies.get("username")}}</strong></h1>
    <div>
      <div class="btn" v-on:click="goToQuickPlay">Quick Play</div>
      <div class="btn" v-on:click="goToLeaderBoard">Leader Board</div>
      <div class="btn" v-on:click="logOut">Log Out</div>
    </div>
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
      isAdmin: false,
    }
  },
  methods:{
    logOut(){
      setTimeout(() => {
        this.$router.replace('/logout')
      },1000)

    },
    toQuickPlay(){
      this.$router.push('quickPlay')
    },
    toTournament(){
      this.$router.push('tournament')
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

    if (this.$cookies.get("user_type") === "Admin") {
      this.isAdmin = true
    }
  }
}
</script>

<style lang="scss">
.logo {
  margin: 0;
}
.main-container{
    display:flex;
    flex-direction: column;
    align-items: center;
    padding:40px;
    min-width: 300px;
    width:50%;
    border-radius: 10px;
    background: white;
    position: relative;
}
.main-title{
  margin-bottom: 20px;
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
.arrow {
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 0;
}
</style>
