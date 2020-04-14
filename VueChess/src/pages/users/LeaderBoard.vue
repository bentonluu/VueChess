<template>
    <div class="main-container">
        <h1>Chess Leader Board</h1>

        <table id="firstTable">
          <thead>
            <tr>
              <th>Username</th>
              <th>Win(s)</th>
              <th>Loss</th>
              <th>W/L Ratio</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in rows">
              <td>{{row.username}}</td>
              <td>{{row.wins}}</td>
              <td>{{row.losses}}</td>
              <td>{{row.wins/row.losses}}</td>
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

export default {
    name: 'leaderBoard',
    components: {
        modal,
        errorModal
    },
    data () {
        return {
            rows: [],
            isModalVisible: false,
            isErrorModalVisible: false,
            searchedUsername: "",
            winlossdata : [],
            userinfo: []
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
    },
    async created(){
      this.rows = await UsersDB.getUsers().then(function(x){
           x.sort((a, b) => (a.wins < b.wins) ? 1 : -1)
          return x;
      })
    }
}
</script>

<style lang="scss">
.main-container{
    display:flex;
    flex-direction: column;
    align-items: center;
    padding:20px;
    min-width: 100px;
    width:70%;
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
  margin: 0px 0px 0 0px;
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
