<template>
    <div class="main-container">
        <h1>Leaderboards</h1>

        <img class="arrow" :src="leftArrow" alt="left arrow" v-on:click="toMainPage">

    </div>
</template>

<script>
    export default {
        name: 'leaderboards',
        data() {
            return {
                leftArrow: require('../../assets/leftArrow.png')
            }
        },
        methods: {
            toMainPage() {
                this.$router.replace('/')
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
    position: relative;
}
.arrow {
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 15px;
  margin-left: 20px;
  padding: 6px;
  height: 40px;
  width: 40px;
  cursor: pointer;
  border: 2px solid lightgray;
  border-radius: 50px;
  transition: ease-out 0.2s all;
}
.arrow:hover {
  background: coral;
  color: white;
  border: 2px solid transparent;
}
</style>
