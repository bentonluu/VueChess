<template>
    <div class="main-container">
        <h1>Quick Play</h1>

        <div>
            <div class="btn" v-on:click="showWaitModal">Random Player</div>
            <div class="btn" v-on:click="showModal">Invite Friend</div>
        </div>

        <modal :randomJoinCode="randomJoinCode" v-show="isModalVisible" @close="hideModal" @submit="submit"></modal>
        <errorModal v-show="isErrorModalVisible" @close="hideErrorModal"></errorModal>
        <waitModal v-show="isWaitModalVisible" @close="hideWaitModal"></waitModal>
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
            searchedUsername: '',
            socket: io('http://localhost:3000'),
            randomJoinCode: '',
        }
    },
    created() {
        this.randomJoinCode = this.generateRandomCode();
    },
    methods: {
        showModal() {
          this.isModalVisible = true;

          // Creates new game room
          let username = this.$cookies.get('username');
          this.socket.emit('NEWGAME', { gameType: 'inviteGame', user: username, joinCode: this.randomJoinCode });

          sessionStorage.setItem('gameRoomID', this.randomJoinCode);

          this.socket.on('PLAYERCOLOR', (color) => {
            sessionStorage.setItem('playerColor', color);
          });

          this.socket.on('STARTGAME', (game) => {
            // Will only start a chess game if player is in the same game
            let gameID = sessionStorage.getItem('gameRoomID');
            if (gameID === game) {
              this.$router.push('/chessgame').catch(err => {});
            }
          });
        },
        hideModal() {
            this.isModalVisible = false;

          sessionStorage.setItem('playerColor', '');
          // Removes the currently pending random game from the queue
          this.socket.emit('LEAVEQUEUE', sessionStorage.getItem('gameRoomID'));
        },
        showWaitModal() {
            this.isWaitModalVisible = true;

            // Creates new game room
            let username = this.$cookies.get('username');
            this.socket.emit('NEWGAME', { gameType: 'randomGame', user: username });

            // Sets the gameRoomID into browser storage
            this.socket.on('setGameSession', (data) => {
              let gameRoomID = sessionStorage.getItem('gameRoomID');
              if (gameRoomID !== ('' || null)) {
                sessionStorage.setItem('gameRoomID', '');
              }
              sessionStorage.setItem('gameRoomID', data.gameID);
            });

            // Sets the playerColor for the game into browser storage
            this.socket.on('PLAYERCOLOR', (color) => {
              let playerColor = sessionStorage.getItem('playerColor');
              if (playerColor !== ('' || null)) {
                sessionStorage.setItem('playerColor', '');
              }
              sessionStorage.setItem('playerColor', color);
            });

            this.socket.on('STARTGAME', (game) => {
              // Will only start a chess game if player is in the same game
              let gameID = sessionStorage.getItem('gameRoomID');
              if (gameID === game) {
                this.$router.push('/chessgame').catch(err => {});
              }
            });
        },
        hideWaitModal() {
          this.isWaitModalVisible = false;
          sessionStorage.setItem('playerColor', '');
          // Removes the currently pending random game from the queue
          this.socket.emit('LEAVEQUEUE', sessionStorage.getItem('gameRoomID'));
        },
        showErrorModal() {
            this.isErrorModalVisible = true;
        },
        hideErrorModal() {
            this.isErrorModalVisible = false;
        },
        submit(joinCode) {
            console.log(joinCode);

            sessionStorage.setItem('gameRoomID', joinCode);
            let username = this.$cookies.get('username');
            this.socket.emit('JOINGAME', { code: joinCode, user: username });

            this.socket.on('PLAYERCOLOR', (color) => {
              sessionStorage.setItem('playerColor', color);
            });

            //this.isModalVisible = false;
        },
        generateRandomCode() {
          let code = '';
          let randomString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '0123456789' + 'abcdefghijklmnopqrstuvxyz';

          for (let i = 0; i < 10; i++) {
            let index = (randomString.length * Math.random());
            code = code + randomString.charAt(index);
          }
          console.log(code);
          return code;
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
