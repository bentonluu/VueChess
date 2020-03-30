<template>
    <div class="main-container">
        <h1>Quick Play</h1>

        <div class="btn" v-on:click="toMainPage">Back</div>

        <div>
            <div class="btn" v-on:click="showWaitModal">Random Player</div>
            <div class="btn" v-on:click="showModal">Invite Friend</div>
        </div>

        <modal v-show="isModalVisible" @close="hideModal" @submit="submit"></modal>
        <errorModal v-show="isErrorModalVisible" @close="hideErrorModal"></errorModal>
        <waitModal v-show="isWaitModalVisible" @close="hideWaitModal"></waitModal>

        {{searchedUsername}}
    </div>
</template>

<script>
import modal from '../../components/users/modal'
import errorModal from '../../components/users/errorModal'
import waitModal from '../../components/users/waitModal'
import io from 'socket.io-client';

export default {
    name: 'quickPlay',
    components: {
        modal,
        errorModal,
        waitModal,
    },
    data () {
        return {
            isModalVisible: false,
            isErrorModalVisible: false,
            isWaitModalVisible: false,
            searchedUsername: "",
            socket: io('http://localhost:3000'),
        }
    },
    created() {
    },
    methods: {
        showModal() {
            this.isModalVisible = true;
        },
        hideModal(un) {
            this.isModalVisible = false;
        },
        showWaitModal() {
            this.isWaitModalVisible = true;

            // Creates new game room
            this.socket.emit('NEWGAME', "randomGame");

            // Sets the gameRoomID into browser storage
            this.socket.on('setGameSession', (data) => {
              sessionStorage.setItem('gameRoomID', data.gameID);
            });

            // Sets the playerColor for the game into browser storage
            this.socket.on('PLAYERCOLOR', (color) => {
              sessionStorage.setItem('playerColor', color);
            });

            this.socket.on('STARTGAME', () => {
              this.$router.replace('/chessgame');
            });
        },
        hideWaitModal() {
          this.isWaitModalVisible = false;

          // Removes the currently pending random game from the queue
          this.socket.emit('LEAVEQUEUE', '');
        },
        showErrorModal() {
            this.isErrorModalVisible = true;
        },
        hideErrorModal() {
            this.isErrorModalVisible = false;
        },
        submit(un) {
            this.searchedUsername = un;
            this.isModalVisible = false;
        },
        toMainPage() {
            this.$router.replace('/')
        }
    }
}
</script>

<style lang="scss">
.main-container{
    display:flex;
    flex-direction: column;
    align-items: center;
    padding:20px;
    min-width: 300px;
    width:30%;
    border-radius: 10px;
    background: white;
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
