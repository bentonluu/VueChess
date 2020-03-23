<template>
  <div class="main-container">
    <h1>Main Page, Welcome <span v-bind:style="{color:'coral'}">{{this.$cookies.get("username")}}</span></h1>
    <div class="btn" v-on:click="logOut">Log Out</div>
  </div>
</template>

<script>
import auth from '../../auth'


export default {
  name: 'Main',
  data () {
    return {
      
    }
  },
  methods:{
    logOut(){
      setTimeout(()=>{
        this.$router.replace('/logout')
      },1000)
      
    }
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