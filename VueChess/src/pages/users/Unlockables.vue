<template>
    <div class="main-container">
        <h1>Unlockables</h1>

        <img class="arrow" :src="leftArrow" alt="left arrow" v-on:click="toMainPage">
    </div>
</template>

<script>
    export default {
        name: 'unlockables',
        data() {
            return {
                leftArrow: require('../../assets/leftArrow.png')
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
    position: relative;
}
.arrow {
    position: absolute;
    top: 0;
    left: 0;
    margin-left: 5px;
    height: 50px;
    width: 50px;
    cursor: pointer;
}
</style>