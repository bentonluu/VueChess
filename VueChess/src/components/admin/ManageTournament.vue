<template>
    <div class="modal-backdrop">
        <div class="modal">
            <section class="body">

                <div class="mainrow">
                    <div class="maincolumn">
                        <div class="row">
                            <div class="column">Name:</div>
                            <input type="text">
                        </div>

                        <div class="row">
                            <div class="column">Player Capacity:</div>
                            <input type="text" placeholder="Enter a number divisible by 2">
                        </div>

                        <div class="row">
                            <div class="column">Start Date & Time:</div>
                            <input type="text" placeholder="yyyy/mm/dd">
                        </div>

                        <div class="row">
                            <input type="text" placeholder="24hr time">
                            <select id="timezone">
                                <option value="MST">MST</option>
                            </select>
                        </div>
                    </div>
                    <div class="column">
                        <div class="row">
                            <div class="column">First 40 moves:</div>
                            <input type="text" placeholder="Default: 90">
                            <select id="time">
                                <option value="min">mins</option>
                                <option value="sec">secs</option>
                            </select>
                        </div>

                        <div class="row">
                            <div class="column">After 40 moves</div>
                            <input type="text" placeholder="Default: 30">
                            <select id="time">
                                <option value="min">mins</option>
                                <option value="sec">secs</option>
                            </select>                            
                        </div>

                        <div class="row">
                            <div class="column">Additional time per move</div>
                            <input type="text" placeholder="Default: 30">
                            <select id="time">
                                <option value="min">mins</option>
                                <option value="sec">secs</option>
                            </select>   
                        </div>

                        <div class="row">
                            <div class="column">Pause time</div>
                            <input type="text" placeholder="Default: 5">
                            <select id="time">
                                <option value="min">mins</option>
                                <option value="sec">secs</option>
                            </select>   
                        </div>
                    </div>
                </div>
            </section>

            <footer class="footer">
                <div class="btn" v-show="!create" v-on:click="createTournament">Update</div>
                <div class="btn" v-show="create" v-on:click="createTournament">Create</div>
                <div class="btn" v-on:click="close">Cancel</div>
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
            f40: 90,
            a40: 30,
            pm: 30,
            ps: 5
        }
    },
    methods: {
        close() {
            this.$emit('close');
        },
        createTournament() {
            
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