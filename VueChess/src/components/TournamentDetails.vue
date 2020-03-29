<template>
    <div class="modal-backdrop">
        <div class="modal">
            <section class="body">

                <div class="options">
                    <h1>{{tournamentInfo.name}}</h1>
                    <div class="btn" v-on:click="editTournament" v-show="isAdmin">Edit</div>
                    <div class="btn" v-on:click="deleteTournament" v-show="isAdmin">Delete</div>
                    <div class="btn" v-on:click="joinTournament" >Join</div>
                </div>

                <div><strong>Creator:</strong> test</div>

                <div class="mainrow">
                    <div class="maincolumn">
                        <div class="row">
                            <div class="column">Players</div>
                            <div class="column">{{tournamentInfo.players}}</div>
                        </div>

                        <div class="row">
                            <div class="column">Start Date & Time</div>
                            <div class="column">{{tournamentInfo.timeDateInfo}}</div>
                        </div>
                    </div>
                    <div class="column">
                        <div class="row">
                            <div class="column">First 40 moves</div>
                            <div class="column">{{tournamentInfo.timeRules.f40}} mins (def)</div>
                        </div>

                        <div class="row">
                            <div class="column">After 40 moves</div>
                            <div class="column">{{tournamentInfo.timeRules.a40}} min (def)</div>
                        </div>

                        <div class="row">
                            <div class="column">Additional time per move</div>
                            <div class="column">{{tournamentInfo.timeRules.pm}} secs (def)</div>
                        </div>

                        <div class="row">
                            <div class="column">Pause time</div>
                            <div class="column">{{tournamentInfo.timeRules.ps}} mins (def)</div>
                        </div>
                    </div>
                </div>
            </section>

            <footer class="footer">
                <div class="btn" v-on:click="close">Close</div>
            </footer>
        </div>
    </div>
</template>

<script>

export default {
    name: 'tournamentDetails',
    props: ['tournamentInfo'],
    data() {
        return {
            isAdmin: false
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

        },
        joinTournament() {

        }
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
    border-right: 1px solid black;
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
</style>