<template>
  <div class="login-container">
   <h2>Chess & Chill</h2>
      <input type="text" class="" placeholder="Username" name="user" id='user' v-model="username" required />
      <input type="email" class="" placeholder="Email" name="email" id='email' v-model="email" required />
      <input type="password" class="" placeholder="Password" name="email" id='email' v-model="password" required />
      <div class="btn-container">
        <div class="btn" v-on:click="signupSubmit">Signup</div><div class="btn" v-on:click="backNavigate">Back</div>
      </div>
      <p class="signUp" v-if="signedUp">User created!</p>
      <p class="error"  v-if="errorFieldsEmpty">Please Fill out every field.</p>
      <p class="error"  v-if="errorDupplicate">User already exists.</p>
  </div>
</template>

<script>
import UsersDB from '../UsersDB'

export default {
  name: 'Signup',
  data: () => ({
      username:'',
      email:'',
      password:'',
      errorFieldsEmpty:false,
      errorDupplicate:false,
      signedUp:false
  }),
  methods:{
    signupSubmit(){
      var user = {
        username:this.username,
        password:this.password,
        email:this.email
      }
      UsersDB.insertUser(user).then(res => {
        if(res=="User Created"){
        this.errorFieldsEmpty = false
        this.errorDupplicate = false
        this.signedUp = true
      }
      else if(res=="User Exists"){
        this.errorFieldsEmpty = false
        this.errorDupplicate = true
        this.signedUp = false
      }
      else if(res=="Incomplete Fields"){
        this.errorFieldsEmpty = true
        this.errorDupplicate = false
        this.signedUp = false
      }
      })
     
      

      
    },
    backNavigate(){
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang="scss">
.login-container{
    display:flex;
    flex-direction: column;
    align-items: center;
    padding:20px;
    min-width: 300px;
    width:30%;
    border-radius: 10px;
    background: white;
}
.name-container{
  width: 70%;
  display:flex;
  flex-direction: row;
  input{
    margin:20px 0;
  }
  :first-child{
    margin-right: 20px;
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
.btn{
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
.signUp {
  color: limegreen;
}
.error{
  color:red;
}
</style>