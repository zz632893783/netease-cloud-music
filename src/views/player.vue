<template>
    <div class="player" v-show="show">
        <div class="container"></div>
        <audio ref="audio" v-bind:src="musicUrl"></audio>
        <div class="preview">
            <div v-bind:class="`cover ${status}`" v-bind:style="`background-image: url(${(songList.find(item => item.id == activeSongId) || {}).coverUrl});`" v-on:click="setPlayerShowStatue(true)"></div>
            <div class="info" v-on:click="setPlayerShowStatue(true)">
                <p class="name">{{(songList.find(item => item.id == activeSongId) || {}).name}}</p>
                <p class="singer">{{((songList.find(item => item.id == activeSongId) || {}).artist || []).join('/')}}</p>
            </div>
            <span v-bind:class="`btn ${status}`" v-on:click="clickPlayerBtn">
                <canvas v-bind:width="canvasSize" v-bind:height="canvasSize" ref="progress"></canvas>
            </span>
            <div class="songList" v-on:click="setSongListShowState(true)"></div>
        </div>
        <div class="songContainer" ref="songContainer" v-bind:style="`pointer-events: ${showSongList ? 'auto' : 'none'};`" v-on:click="setSongListShowState(false)">
            <div class="songList" ref="songList" v-bind:style="computeSongListSize()" v-on:click.stop>
                <div class="controlBar">
                    <span class="btn">
                        <i></i>
                        <label>{{['顺序播放', '单曲循环', '随机播放'][mode]}}</label>
                    </span>
                    <span class="deleteBtn"></span>
                </div>
                <div class="songs">
                    <div class="item" v-for="(item, index) in songList" v-bind:key="index" v-on:click="getSongURL(item.id)">
                        <span class="play" v-show="activeSongId == item.id"></span>
                        <div class="song">
                            <span class="name">{{item.name}}</span>
                            <i></i>
                            <span class="artist">{{(item.artist || []).join('/')}}</span>
                        </div>
                        <span class="enjoyBtn"></span>
                        <span class="deleteBtn"></span>
                    </div>
                    <span class="empty" v-if="!songList.length">
                        还未添加任何歌曲
                    </span>
                </div>
            </div>
        </div>
        <div class="playerDetail" v-bind:style="computePlayerDetailSize()"></div>
    </div>
