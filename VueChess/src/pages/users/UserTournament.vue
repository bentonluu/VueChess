<template>
    <div class="main-container">
        <h1>Tournaments</h1>

        <div class="btn" v-on:click="toMainPage">Back</div>

        <div class="tournamentHeader">
            <input placeholder="Search for a tournament" v-model="searchReq" type="text">
            <div class="btn" v-on:click="createNewTournament" v-show="isAdmin">Create New</div>
        </div>

        <table>
            <tr class="tableColor">
                <th>Name</th>
                <th>Players</th>
                <th>Start Date and Time</th>
            </tr>

            <tr class="row" v-for="tor in search" v-bind:key="tor._id" v-on:click="showDetailsModal(tor)">
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

<style lang="scss">
tr:nth-child(even) {
  background-color: #dddddd;
}
td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
  text-align: center;
}
table {
    border-collapse: collapse;
}
.tableColor {
    background-color: #ffe599;
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
}
input{
  font-size: 18px;
  margin: 20px;
  width: 80%;
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
</style>