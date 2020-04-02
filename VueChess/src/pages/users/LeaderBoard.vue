<template>
    <div class="main-container">
        <h1>Chess Leader Board</h1>

        <div>
            <b-table striped hover :items="items"></b-table>
        </div>

        <modal v-show="isModalVisible" @close="hideModal" @submit="submit"></modal>
        <errorModal v-show="isErrorModalVisible" @close="hideErrorModal"></errorModal>

        {{searchedUsername}}
    </div>
</template>

<script>
import modal from '../../components/users/modal'
import errorModal from '../../components/users/errorModal'

export default {
    name: 'leaderBoard',
    components: {
        modal,
        errorModal
    },
    data () {
        return {
            isModalVisible: false,
            isErrorModalVisible: false,
            searchedUsername: "",
            items: [
          { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
          { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
          { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
          { age: 38, first_name: 'Jami', last_name: 'Carney' }
        ]
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
</style>
