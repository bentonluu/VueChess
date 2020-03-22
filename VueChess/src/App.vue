<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import auth from './auth'


export default {
  name: 'app',
  components:{
    
  },
  data () {
    return {
      loggedIn: auth.loggedIn()
    }
  },
  created () {
    auth.onChange = loggedIn => {
      this.loggedIn = loggedIn
    }
  }
}
</script>

<style lang="scss">

html{
  margin: 0 auto;
}
body{
  background-color:#E0E0E0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height:100vh;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

</style>
