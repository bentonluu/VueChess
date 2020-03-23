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


    // Get a user by username
    // .
    // ... Working on it
    // .
    // Create User
    static insertUser(user){
        // check for dupplicates
        // ... Working on it
        // var userExists = new Promise(async (resolve,reject)=>{
        //     try {
        //         const res = await axios.get(url);
        //         const data = res.data
        //         resolve(
        //             data.map(user =>({
        //                 ...user
        //             }))
        //         )
        //     } catch (err) {
        //         reject(err)
        //     }
        // })
        return axios.post(url,{
            username: user.username,
            type: "User",
            email: user.email,
            password: user.password
        })
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
}

export default UsersDB