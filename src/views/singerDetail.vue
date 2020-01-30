<template>
    <div class="singerDetail">
        <div class="topBar">
            <span class="backBtn" v-on:click="back"></span>
            <h4 class="sinterName">{{sinterName}}</h4>
        </div>
        <div class="container" ref="container" v-on:scroll="scrollFunc">
            <div class="sinterInfo" ref="sinterInfo">
                <div class="bg" v-bind:style="`background-image: url(${cover});`"></div>
                <span class="collectionBtn" ref="collectionBtn" v-on:click="collectionSinger">
                    <label></label>
                    <span>收&nbsp;藏</span>
                </span>
            </div>
            <div class="hotSongs" ref="hotSongs" v-bind:style="`height: ${computeMaxHeight()}px; overflow-y: ${flag ? 'auto' : 'hidden'};`">
                <div class="playAll">
                    <div class="btn"></div>
                    <span class="text">播放热门{{hotSongs.length}}</span>
                </div>
                <div class="item" v-for="(item, index) in hotSongs" v-bind:key="index" v-on:click="playMusic(item)">
                    <span class="num">{{index + 1}}</span>
                    <div class="song">
                        <span class="name">{{item.name}}</span>
                        <p class="desc">{{item.al.name}}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import commonRequest from '@/api/commonRequest.js'
export default {
    data: function () {
        return {
            sinterName: '',
            cover: '',
            hotSongs: [],
            flag: false
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
                    this.sinterName = res.data.artist.name
                    // console.log('success', res)
                }
            }).catch(error => {
                this.$store.commit('setLoading', -1)
                console.log(error)
            })
        },
        computeMaxHeight: function () {
            return window.innerHeight - 86 * window.innerWidth / 750
        },
        scrollFunc: function () {
            this.flag = this.$refs.container.scrollTop + window.innerHeight >= this.$refs.sinterInfo.offsetHeight + this.$refs.hotSongs.offsetHeight
            let temp = this.$refs.sinterInfo.offsetHeight / 2
            temp = (temp - this.$refs.container.scrollTop) / temp
            temp = temp < 0 ? 0 : temp
            this.$refs.collectionBtn.style.opacity = temp
        },
        back: function () {
            this.$router.back()
        },
        playMusic: function (obj) {
            this.$parent.$refs.player.getMusicDetail(obj.id)
            this.$parent.$refs.player.getSongURL(obj.id)
        },
        collectionSinger: function () {
            return alert('收藏功能尚在开发中')
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
    overflow: hidden;
    .topBar {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: rem(86);
        // border: 1px solid;
        z-index: 1;
        // background-color: rgba(255, 0, 0, 0.4);
        .backBtn {
            position: absolute;
            width: rem(86);
            height: rem(86);
            left: 0;
            top: 0;
            // border: 1px solid;
            &:before {
                content: '';
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                width: rem(30 - 4);
                height: rem(30 - 4);
                border-top: rem(3) solid white;
                border-left: rem(3) solid white;
            }
        }
        .sinterName {
            position: absolute;
            left: rem(86);
            right: rem(0);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            // text-align: center;
            line-height: rem(86);
            color: white;
            font-size: rem(36);
            font-weight: 200;
        }
    }
    .container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        .sinterInfo {
            height: rem(575);
            // border: 1px solid;
            position: relative;
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
            .collectionBtn {
                position: absolute;
                left: 50%;
                bottom: rem(20);
                width: rem(240);
                height: rem(80);
                line-height: rem(80);
                font-size: 0;
                border-radius: rem(40);
                background-color: #d44439;
                text-align: center;
                transform: translate(-50%, 0);
                label {
                    display: inline-block;
                    position: relative;
                    width: rem(24);
                    height: rem(24);
                    line-height: rem(80);
                    vertical-align: middle;
                    margin-right: rem(18);
                    &:before, &:after {
                        content: '';
                        position: absolute;
                        left: 50%;
                        top: 50%;
                        background-color: white;
                        width: rem(3);
                        height: 100%;
                        transform: translate(-50%, -50%);
                    }
                    &:after {
                        transform: translate(-50%, -50%) rotate(90deg);
                    }
                }
                span {
                    display: inline-block;
                    font-size: rem(28);
                    color: white;
                    vertical-align: middle;
                }
            }
        }
        .hotSongs {
            position: absolute;
            top: rem(575);
            right: 0;
            bottom: 0;
            left: 0;
            // border: 1px solid green;
            .playAll {
                display: block;
                height: rem(108);
                // border: 1px solid;
                font-size: 0;
                line-height: rem(108);
                border-top-left-radius: rem(36);
                border-top-right-radius: rem(36);
                background-color: white;
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
            .item {
                display: block;
                height: rem(120);
                font-size: 0;
                background-color: white;
                .num {
                    display: inline-block;
                    width: rem(84);
                    text-align: center;
                    font-size: rem(32);
                    color: #8b8b8b;
                    line-height: rem(120);
                    vertical-align: middle;
                }
                .song {
                    display: inline-block;
                    height: rem(120);
                    width: rem(750 - 84 - 20);
                    vertical-align: middle;
                    .name {
                        font-size: rem(34);
                        display: block;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #191919;
                        padding-top: rem(25);
                        padding-bottom: rem(16);
                        line-height: rem(32);
                    }
                    .desc {
                        font-size: rem(24);
                        display: block;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #6e6c6d;
                        line-height: normal;
                        line-height: rem(24);
                    }
                }
            }
        }
    }
}
</style>
