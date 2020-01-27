<template>
    <div class="songListDetail">
        <div class="topBar" ref="topBar">
            <span class="backBtn" v-on:click="back"></span>
            <div class="songListSinger">
                <div class="bannerTitle">{{listBaseInfo.title}}</div>
            </div>
        </div>
        <div class="container" ref="container" v-on:scroll="scrollFunc">
            <div class="intoContainer" ref="intoContainer">
                <div class="bg" v-bind:style="`background-image: url(${listBaseInfo.coverImg});`"></div>
                <div class="cover" v-bind:style="`background-image: url(${listBaseInfo.coverImg});`">
                    <span class="playCount">{{computePlayCount(listBaseInfo.playCount)}}</span>
                </div>
                <h4 class="title">{{listBaseInfo.title}}</h4>
                <div class="author">
                    <span class="avatar" v-bind:style="`background-image: url(${listBaseInfo.avatar});`"></span>
                    <span class="name">{{listBaseInfo.author}}</span>
                    <p class="description">{{listBaseInfo.description}}</p>
                </div>
                <ul class="options">
                    <li class="optionItem">
                        <i class="icon"></i>
                        <span class="num">{{listBaseInfo.commentCount}}</span>
                    </li>
                    <li class="optionItem">
                        <i class="icon"></i>
                        <span class="num">{{listBaseInfo.shareCount}}</span>
                    </li>
                    <li class="optionItem">
                        <i class="icon"></i>
                        <span class="text">收藏</span>
                    </li>
                    <li class="optionItem">
                        <i class="icon"></i>
                        <span class="text">更多</span>
                    </li>
                </ul>
            </div>
            <ul class="songList" ref="songList" v-bind:style="`height: ${computeSongListMaxHeight()}px; overflow-y: ${flag ? 'auto' : 'hidden'};`">
                <li class="songItem" v-for="(item, index) in songList" v-bind:key="index">
                    <span class="rank">{{index + 1}}</span>
                    <div class="songInfo">
                        <p class="name">{{item.name}}</p>
                        <p class="singer">{{item.ar.map(song => song.name).join(',')}}&nbsp;-&nbsp;{{item.al.name}}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import commonRequest from '@/api/commonRequest.js'
