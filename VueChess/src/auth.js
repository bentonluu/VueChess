/* globals localStorage */

export default {
    login (email, pass, cb) {
      cb = arguments[arguments.length - 1]
      if (localStorage.token) {
        if (cb) cb(true)
        this.onChange(true)
        return
      }
      pretendRequest(email, pass, (res) => {
        if (res.authenticated) {
          localStorage.token = res.token
          if (cb) cb(true)
          this.onChange(true)
        } else {
          if (cb) cb(false)
          this.onChange(false)
        }
      })
    },
  
    getToken () {
      return localStorage.token
    },
  
    logout (cb) {
      delete localStorage.token
      if (cb) cb()
      this.onChange(false)
    },
    //typecasts return value to boolean based on existance of a login token
    loggedIn () {
      return !!localStorage.token
    },
    //variable that gets set to true or false based on if we are logged in
    onChange () {}
  }
  // 1 second timeout fake login request that returns a token if authenticated
  function pretendRequest (email, pass, cb) {
    setTimeout(() => {
      if (email === 'test@test.com' && pass === 'pass') {
        cb({
          authenticated: true,
          token: Math.random().toString(36).substring(7)
        })
      } else {
        cb({ authenticated: false })
      }
    }, 1000)
  }