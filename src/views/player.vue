<template>
    <div class="player">
        <!-- <audio ref="audio" v-bind:src="musicUrl" v-on:load="loadMusic"></audio> -->
        <audio ref="audio" v-bind:src="musicUrl"></audio>
        <div class="preview">
            <div v-bind:class="`cover ${status}`" v-bind:style="`background-image: url(${coverUrl});`"></div>
            <div class="info">
                <p class="name">富士山下</p>
                <p class="singer">陈奕迅</p>
            </div>
            <span v-bind:class="`btn ${status}`" v-on:click="clickPlayerBtn">
                <canvas v-bind:width="canvasSize" v-bind:height="canvasSize" ref="progress"></canvas>
            </span>
            <span class="songList"></span>
        </div>
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
            // status: 'play',
            timer: null,
            duration: 0,
            canvasSize: 0,
            ctx: null,
            coverUrl: ''
        }
    },
    methods: {
        getSongURL: function (id) {
            let requestBody = {
                id
            }
            this.$store.commit('setLoading', 1)
            commonRequest('/song/url', requestBody).then(res => {
                if (res.status === 200) {
                    this.$store.commit('setLoading', -1)
                    this.musicUrl = res.data.data[0].url
                }
            }).catch(error => {
                this.$store.commit('setLoading', -1)
                console.log(error)
            })
        },
        clickPlayerBtn: function () {
            // window.testAudio = this.$refs.audio
            // duration
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
                // console.log(this.$refs.audio.currentTime / this.$refs.audio.duration)
                this.draw()
            }, 100)
        },
        loadMusic: function () {
            // console.log('loadMusic', this.$refs.audio.duration)
        },
        computeCanvasSize: function () {
            this.canvasSize = 64 * window.innerWidth / 750
        },
        draw: function () {
            this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize)
            this.ctx.lineWidth = 6 * window.innerWidth / 750
            this.ctx.beginPath()
            this.ctx.arc(this.canvasSize / 2, this.canvasSize / 2, this.canvasSize / 2 - this.ctx.lineWidth / 2, 0, 2 * Math.PI)
            this.ctx.strokeStyle = '#d4a49d'
            this.ctx.stroke()
            this.ctx.closePath()
            this.ctx.beginPath()
            this.ctx.arc(this.canvasSize / 2, this.canvasSize / 2, this.canvasSize / 2 - this.ctx.lineWidth / 2, 0 - Math.PI / 2, this.$refs.audio.currentTime / this.$refs.audio.duration * 2 * Math.PI - Math.PI / 2)
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
                    this.coverUrl = res.data.songs[0].al.picUrl
                }
            }).catch(error => {
                this.$store.commit('setLoading', -1)
                console.log(error)
            })
        }
    },
    mounted: function () {
        this.getMusicDetail('65766')
        this.getSongURL('65766')
        this.setTimer()
        this.computeCanvasSize()
        this.ctx = this.$refs.progress.getContext('2d')
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
    .preview {
        font-size: 0;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: white;
        line-height: rem(136);
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
        .songList {
            position: absolute;
            width: rem(64);
            height: rem(64);
            right: rem(19);
            bottom: rem(34);
            background-image: url('~@/assets/img/list.png');
            background-size: 100% 100%;
        }
    }
}
</style>
