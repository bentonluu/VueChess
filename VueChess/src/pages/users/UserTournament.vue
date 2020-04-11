<template>
    <div class="main-container">
        <h1 class="title">Tournaments</h1>

        <img class="arrow" :src="leftArrow" alt="left arrow" v-on:click="toMainPage">

        <div class="tournamentHeader">
            <input class="searchInput" placeholder="Search" v-model="searchReq" type="text">
            <div class="btn" v-on:click="createNewTournament" v-show="isAdmin">Create New</div>
        </div>

        <table>
            <tr class="tableColor">
                <th>Name</th>
                <th>Max Players</th>
                <th>Start Date and Time</th>
            </tr>

            <tr class="row tournamentList" v-for="tor in search" v-bind:key="tor._id" v-on:click="showDetailsModal(tor)">
                <td>{{tor.name}}</td>
                <td>{{tor.maxPlayers}}</td>
                <td>{{tor.startTime}}</td>
            </tr>
        </table>

        <tournamentDetails v-bind:tournamentInfo="tournament" v-bind:disable="disable" v-show="isTournamentDetailsVisible" @close="hideDetailsModal" @edit="editTournament"></tournamentDetails>
        <manageTournament :create="createNew" v-show="isTournamentManagerVisible" @close="hideTournamentManager"></manageTournament>
    </div>
</template>

<script>
    import tournamentDetails from '../../components/TournamentDetails'
    import manageTournament from '../../components/admin/ManageTournament'
    import TournamentsDB from '../../TournamentsDB'
    import UsersDB from '../../UsersDB'
    import io from 'socket.io-client';

    export default {
        name: 'userTournament',
        components: {
            tournamentDetails,
            manageTournament
        },
        data() {
            return {
                isAdmin: false,
                isTournamentDetailsVisible: false,
                isTournamentManagerVisible: false,
                createNew: null,
                tournament: {},
                disable: false,
                searchReq: null,
                tournaments: [],
                currentPlayers: new Map(),
                socket: io('http://localhost:3000'),
                leftArrow: require('../../assets/leftArrow.png')
            }
        },
        methods: {
            toMainPage() {
                this.$router.push('/')
            },
            createNewTournament() {
                this.isTournamentManagerVisible = true;
                this.createNew = true;
            },
            editTournament() {
                this.isTournamentManagerVisible = true;
                this.createNew = false;
            },
            hideTournamentManager() {
                this.isTournamentManagerVisible = false;
                this.refresh()
            },
            showDetailsModal(tor) {
                this.tournament = tor
                var tournamentID = sessionStorage.getItem("tournamentId")
                if (tournamentID != null) {
                    this.disable = true
                }
                this.isTournamentDetailsVisible = true
            },
            hideDetailsModal() {
                this.isTournamentDetailsVisible = false
                this.refresh()
            },
            refresh() {
                TournamentsDB.getTournaments().then(res => {
                console.log(res)
                res.forEach(element => {
                    element.startTime = new Date(element.startTime).toLocaleString()
                });
                    this.tournaments = res
                })

            }
        },
        computed: {
            search () {
                if (this.searchReq) {
                    return this.tournaments.filter(item => {
                        return item.name.toLowerCase().includes(this.searchReq.toLowerCase())
                    })
                } else {
                    return this.tournaments
                }
            }
        },
        mounted () {
            this.refresh()

            this.socket.on('updateTournamentPlayers', (data) => {
                var newMap = new Map(JSON.parse(data))
                this.currentPlayers = newMap
            });

        },
        created() {
            if (this.$cookies.get("user_type") === "Admin") {
                this.isAdmin = true
            }
        }
    }
</script>

<style scoped lang="scss">
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
.title {
  margin: 0;
}
td, th {
  padding: 14px;
  text-align: center;
  border-bottom: 2px solid lightgray;
}
table {
    border-collapse: collapse;
    border-spacing: 0;
    box-shadow: 0 0 12px lightgrey;
}
.tournamentList:hover {
  background-color: lightgray;
  color: white;
  text-shadow: 0 0 1px white;
}
table tr:last-child td {
  border: none;
}
.tableColor {
    background-color: coral;
    color: white;
    font-weight: bold;
}
span {
    display: block;
    margin-top: 5px;
}
.row:hover {
    cursor: pointer;
}
.tournamentHeader {
    display: flex;
    flex-direction: row;
    margin-bottom: 5px;
}
input{
  font-size: 18px;
  margin: 10px;
  width: 80%;
  display: block;
  border: none;
  text-align: center;
  padding: 10px;
  border-bottom: solid 2px grey;
  transition:ease-in 0.2s all;
  &:focus{
    outline: none;
    border-color: coral;
  }
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
