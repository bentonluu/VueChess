<template>
    <div class="main-container">
        <h1>Leaderboards</h1>

        <div class="btn" v-on:click="toMainPage">Back</div>
    </div>
</template>

<script>
    export default {
        name: 'leaderboards',
        data() {
            return {

            }
        },
        methods: {
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
    width:50%;
    border-radius: 10px;
    background: white;
}
</style>