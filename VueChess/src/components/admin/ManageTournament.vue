<template>
    <div class="modal-backdrop">
        <div class="modal">
            <section class="body">

                <div class="mainrow">
                    <div class="maincolumn">
                        <div class="row">
                            <label>Name:</label>
                            <input v-model="name" type="text" required>
                        </div>

                        <div class="row">
                            <label>Player Capacity:</label>
                            <input v-model="playerCapacity" type="text" placeholder="Enter a number divisible by 2" required>
                        </div>

                        <div class="row">
                            <label>Start Date:</label>
                            <input v-model="startDate" type="text" placeholder="yyyy/mm/dd" required>
                        </div>

                        <div class="row">
                            <label>Start Time:</label>
                            <input v-model="startTime" type="text" placeholder="24hr time" required>
                        </div>
                    </div>
                </div>
            </section>

            <p class="error" v-if="errorDateFormat">Date does not match format.</p>
            <p class="error" v-if="errorTime">Time must be between 00:00 and 24:00.</p>
            <p class="error" v-if="errorFieldsEmpty">Please Fill out every field.</p>

            <footer class="footer">
                <div class="btn" v-on:click="close">Cancel</div>
                <div class="btn" v-show="!create" v-on:click="createTournament">Update</div>
                <div class="btn" v-show="create" v-on:click="createTournament">Create</div>
            </footer>
        </div>
    </div>
</template>

<script>
export default {
    name: 'manageTournament',
    props: ['tournamentInfo', 'create'],
    data() {
        return {
            isAdmin: true,
            errorFieldsEmpty: false,
            errorDateFormat: false,
            errorTime: false,
            name: '',
            playerCapacity: '',
            startDate: '',
            startTime: ''
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        createTournament() {
            var tournament = {
                name: this.name,
                playerCapacity: this.playerCapacity,
                startDate: this.startDate,
                startTime: this.startTime
            }
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
    align-items: center;
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
.error{
  color:red;
}
</style>