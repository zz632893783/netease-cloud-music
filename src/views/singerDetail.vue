<template>
    <div class="singerDetail">
        <div class="sinterInfo">
            <div class="topBar"></div>
            <div class="bg" v-bind:style="`background-image: url(${cover});`"></div>
        </div>
        <div class="hotSongs">
            <div class="playAll">
                <div class="btn"></div>
                <span class="text">播放热门{{hotSongs.length}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import commonRequest from '@/api/commonRequest.js'
export default {
    data: function () {
        return {
            msg: 'singerDetail',
            cover: '',
            hotSongs: []
        }
    },
    methods: {
        querySingerDetail: function () {
            let requestBody = {
                id: this.$route.query.id
            }
            this.$store.commit('setLoading', 1)
            commonRequest('/artists', requestBody).then(res => {
                if (res.status === 200) {
                    this.$store.commit('setLoading', -1)
                    this.cover = res.data.artist.picUrl
                    this.hotSongs = res.data.hotSongs
                    // console.log('success', res)
                }
            }).catch(error => {
                this.$store.commit('setLoading', -1)
                console.log(error)
            })
        }
    },
    mounted: function () {
        this.querySingerDetail()
    }
}
</script>
<style lang="stylus" scoped>
@import '~@/style/index.styl'
.singerDetail {
    position: relative;
    width: 100%;
    height: 100%;
    .sinterInfo {
        height: rem(575);
        // border: 1px solid;
        position: relative;
        .topBar {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            height: rem(86);
            // border: 1px solid;
            z-index: 1;
            background-color: rgba(255, 0, 0, 0.4);
        }
        .bg {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: rem(-36);
            // height: rem(575 + 36);
            // border: 1px solid red;
            background-size: cover;
            background-position: 50% 50%;
        }
    }
    .hotSongs {
        position: absolute;
        top: rem(575);
        right: 0;
        bottom: 0;
        left: 0;
        // border: 1px solid green;
        border-top-left-radius: rem(36);
        border-top-right-radius: rem(36);
        background-color: white;
        .playAll {
            display: block;
            height: rem(108);
            // border: 1px solid;
            font-size: 0;
            line-height: rem(108);
            .btn {
                display: inline-block;
                margin-left: rem(26);
                width: rem(40);
                height: rem(40);
                border: rem(2.5) solid #222222;
                border-radius: 50%;
                vertical-align: middle;
                position: relative;
                margin-right: rem(21);
                &:before {
                    content: '';
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    width: 0;
                    height: 0;
                    border-top: rem(7) solid transparent;
                    border-right: 0 solid;
                    border-bottom: rem(7) solid transparent;
                    border-left: rem(13) solid #222222;
                }
            }
            .text {
                font-size: rem(36);
                display: inline-block;
                white-space: nowrap;
                color: #222222;
                vertical-align: middle;
            }
        }
    }
}
</style>
