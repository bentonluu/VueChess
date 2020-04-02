import axios from 'axios';

const url = 'http://localhost:9000/api/users/'

// Class for operating on user schema
class UsersDB{
    // Get Users
    static getUsers(){
        return new Promise(async (resolve,reject)=>{
            try {
                const res = await axios.get(url);
                const data = res.data
                resolve(
                    data.map(user =>({
                        ...user
                    }))
                )
            } catch (err) {
                reject(err)
            }
        })
    }
    //Authenticate user
    static authenticate(user){
        
        return new Promise(async (resolve,reject)=>{
            try {
                const res = await axios.get(`${url}user/{"email":"${user.email}", "password":"${user.password}"}`);
                const data = res.data
                resolve(
                    data
                )
            } catch (err) {
                reject(err)
            }
        })
    }

    //Increment Wins
    static incrementWins(username){
        return axios.put(`${url}${username}/win`)
    }

    //Increment Losses
    static incrementLosses(username){
        return axios.put(`${url}${username}/loss`)
    }
    
    // Create User
     static async insertUser(user){
        //
        if(user.username.length===0 || user.email.length ===0 || user.password.length ===0)return "Incomplete Fields"
        // check for dupplicates
        // ... Working on it
        var existingUsers = await this.checkExistingUser(user.username)
        if(existingUsers.length===1){
            return "User Exists"
        }
        else{
            axios.post(url,{
                username: user.username,
                type: "User",
                email: user.email,
                password: user.password
            })
            return "User Created"
        }
        
    }
    // Create Admin
    static insertAdmin(user){
        return axios.post(url,{
            username: user.username,
            type: "Admin",
            email: user.email,
            password: user.password,
        })
    }
    // Delete User (Potentially)
    static deleteUser(id){
        return axios.delete(`${url}${id}`)
    }

    //Get user by username
    static checkExistingUser(username){
        return new Promise(async (resolve,reject)=>{
            try {
                const res = await axios.get(`${url}${username}`);
                const data = res.data
                resolve(
                    data
                )
            } catch (err) {
                reject(err)
            }
        })
    }
}

export default UsersDB