/* globals localStorage */
import Vue from 'vue'
// import users db functions
import UsersDB from './UsersDB'

export default {
    login (email, pass, cb) {
      cb = arguments[arguments.length - 1]
      if (Vue.$cookies.get("user_session")) {
        if (cb) cb(true)
        this.onChange(true)
        return
      }
      pretendRequest(email, pass, (res) => {
        if (res.authenticated) {
          Vue.$cookies.set("user_session",res.token,'1d')
          Vue.$cookies.set("username",res.username,'1d')
          if (cb) cb(true)
          this.onChange(true)
        } else {
          if (cb) cb(false)
          this.onChange(false)
        }
      })
    },

    getToken () {
      return Vue.$cookies.get("user_session")
    },

    logout (cb) {
      delete Vue.$cookies.remove("user_session")
      if (cb) cb()
      this.onChange(false)
    },
    //typecasts return value to boolean based on existance of a login token
    loggedIn () {
      return !!Vue.$cookies.isKey("user_session")
    },
    //variable that gets set to true or false based on if we are logged in
    onChange () {}
  }
  // 1 second timeout fake login request that returns a token if authenticated
  async function pretendRequest (email, pass, cb) {
    var user = {
      email: email,
      password: pass
    }
    // authenticate asynchronosly and return the
    var result = await UsersDB.authenticate(user)
    // console.log(result[0].username)

    if (result.length === 1) {
      cb({
        authenticated: true,
        username: result[0].username,
        token: Math.random().toString(36).substring(7)
      })
    } else {
      cb({ authenticated: false })
    }

  }
