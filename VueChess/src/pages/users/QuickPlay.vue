<template>
    <div class="main-container">
        <h1>Quick Play</h1>

        <div>
            <div class="btn">Random Player</div>
            <div class="btn" v-on:click="showModal">Invite Friend</div>
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
    name: 'quickPlay',
    components: {
        modal,
        errorModal
    },
    data () {
        return {
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
</style>