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
                <th>Time Rules (f40:a40:pm:ps)</th>
            </tr>

            <tr class="row" v-for="tor in search" v-bind:key="tor.name" v-on:click="showDetailsModal(tor)">
                <td>{{tor.name}}</td>
                <td>{{tor.players}}</td>
                <td>{{tor.timeDateInfo}}</td>
                <td>{{tor.timeRules.f40}}:{{tor.timeRules.a40}}:{{tor.timeRules.pm}}:{{tor.timeRules.ps}}</td>
            </tr>

            <caption class="tableColor" align="bottom">
                <span>Time Rules Legend:</span>
                <span><strong>f40</strong> - first 40 moves  <strong>a40</strong> - after 40 moves    <strong>pm</strong> - additional    <strong>ps</strong> - pause time</span>
            </caption>
        </table>

        <tournamentDetails :tournamentInfo="tournament" v-show="isTournamentDetailsVisible" @close="hideDetailsModal" @edit="editTournament"></tournamentDetails>
        <manageTournament :create="createNew" v-show="isTournamentManagerVisible" @close="hideTournamentManager"></manageTournament>

    </div>
</template>

<script>
    import tournamentDetails from '../../components/TournamentDetails'
    import manageTournament from '../../components/admin/ManageTournament'


    export default {
        name: 'userTournament',
        components: {
            tournamentDetails,
            manageTournament
        },
        data() {
            return {
                isAdmin: true,
                isTournamentDetailsVisible: false,
                isTournamentManagerVisible: false,
                createNew: null,
                tournament: {},
                searchReq: null,
                tournaments:[
                    {
                        name: "test",
                        players: "1/2",
                        timeDateInfo: "12:00",
                        timeRules: {
                            f40: "1",
                            a40: "2",
                            pm: "3",
                            ps: "4"
                        }
                    },
                                        {
                        name: "boi2",
                        players: "1/2",
                        timeDateInfo: "12:00",
                        timeRules: {
                            f40: "5",
                            a40: "6",
                            pm: "7",
                            ps: "8"
                        }
                    }
                ]
            }
        },
        methods: {
            toMainPage() {
                this.$router.replace('/')
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
            },
            showDetailsModal(tournament) {
                this.isTournamentDetailsVisible = true
                this.tournament = tournament
            },
            hideDetailsModal() {
                this.isTournamentDetailsVisible = false
            }
        },
        computed: {
            search () {
                if (this.searchReq) {
                    return this.tournaments.filter(item => {
                        return this.searchReq.startsWith(item.name)
                    })
                } else {
                    return this.tournaments
                }
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