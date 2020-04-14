<template>
    <div class="modal-backdrop">
        <div class="modal">
            <section class="body">

                <div class="options">
                    <h1>{{tournamentInfo.name}}</h1>
                    <div class="test"> 
                        <div class="btn test2" v-on:click="editTournament" v-show="isAdmin" v-bind:style="{'pointer-events': 'none'}">Edit</div>
                        <div class="btn test2" v-bind:style="{'pointer-events': (this.deleteDisable || this.disable) ? 'none' : null}" v-on:click="deleteTournament" v-show="isAdmin">Delete</div>
                        <div v-bind:style="{'pointer-events': this.disable ? 'none' : null}" class="btn test2" v-on:click="joinTournament">Join</div>
                    </div>
                </div>

                <div class="creator">
                    <strong>Creator:</strong> test
                </div>

                <div class="mainrow">
                    <div class="maincolumn">
                        <div class="row">
                            <div class="column">Players</div>
                            <div class="column">{{tournamentInfo.maxPlayers}}</div>
                        </div>

                        <div class="row">
                            <div class="column">Start Date & Time</div>
                            <div class="column">{{tournamentInfo.startTime}}</div>
                        </div>
                    </div>
                </div>
            </section>

            <p class="success" v-if="tournamentDeleted">Tournament deleted</p>
            <p class="success" v-if="isJoinedTournamentVisible">Joined Tournament</p>

            <footer class="footer">
                <div class="btn closeButton" v-on:click="close">Close</div>
            </footer>
        </div>
    </div>
</template>

<script>
import TournamentsDB from './../TournamentsDB'
import io from 'socket.io-client';

export default {
    name: 'tournamentDetails',
    props: ['tournamentInfo', 'disable'],
    data() {
        return {
            isAdmin: false,
            tournamentDeleted: false,
            deleteDisable: false,
            isJoinedTournamentVisible: false,
            socket: io('http://localhost:3000')
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        editTournament() {
            this.$emit('edit');
        },
        deleteTournament() {
            this.deleteDisable = true;
            this.disable = true;
            TournamentsDB.deleteTournament(this.tournamentInfo.name)
            this.tournamentDeleted = true
        },
        joinTournament() {

            let sessionId = sessionStorage.getItem('sessionId');
            console.log("sess id: " + sessionId)
            this.socket.emit('beginTournament', 
                { tournamentID: this.tournamentInfo.name, sessionID: sessionId, maxPlayers: this.tournamentInfo.maxPlayers});

            // Sets the sessionID into browser storage
            this.socket.on("setTournament", function(data) {
                console.log("Tournament ID: " + data.tournamentID);
                sessionStorage.setItem('tournamentId', data.tournamentID);
            });

            this.disable = true;
            this.deleteDisable = true;
        }
    },
    created() {
        if (this.$cookies.get("user_type") === "Admin") {
            this.isAdmin = true
        } 
    },
    mounted() {

        this.socket.on("showJoined", () => {
            this.isJoinedTournamentVisible = true
        })

        this.socket.on("startTournamentGame", (data) => {
            console.log(data)
            let sessionId = sessionStorage.getItem('sessionId');
            if (data.sessionIDs.includes(sessionId)) {

                sessionStorage.setItem('playerColor', data.colors[data.sessionIDs.indexOf(sessionId)]);
                sessionStorage.setItem('maxPlayers', data.maxPlayers)
                sessionStorage.setItem('tournamentGamePlayers', JSON.stringify(data.sessionIDs))

                // Sets the gameRoomID into browser storage
                console.log("sessions for tourn game:" + data.sessionIds)
                if (data.sessionIDs.includes(sessionId)) {
                    let gameRoomID = sessionStorage.getItem('gameRoomID');
                    if (gameRoomID !== ('' || null)) {
                        sessionStorage.setItem('gameRoomID', '');
                    }
                    sessionStorage.setItem('gameRoomID', data.gameID);
                }

                this.socket.on('STARTGAME', (game) => {
                // Will only start a chess game if player is in the same game
                    let gameID = sessionStorage.getItem('gameRoomID');
                    if (gameID === game) {
                        this.$router.push('/chessgame').catch(err => {});
                    }
                });
            }
        })

    }
}
</script>

<style lang="scss" scoped>
.mainrow {
    display: flex;
    background-color: lightgray;
    border: 1px solid black;
}
.row {
    display: flex;
    background-color: lightgray;
    border-bottom: 1px solid black;
}
.column {
    flex: 1;
    padding: 20px;
}
.maincolumn {
    flex: 1;
    padding: 20px;
}
.options {
    display: block;
}
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
}
.body {
    position: relative;
    padding: 20px 10px;
}
.footer {
    display: block;
    flex-direction: row;
}
.creator {
    text-align: left;
}
.success {
  color: limegreen;
}
.test {
    display: flex;
    flex-direction: row;
}
.test2 {
    margin-right: 5px;
}
.closeButton {
    margin-left: 5px;
    margin-right: 5px;
}
</style>