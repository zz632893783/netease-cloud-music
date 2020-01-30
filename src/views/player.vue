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
                    <span v-bind:class="`btn ${['loop', 'single', 'random'][mode]}`" v-on:click="changeMode">
                        <i></i>
                        <label>{{['顺序播放', '单曲循环', '随机播放'][mode]}}</label>
                    </span>
                    <span class="deleteBtn" v-on:click="removeAllSong"></span>
                </div>
                <div class="songs">
                    <div class="item" v-for="(item, index) in songList" v-bind:key="index" v-on:click="getSongURL(item.id)">
                        <span class="play" v-show="activeSongId == item.id"></span>
                        <div class="song">
                            <span class="name">{{item.name}}</span>
                            <i></i>
                            <span class="artist">{{(item.artist || []).join('/')}}</span>
                        </div>
                        <span v-bind:class="`enjoyBtn ${item.enjoy ? 'active' : ''}`" v-on:click="enjoySong(item)"></span>
                        <span class="deleteBtn" v-on:click="removeSong(index)"></span>
                    </div>
                    <span class="empty" v-if="!songList.length">
                        还未添加任何歌曲
                    </span>
                </div>
            </div>
        </div>
        <div class="playerDetail" v-bind:style="computePlayerDetailSize()" v-on:touchmove="touchmoveFunc" v-on:touchend="touchendFunc">
            <span class="closeBtn" v-on:click="showPlayerDetail = false"></span>
            <div class="bg" v-bind:style="`background-image: url(${(songList.find(item => item.id === activeSongId) || {}).coverUrl || ''}); height: ${windowHeight * 1.4}px;`"></div>
            <h3 class="title">{{(songList.find(item => item.id == activeSongId) || {}).name}}</h3>
            <p class="artist">{{((songList.find(item => item.id == activeSongId) || {}).artist || []).join('/')}}</p>
            <div class="cover" v-bind:style="`background-image: url(${(songList.find(item => item.id == activeSongId) || {}).coverUrl});`"></div>
            <div class="progress" ref="playProgress" v-on:touchend="progressTouchEndFunc">
                <span class="currentTime">{{computeSecondToString(currentTime)}}</span>
                <div class="bar" ref="bar" v-bind:style="computeProgressBarStyle()"></div>
                <span class="dot" ref="dot" v-on:touchstart="touchstartFunc">
                    <i></i>
                </span>
                <span class="duration">{{computeSecondToString(duration)}}</span>
            </div>
            <div class="control">
                <span v-bind:class="`playModeBtn ${['loop', 'single', 'random'][mode]}`" v-on:click="changeMode"></span>
                <span class="prevBtn" v-on:click="prev"></span>
                <span v-bind:class="`playBtn ${status}`" v-on:click="clickPlayerBtn"></span>
                <span class="nextBtn" v-on:click="next"></span>
                <span class="songListBtn" v-on:click="setSongListShowState(true)"></span>
            </div>
        </div>
    </div>
