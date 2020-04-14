<template>
  <div class="login-container">
   <h2>Chess & Chill</h2>

   <form  @submit.prevent="login">
      <input v-on:keyup.enter="login" v-model="email" type="email"  placeholder="Email (Hint: player@mail.com)" name="email" id='email' required />
      <input v-on:keyup.enter="login" v-model="pass" type="password"  placeholder="Password (Hint: pass)" name="pass" id='pass' required />
      <div class="btn-container">
        <div class="btn-login" v-on:click="login" >Login</div><div class="btn-login" v-on:click="signupNavigate">Signup</div>
      </div>
    </form>
      <p v-if="error" class="error">Incorrect Credentials. Try again!</p>
  </div>
</template>

<script>
import auth from '../auth'


export default {
  name: 'Login',
  data: () => ({
      email:'',
      pass: '',
      error:false
  }),
  methods: {
    login () {
      auth.login(this.email, this.pass, loggedIn => {
        if (!loggedIn) {
          this.error = true
        } else {
          this.$router.replace(this.$route.query.redirect || '/')
        }
      })
    },
    signupNavigate(){
      this.$router.replace('/signup')
    },
  }
}
</script>

<style lang="scss">
.login-container{
    padding:20px;
    min-width: 400px;
    width:30%;
    box-shadow: 0 0 12px lightgrey;
    border-radius: 10px;
    background: white;
    form{
      width:100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
}
//standard button
.btn-container{
  width:60%;
  display:flex;
  flex-direction: row;
  // space between buttons
  :first-child{
    margin-right: 20px;
  }
  margin-top:20px;
}
.btn-login{
  border:2px solid lightgray;
  padding:15px;
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
// styling inputs
input{
  font-size: 18px;
  margin: 20px;
  width: 70%;
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
.error {
  color: red;
}
</style>
