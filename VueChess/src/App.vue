<template>
  <div id="app">
    <Login/>
  </div>
</template>

<script>
import Login from './pages/Login'

export default {
  name: 'app',
  components:{
    Login
  },
  data () {
    return {
     
    }
  }
}
</script>

<style>
html{
  margin: 0 auto;
}
body{
  /* background-color:#E0E0E0; */
}
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50; */
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
