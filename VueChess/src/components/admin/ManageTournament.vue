<template>
    <div class="modal-backdrop">
        <div class="modal">
            <section class="body">
                <h1 class="title" v-show="create">Create Tournament</h1>
                <h1 class="title" v-show="!create">Edit Tournament</h1>
                <div class="mainrow">
                    <div class="maincolumn">
                        <div class="row">
                            <label>Name:</label>
                            <input v-model="name" type="text" required>
                        </div>

                        <div class="row">
                            <label>Player Capacity:</label>
                            <input v-model="maxPlayers" type="text" placeholder="Number divisible by 2" required>
                        </div>

                        <div class="row">
                            <label>Start Date:</label>
                            <input v-model="startDate" type="text" placeholder="yyyy-mm-dd" required>
                        </div>

                        <div class="row">
                            <label>Start Time:</label>
                            <input v-model="startTime" type="text" placeholder="24hr time" required>
                        </div>
                    </div>
                </div>
            </section>

            <p class="signUp" v-if="created">Tournament created!</p>
            <p class="error" v-if="errorDateFormat">Date does not match format.</p>
            <p class="error" v-if="errorTime">Time must be between 00:00 and 24:00.</p>
            <p class="error" v-if="errorFieldsEmpty">Please fill out every field.</p>
            <p class="error" v-if="errorDuplicate">Tournament already exists.</p>
            <p class="error" v-if="errorPlayerCount">Number of players must be an even number.</p>

            <footer class="footer">
                <div class="btn buttonSpacing" v-show="create" v-on:click="createTournament">Create</div>
                <div class="btn buttonSpacing" v-show="!create" v-on:click="createTournament">Update</div>
                <div class="btn buttonSpacing" v-on:click="close">Close</div>

            </footer>
        </div>
    </div>
</template>

<script>
import TournamentsDB from '../../TournamentsDB'

export default {
    name: 'manageTournament',
    props: ['tournamentInfo', 'create'],
    data() {
        return {
            isAdmin: true,
            errorFieldsEmpty: false,
            errorDateFormat: false,
            errorDuplicate: false,
            errorTime: false,
            errorPlayerCount: false,
            created: false,
            name: '',
            maxPlayers: '',
            startDate: '',
            startTime: ''
        }
    },
    methods: {
        close() {
            this.name = '';
            this.maxPlayers = '';
            this.startDate = '';
            this.startTime = '';
            this.created = false
            this.errorTime = false
            this.errorFieldsEmpty = false
            this.errorDateFormat = false
            this.errorDuplicate = false
            this.$emit('close');
        },
        createTournament() {
            if (!this.startDate.match(/([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)) {
                this.errorDateFormat = true
                return
            }

            if (!this.startTime.match(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)) {
                this.errorTime = true
                return
            }

            if (this.maxPlayers % 2 !== 0) {
                this.errorPlayerCount = true
                return
            }

            var timeDateString = this.startDate + 'T' + this.startTime + 'Z'

            var startTime = new Date(timeDateString)

            var tournament = {
                name: this.name,
                maxPlayers: this.maxPlayers,
                startTime: startTime
            }
            console.log(tournament)

            TournamentsDB.insertTournament(tournament).then(res => {
                if (res == "Tournament Created") {
                    this.created = true
                    this.errorTime = false
                    this.errorFieldsEmpty = false
                    this.errorDateFormat = false
                    this.errorDuplicate = false
                    this.errorPlayerCount = false
                }
                else if (res == "Tournament Exists") {
                    this.errorDuplicate = true
                    this.created = false
                    this.errorTime = false
                    this.errorFieldsEmpty = false
                    this.errorDateFormat = false
                    this.errorPlayerCount = false
                }
                else if (res == "Incomplete Fields") {
                    this.errorFieldsEmpty = true
                    this.created = false
                    this.errorTime = false
                    this.errorDateFormat = false
                    this.errorDuplicate = false
                    this.errorPlayerCount = false
                }
            })

            this.name = ''
            this.maxPlayers = ''
            this.startDate = ''
            this.startTime = ''
        }
    }
}
</script>

<style lang="scss" scoped>
.mainrow {
    display: flex;
    background-color: lightgray;
    border: 2px solid black;
    border-radius: 10px;
}
.row {
    display: flex;
    background-color: lightgray;
    border-bottom: 1px solid black;
    align-items: center;
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
    display: flex;
    flex-direction: row;
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
    display: flex;
    flex-direction: row;
}
.error{
  color:red;
}
.signUp {
  color: limegreen;
}
.buttonSpacing {
    margin-right: 5px;
    margin-left: 5px;
}
input{
  font-size: 18px;
  margin: 20px;
  width: 90%;
  display: block;
  border: none;
  padding: 10px;
  border-bottom: solid 2px grey;
  transition:ease-in 0.2s all;
  &:focus{
    outline: none;
    border-color: coral;
  }
}
label {
  font-weight: bold;
}
.btn{
  border:2px solid lightgray;
  padding:15px 55px;
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
</style>
