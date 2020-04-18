import axios from 'axios';

const url = 'http://localhost:9000/api/tournaments/'

// Class for operating on tournament schema
class TournamentsDB{
    // Get Users
    static getTournaments(){
        return new Promise(async (resolve,reject)=>{
            try {
                const res = await axios.get(url);
                const data = res.data
                resolve(
                    data.map(tournament =>({
                        ...tournament
                    }))
                )
            } catch (err) {
                reject(err)
            }
        })
    }

    // Create Tournament
    // ------------------------------------------------------------------------------
    // For DATE guide, follow https://docs.mongodb.com/manual/reference/method/Date/
    // ------------------------------------------------------------------------------

     static async insertTournament(tournament){
        //
        console.log(tournament.name)
        if(tournament.name.length===0 || tournament.maxPlayers.length ===0 || tournament.startTime.length ===0) return "Incomplete Fields"
        // check for dupplicates
        var existingTournaments = await this.getTournament(tournament.name)
        if(existingTournaments.length===1){
            return "Tournament Exists"
        }
        else{
            axios.post(url,{
                name: tournament.name,
                maxPlayers: tournament.maxPlayers,
                startTime: tournament.startTime
            })
            return "Tournament Created"
        }
        
    }
   
    // Delete User
    static deleteTournament(name){
        return axios.delete(`${url}${name}`)
    }

    // Get Tournament by Name
    static getTournament(tournament){
        return new Promise(async (resolve,reject)=>{
            try {
                const res = await axios.get(`${url}${tournament}`);
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

export default TournamentsDB