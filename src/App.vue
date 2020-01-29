<template>
    <div id="app">
        <router-view/>
        <transition>
            <div class="loading" v-show="$store.state.isLoading > 0">
                <span></span>
                <span></span>
            </div>
        </transition>
        <div class="playerContainer">
            <player></player>
        </div>
    </div>
</template>
<script>
// import commonRequest from '@/api/commonRequest.js'
// import { setCookie } from '@/tools/cookie.js'
import player from '@/views/player.vue'
export default {
    components: {
        player
    },
    data: function () {
        return {}
    },
    mounted: function () {
        this.setRem()
        // this.testRequest()
        // this.$store.commit('setLoading', 23333)
    },
    methods: {
        setRem: function () {
            document.documentElement.style.fontSize = `${window.innerWidth / 20}px`
        }
        // testRequest: function () {
        //     let requestBody = {
        //         phone: '18367806291',
        //         password: '123qweasdzxc'
        //     }
        //     commonRequest('/login/cellphone', requestBody).then(res => {
        //         if (res.status === 200) {
        //             setCookie('token', res.data.token)
        //             setCookie('userId', res.data.userId)
        //             setCookie('nickname', res.data.nickname)
        //         }
        //     }).catch(error => {
        //         console.log(error)
        //     })
        // }
    }
}
</script>
<style lang="stylus">
@import '~@/style/index.styl'
@keyframes flash01 {
    0% {
        width: rem(80);
        height: rem(80);
        opacity: 0;
    }
    50% {
        width: rem(0);
        height: rem(0);
        opacity: 1;
    }
    100% {
        width: rem(80);
        height: rem(80);
        opacity: 0;
    }
}
@keyframes flash02 {
    0% {
        width: rem(0);
        height: rem(0);
        opacity: 1;
    }
    50% {
        width: rem(80);
        height: rem(80);
        opacity: 0;
    }
    100% {
        width: rem(0);
        height: rem(0);
        opacity: 1;
    }
}
html, body {
    position: relative;
    width: 100%;
    height: 100%;
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
    position: relative;
    .loading {
        position: absolute;
        z-index: 1;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, 0.2);
        span {
            position: absolute;
            left: 50%;
            top: 50%;
            background-color: #dc2c1f;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            &:nth-child(1) {
                width: rem(80);
                height: rem(80);
                opacity: 1;
                animation: flash01 linear 2s infinite;
            }
            &:nth-child(2) {
                width: rem(0);
                height: rem(0);
                opacity: 0;
                animation: flash02 linear 2s infinite;
            }
        }
    }
    .playerContainer {
        position: absolute;
        height: rem(136);
        left: 0;
        bottom: 0;
        right: 0;
        box-shadow: 0 rem(-5) rem(15) rgba(0, 0, 0, 0.1);
    }
}
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    color: #2c3e50;
}
</style>