</template>
<script>
import commonRequest from '@/api/commonRequest.js'
export default {
    data: function () {
        return {
            windowHeight: window.innerHeight,
            msg: 'player',
            musicUrl: '',
            status: 'pause',
            loadFinish: false,
            // status: 'play',
            timer: null,
            currentTime: 0,
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
            songList: [],
            touchDotEnable: false,
            screenX: 0,
            prevLeft: 0
        }
    },
    methods: {
        setStatus: function (status) {
            this.status = status
        },
        addSong: function (song) {
            song.enjoy = false
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
                        this.next()
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
                if (!this.touchDotEnable) {
                    this.currentTime = this.$refs.audio.currentTime
                    this.$refs.dot.style.left = `${(this.currentTime / this.duration * 100)}%`
                } else {
                    // console.log('此处也是用拖动数据')
                }
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
                            coverUrl: res.data.songs[0].al.picUrl,
                            enjoy: false
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
            // console.log(2333)
            this.showPlayerDetail = val
        },
        computePlayerDetailSize: function () {
            let top = (this.showPlayerDetail ? 0 : window.innerHeight)
            return {
                top: `${top}px`
            }
        },
        computeSecondToString: function (val) {
            let minute = parseInt(val / 60)
            let second = parseInt(val % 60)
            minute = minute === 0 ? '00' : (minute < 10 ? '0' + minute : minute)
            second = second === 0 ? '00' : (second < 10 ? '0' + second : second)
            return `${minute}:${second}`
        },
        computeProgressBarStyle: function () {
            if (!this.touchDotEnable) {
                return {
                    width: `${this.currentTime / this.duration * 100}%`
                }
            } else {
                // console.log('此处使用拖动数据')
                return {
                    width: `${this.prevLeft}px`
                }
            }
        },
        touchstartFunc: function (event) {
            this.screenX = event.touches[0].screenX
            this.touchDotEnable = true
            this.prevLeft = parseFloat(window.getComputedStyle(this.$refs.dot).left)
            // this.$refs.bar.style.width = `${this.prevLeft}px`
        },
        touchmoveFunc: function (event) {
            if (this.touchDotEnable) {
                let temp = event.touches[0].screenX - this.screenX
                temp = this.prevLeft + temp
                let barWidth = this.$refs.playProgress.offsetWidth
                if (temp < 0) {
                    temp = 0
                } else if (temp > barWidth) {
                    temp = barWidth
                }
                this.$refs.dot.style.left = `${temp}px`
                this.$refs.bar.style.width = `${temp}px`
                this.currentTime = temp / barWidth * this.duration
            }
        },
        touchendFunc: function () {
            if (this.touchDotEnable) {
                this.touchDotEnable = false
                this.$refs.audio.currentTime = this.currentTime
            }
        },
        progressTouchEndFunc: function (event) {
            console.log(event)
        },
        playFinish: function () {
            if (this.mode === 0 || this.mode === 2) {
                this.next()
            } else if (this.mode === 1) {
                this.getSongURL(this.activeSongId)
            }
        },
        prev: function () {
            if (!this.songList.length) {
                return alert('先添加些歌曲吧')
            }
            if (this.mode === 0 || this.mode === 1) {
                let index = this.songList.findIndex(item => item.id === this.activeSongId)
                if (index >= 0) {
                    index = (index + this.songList.length - 1) % this.songList.length
                    this.activeSongId = this.songList[index].id
                    this.getSongURL(this.activeSongId)
                }
            } else {
                let index = this.randomSongIndex()
                this.activeSongId = this.songList[index].id
                this.getSongURL(this.activeSongId)
            }
        },
        next: function () {
            if (!this.songList.length) {
                return alert('先添加些歌曲吧')
            }
            if (this.mode === 0 || this.mode === 1) {
                let index = this.songList.findIndex(item => item.id === this.activeSongId)
                if (index >= 0) {
                    index = (index + 1) % this.songList.length
                    this.activeSongId = this.songList[index].id
                    this.getSongURL(this.activeSongId)
                }
            } else {
                let index = this.randomSongIndex()
                this.activeSongId = this.songList[index].id
                this.getSongURL(this.activeSongId)
            }
        },
        randomSongIndex: function () {
            if (this.songList.length === 1) {
                return 0
            }
            let prevIndex = this.songList.findIndex(item => item.id === this.activeSongId)
            let index = parseInt(Math.random() * this.songList.length)
            while (index === prevIndex) {
                index = parseInt(Math.random() * this.songList.length)
            }
            return index
        },
        changeMode: function () {
            this.mode = (this.mode + 1) % 3
        },
        removeAllSong: function () {
            confirm('确认移除所有?') && (this.songList = [])
        },
        removeSong: function (index) {
            this.songList.splice(index, 1)
        },
        enjoySong: function (song) {
            song.enjoy = !song.enjoy
            console.log(song)
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
            this.duration = this.$refs.audio.duration
            this.clickPlayerBtn()
        })
        this.$refs.audio.addEventListener('ended', () => {
            this.playFinish()
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
        z-index: 1;
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
                        margin-right: rem(22);
                        margin-left: rem(40);
                        background-size: 100% 100%;
                    }
                    &.loop {
                        i {
                            background-image: url('~@/assets/img/loop.png');
                        }
                    }
                    &.single {
                        i {
                            background-image: url('~@/assets/img/single.png');
                        }
                    }
                    &.random {
                        i {
                            background-image: url('~@/assets/img/random.png');
                        }
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
                    background-size: 100% 100%;
                    background-image: url('~@/assets/img/delete.png');
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
                        background-size: 100% 100%;
                        background-image: url('~@/assets/img/playRedFull.png');
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
                        background-size: 100% 100%;
                        background-image: url('~@/assets/img/heat.png');
                        &.active {
                            background-image: url('~@/assets/img/heatFull.png');
                        }
                    }
                    .deleteBtn {
                        position: absolute;
                        width: rem(25);
                        height: rem(29);
                        right: rem(62);
                        top: 50%;
                        transform: translate(0, -50%);
                        background-size: 100% 100%;
                        background-image: url('~@/assets/img/delete.png');
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
        // border: 1px solid blue;
        pointer-events: auto;
        transition: top 0.5s;
        overflow: hidden;
        background-color: white;
        .closeBtn {
            position: absolute;
            top: rem(30);
            left: rem(30);
            width: rem(60);
            height: rem(60);
            // border: 1px solid;
            z-index: 2;
            &:before {
                content: '';
                width: rem(30);
                height: rem(30);
                position: absolute;
                border-top: rem(2) solid;
                border-left: rem(2) solid;
                left: 50%;
                top: 30%;
                transform: translate(-50%, -50%) rotate(-135deg);
            }
        }
        .bg {
            position: absolute;
            // left: rem(-100);
            // top: rem(-100);
            // right: rem(-100);
            // bottom: rem(-100);
            // filter: blur(rem(20));
            background-position: 50% 50%;
            background-size: cover;
            filter: blur(rem(30));
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: rem(1000);
        }
        .title {
            line-height: rem(90);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: rem(700);
            margin: 0 auto;
            text-align: center;
            font-size: rem(32);
            position: relative;
            z-index: 1;
            color: #0b111a;
            font-weight: 200;
        }
        .artist {
            line-height: rem(26);
            font-size: rem(28);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: rem(700);
            margin: 0 auto;
            text-align: center;
            position: relative;
            z-index: 1;
            color: rgba(0, 0, 0, 0.4);
        }
        .cover {
            position: absolute;
            width: rem(570);
            height: rem(570);
            background-size: cover;
            background-position: 50% 50%;
            border-radius: 50%;
            left: 50%;
            top: rem(240);
            transform: translate(-50%, 0);
        }
        .progress {
            position: absolute;
            left: 50%;
            bottom: rem(196);
            width: rem(480);
            height: rem(8);
            transform: translate(-50%, 0);
            background-color: rgba(255, 255, 255, 0.3);
            .bar {
                position: absolute;
                left: 0;
                top: 0;
                height: rem(8);
                background-color: #d44339;
            }
            .dot {
                width: 0;
                height: 0;
                position: absolute;
                top: 50%;
                transform: translate(0, -50%);
                i {
                    position: absolute;
                    width: rem(16);
                    height: rem(16);
                    border-radius: 50%;
                    background-color: white;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }
            }
            .currentTime, .duration {
                position: absolute;
                top: 50%;
                font-size: rem(28);
                color: rgba(0, 0, 0, 0.5);
            }
            .currentTime {
                left: rem(-14);
                transform: translate(-100%, -50%);
            }
            .duration {
                right: rem(-14);
                transform: translate(100%, -50%);
            }
        }
        .control {
            position: absolute;
            white-space: nowrap;
            bottom: rem(68);
            white-space: nowrap;
            text-align: center;
            width: rem(750);
            .playBtn {
                display: inline-block;
                width: rem(80);
                height: rem(80);
                margin: 0 rem(76);
                vertical-align: middle;
                background-size: 100% 100%;
                &.play {
                    background-image: url('~@/assets/img/pauseRed.png');
                }
                &.pause {
                    background-image: url('~@/assets/img/playRed.png');
                }
            }
            .prevBtn, .nextBtn {
                width: rem(46);
                height: rem(53);
                // border: 1px solid;
                display: inline-block;
                vertical-align: middle;
                background-size: 100% 100%;
            }
            .prevBtn {
                margin-left: rem(87);
                background-image: url('~@/assets/img/prev.png');
            }
            .nextBtn {
                margin-right: rem(81);
                background-image: url('~@/assets/img/next.png');
            }
            .playModeBtn {
                width: rem(48);
                height: rem(46);
                // border: 1px solid;
                display: inline-block;
                vertical-align: middle;
                background-size: 100% 100%;
                &.loop {
                    background-image: url('~@/assets/img/loop.png');
                }
                &.single {
                    background-image: url('~@/assets/img/single.png');
                }
                &.random {
                    background-image: url('~@/assets/img/random.png');
                }
            }
            .songListBtn {
                width: rem(61);
                height: rem(62);
                // border: 1px solid;
                display: inline-block;
                vertical-align: middle;
                background-size: 100% 100%;
                background-image: url('~@/assets/img/list.png');
            }
        }
    }
}
</style>