export default {
    data: function () {
        return {
            msg: 'songListDetail',
            listBaseInfo: {
                playCount: 0,
                coverImg: '',
                title: '',
                author: '',
                avatar: '',
                description: '',
                commentCount: 0,
                shareCount: 0
            },
            songList: [],
            flag: false
        }
    },
    methods: {
        getSongListDetail: function () {
            let requestBody = {
                id: this.$route.query.id
            }
            this.$store.commit('setLoading', 1)
            commonRequest('/playlist/detail', requestBody).then(res => {
                this.$store.commit('setLoading', -1)
                if (res.status === 200) {
                    this.listBaseInfo.coverImg = res.data.playlist.coverImgUrl
                    this.listBaseInfo.playCount = res.data.playlist.playCount
                    this.listBaseInfo.title = res.data.playlist.name
                    this.listBaseInfo.author = res.data.playlist.creator.nickname
                    this.listBaseInfo.avatar = res.data.playlist.creator.avatarUrl
                    this.listBaseInfo.description = res.data.playlist.description
                    this.listBaseInfo.commentCount = res.data.playlist.commentCount
                    this.listBaseInfo.shareCount = res.data.playlist.shareCount
                    let ids = res.data.playlist.trackIds.map(item => {
                        return item.id
                    })
                    requestBody = {
                        ids: ids.join(',')
                    }
                    this.$store.commit('setLoading', 1)
                    commonRequest('/song/detail', requestBody).then(res => {
                        this.$store.commit('setLoading', -1)
                        if (res.status === 200) {
                            this.songList = res.data.songs
                        }
                    }).catch(error => {
                        this.$store.commit('setLoading', -1)
                        console.log(error)
                    })
                }
            }).catch(error => {
                this.$store.commit('setLoading', -1)
                console.log(error)
            })
        },
        computePlayCount: function (val) {
            if (val <= 9999) {
                return val
            } else if (val < 99999999) {
                return `${(val / 10000).toFixed(1)}万`
            } else if (val < 999999999999) {
                return `${(val / 100000000).toFixed(1)}亿`
            }
        },
        scrollFunc: function () {
            let height = parseInt(window.getComputedStyle(this.$refs.songList).height)
            height = window.innerHeight - height + this.$refs.container.scrollTop
            let topHeight = parseInt(window.getComputedStyle(this.$refs.intoContainer).height)
            this.flag = topHeight <= height
            let opacity = this.$refs.container.scrollTop / (topHeight - parseInt(window.getComputedStyle(this.$refs.topBar).height))
            this.$refs.topBar.style.opacity = opacity
        },
        computeSongListMaxHeight: function () {
            return window.innerHeight - window.innerWidth / 20 * (44 / (375 / 20))
        },
        back: function () {
            this.$router.back()
        }
    },
    mounted: function () {
        this.getSongListDetail()
    }
}
</script>
<style lang="stylus" scoped>
@import '~@/style/index.styl'
@keyframes flash {
    0% {
        transform: translate(100%, 0);
        opacity: 1;
    }
    98% {
        transform: translate(-100%, 0);
        opacity: 1;
    }
    99% {
        transform: translate(-100%, 0);
        opacity: 0;
    }
    100% {
        transform: translate(100%, 0);
        opacity: 0;
    }
}
.songListDetail {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    .topBar {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        height: rem(47 * 2);
        line-height: rem(44 * 2);
        background-color: #d44439;
        z-index: 1;
        opacity: 0;
        .backBtn {
            position: absolute;
            left: 0;
            top: 0;
            height: rem(44 * 2);
            width: rem(44 * 2);
            &:before {
                position: absolute;
                content: '';
                width: rem(15 * 2);
                height: rem(15 * 2);
                border-top: rem(1 * 2) solid white;
                border-left: rem(1 * 2) solid white;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
            }
        }
        .songListSinger {
            position: absolute;
            left: rem(80);
            right: 0;
            width: rem(750 - 80);
            top: 0;
            bottom: 0;
            height: rem(47 * 2);
            overflow: hidden;
            .bannerTitle {
                font-size: rem(18 * 2);
                height: rem(47 * 2);
                line-height: rem(47 * 2);
                min-width: rem(750 - 80);
                position: absolute;
                left: 0;
                top: 0;
                color: white;
                animation: flash 8s linear infinite;
            }
        }
    }
    .container {
        position: relative;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        .intoContainer {
            height: rem(254 * 2);
            overflow: hidden;
            position: relative;
            .bg {
                position: absolute;
                top: rem(-10 * 2);
                right: rem(-10 * 2);
                bottom: rem(-10 * 2);
                left: rem(-10 * 2);
                background-size: cover;
                background-position: 50% 50%;
                filter: blur(rem(20 * 2));
            }
            .cover {
                position: absolute;
                left: rem(18 * 2);
                top: rem(54 * 2);
                // width: rem(120);
                // height: rem(120);
                width: rem(140 * 2);
                height: rem(140 * 2);
                border-radius: rem(4 * 2);
                background-size: cover;
                background-position: 50% 50%;
                .playCount {
                    position: absolute;
                    right: rem(14 / 2 * 2);
                    top: rem(11 / 2 * 2);
                    font-size: rem(23 / 2 * 2);
                    color: #f1f1f1;
                    &:before {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translate(rem(-23 / 2 * 2), -50%);
                        width: rem(17 / 2 * 2);
                        height: rem(21 / 2 * 2);
                        background-size: 100% 100%;
                        background-image: url('~@/assets/img/play.png');
                    }
                }
            }
            .title {
                position: absolute;
                // left: rem(148);
                left: rem(352 / 2 * 2);
                right: rem(40 * 2);
                top: rem(54 * 2);
                height: rem(46 * 2);
                line-height: rem(23 * 2);
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 2;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                font-size: rem(18 * 2);
                color: white;
            }
            .author {
                position: absolute;
                // left: rem(148);
                left: rem(352 / 2 * 2);
                top: rem(116 * 2);
                font-size: 0;
                white-space: nowrap;
                .avatar {
                    height: rem(30 * 2);
                    width: rem(30 * 2);
                    background-size: cover;
                    background-position: 50% 50%;
                    display: inline-block;
                    vertical-align: middle;
                    border-radius: 50%;
                }
                .name {
                    display: inline-block;
                    line-height: rem(30 * 2);
                    vertical-align: middle;
                    margin-left: rem(6 * 2);
                    // max-width: rem(160);
                    max-width: rem(140 * 2);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    color: white;
                    font-size: rem(13 * 2);
                    font-weight: 200;
                }
                .description {
                    position: absolute;
                    // left: rem(352 / 2);
                    // right: rem(40);
                    width: rem(190 * 2);
                    font-size: rem(12 * 2);
                    width: author;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -webkit-line-clamp: 2;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    white-space: normal;
                    line-height: rem(20 * 2);
                    color: #a4a4a4;
                    margin-top: rem(10 * 2);
                }
            }
            .options {
                position: absolute;
                left: 0;
                right: 0;
                top: rem(204 * 2);
                font-size: 0;
                .optionItem {
                    text-align: center;
                    display: inline-block;
                    width: 25%;
                    &:nth-child(1) {
                        .icon {
                            background-image: url('~@/assets/img/message.png');
                        }
                    }
                    &:nth-child(2) {
                        .icon {
                            background-image: url('~@/assets/img/share.png');
                        }
                    }
                    &:nth-child(3) {
                        .icon {
                            background-image: url('~@/assets/img/plus.png');
                        }
                    }
                    &:nth-child(4) {
                        .icon {
                            background-image: url('~@/assets/img/more.png');
                        }
                    }
                    .icon {
                        display: inline-block;
                        width: rem(21 * 2);
                        height: rem(21 * 2);
                        background-size: 100% 100%;
                        // border: 1px solid white;
                    }
                    .num, .text {
                        display: block;
                        font-size: rem(24 / 2 * 2);
                        color: white;
                        margin-top: rem(15 / 2 * 2);
                    }
                }
            }
        }
        .songList {
            .songItem {
                height: rem(120 / 2 * 2);
                font-size: 0;
                .rank {
                    display: inline-block;
                    width: rem(84 / 2 * 2);
                    height: rem(120 / 2 * 2);
                    line-height: rem(120 / 2 * 2);
                    text-align: center;
                    vertical-align: middle;
                    font-size: rem(32 / 2 * 2);
                    color: #989898;
                    font-weight: 200;
                }
                .songInfo {
                    width: rem(666 / 2 * 2 - 40);
                    display: inline-block;
                    // border: 1px solid;
                    vertical-align: middle;
                    border-bottom: rem(1) solid rgba(0, 0, 0, 0.2);
                    padding-top: rem(9 * 2);
                    padding-bottom: rem(9 * 2);
                    overflow: hidden;
                    // margin-right: rem(20);
                    .name {
                        font-size: rem(32 / 2 * 2);
                        color: #333237;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        line-height: rem(25 / 2 * 2);
                        overflow: visible;
                    }
                    .singer {
                        font-size: rem(22 / 2 * 2);
                        color: #808080;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        line-height: rem(20 / 2 * 2);
                        margin-top: rem(21 / 2 * 2);
                        overflow: visible;
                    }
                }
            }
        }
    }
}
</style>
