<template>
    <div class="main-container">
        <h1>Chess Leader Board</h1>

        <table id="firstTable">
          <thead>
            <tr>
              <th>Username</th>
              <th>Win(s)</th>
              <th>Loss</th>
              <th>Draw(s)</th>
              <th>W/L Ratio</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows">
              <td>{{row.username}}</td>
              <td>{{row.win}}</td>
              <td>{{row.loss}}</td>
              <td>{{row.draw}}</td>
              <td>{{row.ratio}}</td>
            </tr>
          </tbody>
        </table>

        <modal v-show="isModalVisible" @close="hideModal" @submit="submit"></modal>
        <errorModal v-show="isErrorModalVisible" @close="hideErrorModal"></errorModal>

        {{searchedUsername}}
    </div>
</template>

<script>
import modal from '../../components/users/modal'
import errorModal from '../../components/users/errorModal'
import UsersDB from '../../UsersDB'
var winlossdata =""
async function main() {
  let userInfo = await UsersDB.getUsers();
  userInfo.sort((a, b) => (a.wins < b.wins) ? 1 : -1)

  winlossdata = "["
  var i;
  for (i = 0; i < userInfo.length; i++) {
    if (i==0){
      winlossdata += "{ username: '" + userInfo[i].username + "', win:" + " '"+ userInfo[i].wins + "', loss: '" + userInfo[i].losses + "'" + "loss: '1', draw: '0', ratio:'0'"+ "} "
    }
    else  {
      winlossdata += ", { username: '" + userInfo[i].username + "', win:" + " '"+ userInfo[i].wins + "', loss: '" + userInfo[i].losses + "'" + "loss: '1', draw: '0', ratio:'0'" +"} "
    }
  }
  console.log(winlossdata)
}

main();
export default {
    name: 'leaderBoard',
    components: {
        modal,
        errorModal

    },
    data () {
        return {
        rows: [
          { username: 'username2', win: "1000", loss: '1', draw: '0',  ratio:'0' },
          { username: 'username3', win: "1000", loss: '1', draw: '0', ratio:'0'},
          { username: 'username4', win: "1000", loss: '1', draw: '0', ratio:'0' },
          { username: 'username5', win: "1000", loss: '1', draw: '0', ratio:'0' },
          { username: 'username6', win: "1000", loss: '1', draw: '0', ratio:'0' }
        ],
            isModalVisible: false,
            isErrorModalVisible: false,
            searchedUsername: ""
        }
    },
    methods: {

        showModal() {
            this.isModalVisible = true;
        },
        hideModal(un) {
            this.isModalVisible = false;
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
    width:50%;
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
table {
  font-family: 'Open Sans', sans-serif;
  width: 750px;
  border-collapse: collapse;
  border: 3px solid #44475C;
  margin: 10px 10px 0 10px;
}

table th {
  text-transform: uppercase;
  text-align: left;
  background: #44475C;
  color: #FFF;
  padding: 8px;
  min-width: 30px;
}

table td {
  text-align: left;
  padding: 8px;
  border-right: 2px solid #7D82A8;
}
table td:last-child {
  border-right: none;
}
table tbody tr:nth-child(2n) td {
  background: #D4D8F9;
}
</style>
