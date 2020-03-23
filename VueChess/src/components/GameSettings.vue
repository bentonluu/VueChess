<template>
  <div>
    <v-dialog class="modal-header"/>
    <input class="settingButton" type="image" src="./src/img/icons8-settings.svg" @click="show"/>
  </div>
</template>

<script>
  export default {
    name: 'GameSettings',
    data() {
      return {
      }
    },
    methods: {
      show () {
        this.$modal.show('dialog', {
          title: 'Settings',
          text: 'Game is paused',
          buttons: [
            {
              title: 'Leave Game',
              handler: () => { alert('Woot!') }
            },
            {
              title: 'Close'
            }
          ]
        })
      },
    }
  }
</script>

<style scoped>
  .settingButton {
    border: 4px solid coral;
    border-radius: 100px;
    padding: 3px;
    margin: 10px;
  }

  .modal-header {
    text-align: center;
  }


</style>