</template>
<script>
import commonRequest from '@/api/commonRequest.js'
export default {
    data: function () {
        return {
            msg: 'player',
            musicUrl: '',
            status: 'pause',
            loadFinish: false,
            // status: 'play',
            timer: null,
            duration: 0,
            canvasSize: 0,
            ctx: null,
            // coverUrl: '',
            // songName: '',
            // artist: '',
            show: true,
            showSongList: false,
            showPlayerDetail: false,
            // 0表示循环，1表示单曲循环，2表示随机
            mode: 0,
            activeSongId: '',
            songList: []
        }
    },
    methods: {
        setStatus: function (status) {
            this.status = status
        },
        addSong: function (song) {
            this.songList.unshift(song)
        },
        getSongURL: function (id) {
            let requestBody = {
                id
            }
            this.$store.commit('setLoading', 1)
            commonRequest('/song/url', requestBody).then(res => {
                this.$store.commit('setLoading', -1)
                if (res.status === 200) {
                    if (!res.data.data[0].url) {
                        return alert('正在争取这首歌的版权')
                    }
                    this.musicUrl = res.data.data[0].url
                    this.activeSongId = id
                }
            }).catch(error => {
                this.$store.commit('setLoading', -1)
                console.log(error)
            })
        },
        setLoadFinishStatus: function (status) {
            this.loadFinish = status
        },
        clickPlayerBtn: function () {
            if (!this.loadFinish) {
                return alert('请等待音乐加载完成')
            }
            // this.loadFinish = false
            if (this.status === 'pause') {
                this.status = 'play'
                this.$refs.audio.play()
            } else {
                this.status = 'pause'
                this.$refs.audio.pause()
            }
        },
        setTimer: function () {
            this.timer && (clearInterval(this.timer))
            this.timer = setInterval(() => {
                this.draw()
            }, 100)
        },
        loadFunc: function () {
            // console.log('loadFunc finish')
        },
        computeCanvasSize: function () {
            this.canvasSize = 64 * window.innerWidth / 750
        },
        draw: function () {
            this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize)
            this.ctx.lineWidth = 6 * window.innerWidth / 750
            this.ctx.beginPath()
            this.ctx.arc(this.canvasSize / 2, this.canvasSize / 2, this.canvasSize / 2 - this.ctx.lineWidth, 0, 2 * Math.PI)
            this.ctx.strokeStyle = '#d4a49d'
            this.ctx.stroke()
            this.ctx.closePath()
            this.ctx.beginPath()
            this.ctx.arc(this.canvasSize / 2, this.canvasSize / 2, this.canvasSize / 2 - this.ctx.lineWidth, 0 - Math.PI / 2, this.$refs.audio.currentTime / this.$refs.audio.duration * 2 * Math.PI - Math.PI / 2)
            this.ctx.strokeStyle = '#d44339'
            this.ctx.stroke()
            this.ctx.closePath()
        },
        getMusicDetail: function (id) {
            let requestBody = {
                ids: id
            }
            this.$store.commit('setLoading', 1)
            commonRequest('/song/detail', requestBody).then(res => {
                if (res.status === 200) {
                    this.$store.commit('setLoading', -1)
                    // if (!res.data.songs[0].url) {
                    //     return alert('正在争取这首歌的版权233')
                    // }
                    // this.coverUrl = res.data.songs[0].al.picUrl
                    // this.songName = res.data.songs[0].name
                    // this.artist = res.data.songs[0].ar.map(item => item.name).join(',')
                    let temp = this.songList.find(item => item.id === res.data.songs[0].id)
                    if (!temp) {
                        this.songList.push({
                            id: res.data.songs[0].id,
                            name: res.data.songs[0].name,
                            artist: res.data.songs[0].ar.map(item => item.name),
                            coverUrl: res.data.songs[0].al.picUrl
                        })
                    }
                }
            }).catch(error => {
                this.$store.commit('setLoading', -1)
                console.log(error)
            })
        },
        computeSongListSize: function () {
            let top = this.showSongList ? 440 * window.innerWidth / 750 : window.innerHeight
            return {
                top: `${top}px`
            }
        },
        setSongListShowState: function (val) {
            this.showSongList = val
            this.$refs.songContainer.style.backgroundColor = `rgba(0, 0, 0, ${val ? 0.3 : 0})`
        },
        setPlayerShowStatue: function (val) {
            // console.log('setPlayerShowStatue', val)
            this.showPlayerDetail = val
        },
        computePlayerDetailSize: function () {
            let top = this.showPlayerDetail ? 0 : window.innerHeight
            return {
                top: `${top}px`
            }
        }
    },
    mounted: function () {
        this.show = this.$route.path !== '/search'
        this.setTimer()
        this.computeCanvasSize()
        this.ctx = this.$refs.progress.getContext('2d')
        this.$refs.audio.addEventListener('canplay', () => {
            this.loadFinish = true
            this.status = 'pause'
            // this.activeSongId =
            this.clickPlayerBtn()
        })
    },
    beforeUpdate: function () {
        // this.timer && (clearInterval(this.timer))
    },
    beforeDestroy: function () {
        this.timer && (clearInterval(this.timer))
    },
    watch: {
        $route: function () {
            this.show = this.$route.path !== '/search'
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '~@/style/index.styl'
@keyframes flash {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}
.player {
    position: absolute;
    // height: rem(136);
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    pointer-events: none;
    z-index: 1;
    .preview {
        font-size: 0;
        position: absolute;
        left: 0;
        right: 0;
        // top: 0;
        bottom: 0;
        background-color: white;
        line-height: rem(136);
        height: rem(136);
        pointer-events: auto;
        box-shadow: 0 rem(-5) rem(15) rgba(0, 0, 0, 0.1);
        .cover {
            display: inline-block;
            width: rem(82);
            height: rem(82);
            border-radius: 50%;
            vertical-align: middle;
            margin-left: rem(36);
            margin-right: rem(20);
            background-size: cover;
            background-position: 50% 50%;
            animation: flash 10s linear infinite;
            &.pause {
                animation-play-state:paused;
            }
        }
        .info {
            display: inline-block;
            width: rem(420);
            vertical-align: middle;
            .name {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: rem(28);
                line-height: rem(28);
                margin-bottom: rem(20);
                color: #333237;
            }
            .singer {
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: rem(24);
                line-height: rem(24);
                color: #808080;
            }
        }
        .btn {
            position: absolute;
            width: rem(64);
            height: rem(64);
            // border: 1px solid;
            right: rem(120);
            bottom: rem(34);
            border-radius: 50%;
            &.pause {
                &:before {
                    position: absolute;
                    content: '';
                    left: 55%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    border-top: rem(10) solid transparent;
                    border-right: 0 solid;
                    border-bottom: rem(10) solid transparent;
                    border-left: rem(20) solid #d44339;
                }
            }
            &.play {
                &:before {
                    position: absolute;
                    content: '';
                    left: 35%;
                    top: 50%;
                    transform: translate(0, -50%);
                    width: rem(6);
                    height: rem(23);
                    background-color: #d44339;
                }
                &:after {
                    position: absolute;
                    content: '';
                    right: 35%;
                    top: 50%;
                    transform: translate(0, -50%);
                    width: rem(6);
                    height: rem(23);
                    background-color: #d44339;
                }
            }
            canvas {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }
        >.songList {
            position: absolute;
            width: rem(64);
            height: rem(64);
            right: rem(19);
            bottom: rem(34);
            background-image: url('~@/assets/img/list.png');
            background-size: 100% 100%;
        }
    }
    .songContainer {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        // background-color: rgba(0, 0, 0, 0.2);
        background-color: rgba(0, 0, 0, 0);
        // pointer-events: auto;
        transition: background-color 0.5s;
        overflow: hidden;
        .songList {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            // top: rem(440);
            // top: rem(440);
            background-color: white;
            border-top-left-radius: rem(14);
            border-top-right-radius: rem(14);
            transition: top 0.5s;
            .controlBar {
                display: block;
                width: 100%;
                height: rem(96);
                line-height: rem(96);
                position: relative;
                // border-bottom: rem(1) solid red;
                .btn {
                    i {
                        display: inline-block;
                        width: rem(30);
                        height: rem(30);
                        border: 1px solid;
                        margin-right: rem(22);
                        margin-left: rem(40);
                    }
                    label {
                        font-size: rem(28);
                        color: #2a2b26;
                    }
                }
                .deleteBtn {
                    position: absolute;
                    right: rem(82);
                    top: 50%;
                    transform: translate(0, -50%);
                    width: rem(25);
                    height: rem(29);
                    border: 1px solid;
                }
            }
            .songs {
                position: absolute;
                left: 0;
                right: 0;
                top: rem(96);
                bottom: 0;
                overflow-y: auto;
                .item {
                    position: relative;
                    height: rem(120);
                    line-height: rem(120);
                    .play {
                        // display: inline-block;
                        width: rem(24);
                        height: rem(24);
                        border-radius: 50%;
                        border: 1px solid;
                        position: absolute;
                        left: rem(36);
                        top: 50%;
                        transform: translate(0, -50%);
                        border: rem(2) solid #d44339;
                        &:before {
                            content: '';
                            position: absolute;
                            left: 50%;
                            top: 50%;
                            transform: translate(-50%, -50%);
                            border-top: rem(5) solid transparent;
                            border-right: 0 solid;
                            border-bottom: rem(5) solid transparent;
                            border-left: rem(8) solid #d44339;
                        }
                    }
                    .song {
                        font-size: 0;
                        margin-left: rem(76);
                        display: inline-block;
                        vertical-align: middle;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        width: rem(480);
                        .name, .artist {
                            font-size: rem(28);
                            display: inline-block;
                            vertical-align: middle;
                        }
                        i {
                            display: inline-block;
                            width: rem(8);
                            height: rem(3);
                            background-color: rgba(0, 0, 0, 0.5);
                            vertical-align: middle;
                            margin: 0 rem(10);
                        }
                    }
                    .enjoyBtn {
                        position: absolute;
                        width: rem(30);
                        height: rem(26);
                        right: rem(122);
                        top: 50%;
                        transform: translate(0, -50%);
                        border: 1px solid;
                    }
                    .deleteBtn {
                        position: absolute;
                        width: rem(25);
                        height: rem(29);
                        right: rem(62);
                        top: 50%;
                        transform: translate(0, -50%);
                        border: 1px solid;
                    }
                }
                .empty {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    white-space: nowrap;
                    font-size: rem(28);
                }
            }
        }
    }
    .playerDetail {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px solid blue;
        pointer-events: auto;
        transition: top 0.5s;
    }
}
</style>
