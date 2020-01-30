<template>
    <div class="search">
        <div class="inputBox">
            <span class="backBtn" v-on:click="back"></span>
            <input class="keywords" v-model="queryBody.keywords" placeholder="请输入搜索关键词" v-on:input="inputKeywords"/>
            <span class="clearBtn" v-on:click="clear" v-show="queryBody.keywords"></span>
        </div>
        <div class="nav" v-show="queryBody.keywords">
            <div v-bind:class="['item', (queryBody.type == item.code) && 'active']" v-bind:key="index" v-for="(item, index) in navList" v-on:click="selectNav(item)">
                {{item.name}}
            </div>
        </div>
        <div class="container" ref="container" v-bind:style="`top: ${computeContainerSize()}px;`" v-on:scroll="scrollFunc">
            <div class="hotSeach" v-show="!queryBody.keywords && !searchResult.length">
                <h4 class="title">热门搜索</h4>
                <div class="item" v-for="(item, index) in hotSeach" v-bind:key="index" v-on:click="search(item.first)">
                    {{item.first}}
                </div>
            </div>
            <div class="empty" v-show="queryBody.keywords && !searchResult.length">
                未找到任何结果
            </div>
            <div class="searchResult" ref="searchResult">
                <div class="song" v-if="queryBody.type == '1'">
                    <div class="item" v-for="(item, index) in searchResult" v-bind:key="index" v-on:click="selectSong(item)">
                        <h4 class="name">{{item.name}}</h4>
                        <div class="info">
                            <span>{{item.artists.map(i => i.name).join(',')}}</span>
                            <i></i>
                            <span>{{item.album.name}}</span>
                        </div>
                    </div>
                </div>
                <div class="songList" v-if="queryBody.type == '1000'">
                    <div class="item" v-for="(item, index) in searchResult" v-bind:key="index" v-on:click="selectSongList(item)">
                        <div class="cover" v-bind:style="`background-image: url(${item.coverImgUrl});`"></div>
                        <div class="info">
                            <h4 class="name">{{item.name}}</h4>
                            <div class="row">
                                <span class="songCount">{{item.trackCount}}首音乐</span>
                                <span class="creator">by&nbsp;{{item.creator.nickname}}，</span>
                                <span class="playCount">播放{{computeCount(item.playCount)}}次</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="singer" v-if="queryBody.type == '100'">
                    <div class="item" v-for="(item, index) in searchResult" v-bind:key="index" v-on:click="selectSinger(item)">
                        <div class="avatar" v-bind:style="`background-image: url(${item.picUrl || item.img1v1Url});`"></div>
                        <h4 class="name">
                            {{item.name}}
                            <label v-if="item.alia && item.alia.length">({{item.alia[0]}})</label>
                            <label v-else-if="item.alias && item.alias.length">({{item.alias[0]}})</label>
                        </h4>
                    </div>
                </div>
                <div class="albums" v-if="queryBody.type == '10'">
                    <div class="item" v-for="(item, index) in searchResult" v-bind:key="index" v-on:click="selectAlbum(item)">
                        <div class="cover" v-bind:style="`background-image: url(${item.blurPicUrl});`"></div>
                        <div class="info">
                            <h4 class="name">{{item.name}}</h4>
                            <div class="row">
                                <span class="creator">by&nbsp;{{item.artist.name}}，</span>
                                <span class="time">{{computeTimeToString(item.publishTime)}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="videos" v-if="queryBody.type == '1014'">
                    <div class="item" v-for="(item, index) in searchResult" v-bind:key="index" v-on:click="selectVideo(item)">
                        <div class="cover" v-bind:style="`background-image: url(${item.coverUrl});`">
                            <span class="playCount">
                                <i></i>
                                <label>{{computeCount(item.playTime)}}</label>
                            </span>
                        </div>
                        <div class="info">
                            <h4 class="name"><span class="mv" v-if="item.type == 0">MV</span>{{item.title}}</h4>
                            <div class="row">
                                <span class="duration">{{computeDuration(item.durationms)}},&nbsp;</span>
                                <span class="creator">{{item.type == 1 ? 'by' : ''}}&nbsp;{{item.creator.map(i => i.userName).join(',')}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lyric" v-if="queryBody.type == '1006'">
                    <div class="item" v-for="(item, index) in searchResult" v-bind:key="index" v-on:click="selectLyric(item)">
                        <h4 class="name">{{item.name}}</h4>
                        <div class="artists">{{item.artists.map(i => i.name).join('/')}}</div>
                        <div class="words" v-html="computeLyric(item)" v-bind:style="computeLyricHeight(item.showLyric)"></div>
                        <span v-bind:class="['lyricBtn', item.showLyric ? 'close' : 'open']" v-on:click="item.showLyric = !item.showLyric">{{item.showLyric ? '收起' : '展开'}}歌词</span>
                    </div>
                </div>
                <div class="radios" v-if="queryBody.type == '1009'">
                    <div class="item" v-for="(item, index) in searchResult" v-bind:key="index" v-on:click="selectRadio(item)">
                        <div class="cover" v-bind:style="`background-image: url(${item.picUrl});`"></div>
                        <div class="info">
                            <h4 class="name">{{item.name}}</h4>
                            <div class="artists">{{item.dj.nickname}}</div>
                        </div>
                    </div>
                </div>
                <div class="user" v-if="queryBody.type == '1002'">
                    <div class="item" v-for="(item, index) in searchResult" v-bind:key="index" v-on:click="selectUser(item)">
                        <div class="avatar" v-bind:style="`background-image: url(${item.avatarUrl});`"></div>
                        <div class="info">
                            <span class="name">{{item.nickname}}</span>
                            <span class="signature">{{item.signature}}</span>
                        </div>
                        <span class="btn"><i></i>关注</span>
                    </div>
                </div>
                <div class="nomore" v-show="queryBody.keywords && searchResult.length">
                    已经到底啦
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
            // activeIndex: 0,
            navList: [{
            //     name: '综合',
            //     code: '0'
            // }, {
                name: '单曲',
                code: '1'
            }, {
                name: '歌单',
                code: '1000'
            }, {
                name: '歌手',
                code: '100'
            }, {
                name: '专辑',
                code: '10'
            }, {
                name: '视频',
                code: '1014'
            }, {
                name: '歌词',
                code: '1006'
            }, {
                name: '电台',
                code: '1009'
            }, {
                name: '用户',
                code: '1002'
            }],
            queryBody: {
                // type: '0',
                type: '1',
                keywords: '',
                offset: 0,
                pageSize: 30
            },
            hotSeach: [],
            count: 0,
            searchResult: []
        }
    },
    methods: {
        getHotSearch: function () {
            let requestBody = {}
            this.$store.commit('setLoading', 1)
            commonRequest('/search/hot', requestBody).then(res => {
                this.$store.commit('setLoading', -1)
                if (res.status === 200) {
                    this.hotSeach = res.data.result.hots
                }
            }).catch(error => {
                this.$store.commit('setLoading', -1)
                console.log(error)
            })
        },
        back: function () {
            this.$router.back()
        },
        search: function (keywords) {
            this.queryBody.keywords = keywords
            // type: 搜索类型；默认为 1 即单曲 , 取值意义 :
            // 1: 单曲
            // 10: 专辑
            // 100: 歌手
            // 1000: 歌单
            // 1002: 用户
            // 1004: MV
            // 1006: 歌词
            // 1009: 电台
            // 1014: 视频
            // 1018:综合
            let requestBody = {
                keywords: this.queryBody.keywords,
                limit: this.queryBody.pageSize,
                offset: this.queryBody.offset,
                type: this.queryBody.type
                // keywords,
                // type,
                // limit: pageSize,
                // offset
            }
            this.$store.commit('setLoading', 1)
            return commonRequest('/search', requestBody).then(res => {
                this.$store.commit('setLoading', -1)
                if (res.status === 200) {
                    switch (this.queryBody.type) {
                    case '1':
                        this.count = res.data.result.songCount
                        this.searchResult = [...this.searchResult, ...res.data.result.songs]
                        break
                    case '1000':
                        this.count = res.data.result.playlistCount
                        this.searchResult = [...this.searchResult, ...res.data.result.playlists]
                        break
                    case '100':
                        this.count = res.data.result.artistCount
                        this.searchResult = [...this.searchResult, ...res.data.result.artists]
                        break
                    case '10':
                        this.count = res.data.result.albumCount
                        this.searchResult = [...this.searchResult, ...res.data.result.albums]
                        break
                    case '1014':
                        this.count = res.data.result.videoCount
                        this.searchResult = [...this.searchResult, ...res.data.result.videos]
                        break
                    case '1006':
                        res.data.result.songs.forEach(item => {
                            item.lyric = ''
                            item.showLyric = false
                        })
                        this.getLyric(res.data.result.songs)
                        this.count = res.data.result.songCount
                        this.searchResult = [...this.searchResult, ...res.data.result.songs]
                        break
                    case '1009':
                        this.count = res.data.result.djRadiosCount
                        this.searchResult = [...this.searchResult, ...res.data.result.djRadios]
                        break
                    case '1002':
                        this.count = res.data.result.userprofileCount
                        this.searchResult = [...this.searchResult, ...res.data.result.userprofiles]
                        break
                    }
                }
            }).catch(error => {
                this.$store.commit('setLoading', -1)
                console.log(error)
            })
        },
        inputKeywords: function () {
            this.songCount = 0
            this.searchResult = []
            this.queryBody.offset = 0
            if (!this.queryBody.keywords) {
                return false
            }
            this.search(this.queryBody.keywords)
        },
        computeContainerSize: function () {
            return (94 + (this.queryBody.keywords ? 78 : 0)) * window.innerWidth / 750
        },
        selectNav: function (obj) {
            this.queryBody.type = obj.code
            this.count = 0
            this.queryBody.offset = 0
            this.searchResult = []
            this.search(this.queryBody.keywords)
        },
        clear: function () {
            this.songCount = 0
            this.searchResult = []
            this.queryBody.offset = 0
            this.queryBody.keywords = ''
        },
        selectSong: function (obj) {
            this.$parent.$refs.player.getMusicDetail(obj.id)
            this.$parent.$refs.player.getSongURL(obj.id)
        },
        computeCount: function (val) {
            if (val <= 9999) {
                return val
            } else if (val < 99999999) {
                return `${(val / 10000).toFixed(1)}万`
            } else if (val < 999999999999) {
                return `${(val / 100000000).toFixed(1)}亿`
            }
        },
        selectSongList: function (obj) {
            this.$router.push({
                path: '/songListDetail',
                query: {
                    id: obj.id
                }
            })
        },
        selectSinger: function (obj) {
            this.$router.push({
                path: '/singerDetail',
                query: {
                    id: obj.id
                }
            })
        },
        selectAlbum: function () {
            return alert('专辑功能尚在开发中')
        },
        selectVideo: function () {
            return alert('视频功能尚在开发中')
        },
        selectLyric: function () {
            // return alert('歌词功能尚在开发中')
        },
        selectRadio: function () {
            return alert('电台功能尚在开发中')
        },
        selectUser: function () {
            return alert('用户功能尚在开发中')
        },
        computeTimeToString: function (time) {
            let date = new Date(time)
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDate()
            month = month < 10 ? `0${month}` : month
            day = day < 10 ? `0${day}` : day
            return `${year}-${month}-${day}`
        },
        computeDuration: function (duration) {
            duration = duration / 1000
            let minute = parseInt(duration / 60)
            let second = parseInt(duration % 60)
            minute = minute === 0 ? '00' : (minute < 10 ? '0' + minute : minute)
            second = second === 0 ? '00' : (second < 10 ? '0' + second : second)
            return `${minute}:${second}`
        },
        getLyric: function (songs) {
            let promiseList = []
            songs.forEach(song => {
                let requestBody = {
                    id: song.id
                }
                this.$store.commit('setLoading', 1)
                promiseList.push(commonRequest('/lyric', requestBody).then(res => {
                    this.$store.commit('setLoading', -1)
                    if (res.status === 200) {
                        song.lyric = res.data.lrc.lyric
                    }
                }).catch(error => {
                    this.$store.commit('setLoading', -1)
                    console.log(error)
                }))
            })
            Promise.all(promiseList).then(() => {
                console.log('所有歌词查询完毕')
            })
        },
        computeLyric: function (song) {
            if (!song.lyric) {
                return ''
            }
            let arr = song.lyric.split(/[↵\n]/)
            arr = arr.map(item => {
                /* eslint-disable */
                let str = item.replace(/\[[\.\d:]+\]/, '')
                return str.trim()
            })
            arr = arr.filter(item => !!item)
            if (!song.showLyric) {
                let reg = new RegExp(this.queryBody.keywords)
                let index = arr.findIndex(item => item.match(reg))
                arr = arr.slice(index, index + 3)
            }
            arr = arr.map(item => {
                let reg = new RegExp(`(${this.queryBody.keywords})`)
                return item.replace(reg, '<span class="blue" style="color: #5a7cab;">$1</span>')
            })
            return arr.map(item => {
                return `<div class="lyricItem">${item}</div>`
            }).join('')
        },
        computeLyricHeight: function (showLyric) {
            let height
            if (!showLyric) {
                height = `${55 * window.innerWidth / 750 * 3}px`
            } else {
                height = 'auto'
            }
            return {
                height
            }
        },
        scrollFunc: function () {
            let height = this.$refs.container.offsetHeight + this.$refs.container.scrollTop
            let temp = 0
            let list = [...this.$refs.searchResult.children]
            list.forEach(item => {
                temp = temp + item.offsetHeight
            })
            if (height >= temp && this.searchResult.length < this.count) {
                this.queryBody.offset = this.searchResult.length
                this.search(this.queryBody.keywords)
            }
            // this.flag = this.$refs.container.scrollTop + window.innerHeight >= this.$refs.sinterInfo.offsetHeight + this.$refs.hotSongs.offsetHeight
            // let temp = this.$refs.sinterInfo.offsetHeight / 2
            // temp = (temp - this.$refs.container.scrollTop) / temp
            // temp = temp < 0 ? 0 : temp
            // this.$refs.collectionBtn.style.opacity = temp
        }
    },
    mounted: function () {
        this.getHotSearch()
    }
}
</script>
<style lang="stylus" scoped>
@import '~@/style/index.styl'
.search {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .inputBox {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: rem(94);
        background-color: #d44339;
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
        .keywords {
            position: absolute;
            left: rem(100);
            width: rem(750 - 200);
            height: rem(94);
            line-height: rem(94);
            border: none;
            background-color: transparent;
            outline: none;
            color: white;
            font-size: rem(28);
            line-height: rem(70);
            &::-webkit-input-placeholder {
                color: rgba(255, 255, 255, 0.6);
            }
        }
        .clearBtn {
            position: absolute;
            right: rem(30);
            top: 50%;
            width: rem(40);
            height: rem(40);
            transform: translate(0, -50%);
            &:before, &:after {
                content: '';
                position: absolute;
                left: 50%;
                top: 50%;
                width: rem(30);
                height: rem(4);
                background-color: white;
            }
            &:before {
                transform: translate(-50%, -50%) rotate(45deg);
            }
            &:after {
                transform: translate(-50%, -50%) rotate(135deg);
            }
        }
    }
    .nav {
        position: absolute;
        height: rem(78);
        padding: 0 rem(27);
        padding-top: rem(25);
        top: rem(94);
        left: 0;
        right: 0;
        z-index: 1;
        font-size: 0;
        white-space: nowrap;
        overflow-x: auto;
        // background-color: #f2f3f4;
        border-bottom: rem(1) solid #e6e6e6;
        &::-webkit-scrollbar {
            width: 0;
            height: 0;
        }
        .item {
            display: inline-block;
            padding: 0 rem(28);
            font-size: rem(29);
            padding: 0 rem(10);
            padding-bottom: rem(25);
            color: #333334;
            margin-right: rem(58);
            position: relative;
            line-height: rem(28);
            &:nth-last-child(1) {
                margin-right: rem(0);
            }
            &:before {
                content: '';
                position: absolute;
                left: 0;
                right: 0;
                bottom: rem(0);
                height: rem(4);
                border-radius: rem(2);
                // background-color: #ea4d44;
                background-color: transparent;
                transform: translate(0, -100%);
            }
            &.active {
                color: #ea4d44;
                &:before {
                    background-color: #ea4d44;
                }
            }
        }
    }
    .container {
        position: absolute;
        left: 0;
        right: 0;
        top: rem(94);
        bottom: 0;
        overflow-y: auto;
        // background-color: #f2f3f4;
        .hotSeach {
            position: relative
            font-size: 0;
            padding: 0 rem(36);
            .title {
                font-size: rem(28);
                line-height: rem(26);
                margin-top: rem(70);
                margin-bottom: rem(43);
                font-weight: 200;
            }
            .item {
                font-size: rem(28);
                line-height: rem(48);
                padding: 0 rem(22);
                background-color: #fff;
                display: inline-block;
                border-radius: rem(12);
                margin-right: rem(40);
                margin-bottom: rem(20);
                border: rem(1) solid rgba(0, 0, 0, 0.15);
            }
        }
        .empty {
            font-size: rem(28);
            color: #2c3e50;
            text-align: center;
            line-height: rem(200);
        }
        .searchResult {
            .song {
                .item {
                    height: rem(120);
                    margin: 0 rem(32);
                    border-bottom: rem(2) solid #e6e6e6;
                    .name {
                        font-size: rem(32);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        font-weight: 200;
                        padding-top: rem(27);
                        line-height: rem(30);
                        margin-bottom: rem(15);
                    }
                    .info {
                        font-size: 0;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        span {
                            display: inline-block;
                            vertical-align: middle;
                            font-size: rem(24);
                            color: #808080;
                        }
                        i {
                            display: inline-block;
                            margin: 0 rem(8);
                            vertical-align: middle;
                            width: rem(6);
                            height: rem(2);
                            background-color: #808080;
                        }
                    }
                }
            }
            .songList {
                .item {
                    line-height: rem(120);
                    font-size: 0;
                    .cover {
                        display: inline-block;
                        width: rem(100);
                        height: rem(100);
                        border-radius: rem(8);
                        background-position: 50% 50%;
                        background-size: cover;
                        vertical-align: middle;
                        margin-right: rem(22);
                        margin-left: rem(32);
                    }
                    .info {
                        display: inline-block;
                        height: rem(120);
                        width: rem(580);
                        vertical-align: middle;
                        font-size: rem(12);
                        .name {
                            font-size: rem(34);
                            line-height: rem(32);
                            padding-top: rem(25);
                            font-weight: 200;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            color: #333334;
                        }
                        .row {
                            font-size: 0;
                            line-height: rem(24);
                            margin-top: rem(21);
                            color: #666666;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            .songCount, .creator, .playCount {
                                font-size: rem(24);
                            }
                        }
                    }
                }
            }
            .singer {
                .item {
                    line-height: rem(140);
                    font-size: 0;
                    .avatar {
                        width: rem(100);
                        height: rem(100);
                        border-radius: 50%;
                        background-size: cover;
                        background-position: 50% 50%;
                        vertical-align: middle;
                        display: inline-block;
                        margin-left: rem(32);
                    }
                    .name {
                        vertical-align: middle;
                        display: inline-block;
                        font-size: rem(32);
                        color: #333334;
                        font-weight: 200;
                        margin-left: rem(22);
                        width: rem(570);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        label {
                            color: #808080;
                        }
                    }
                }
            }
            .albums {
                .item {
                    line-height: rem(120);
                    .cover {
                        display: inline-block;
                        width: rem(100);
                        height: rem(100);
                        border-radius: rem(8);
                        background-size: cover;
                        background-position: 50%;
                        vertical-align: middle;
                        margin-left: rem(32);
                    }
                    .info {
                        display: inline-block;
                        height: rem(120);
                        vertical-align: middle;
                        margin-left: rem(34);
                        width: rem(560);
                        .name {
                            line-height: rem(33);
                            font-size: rem(34);
                            padding-top: rem(29);
                            margin-bottom: rem(21);
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                        .row {
                            line-height: rem(22);
                            font-size: 0;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            .creator, .time {
                                display: inline-block;
                                font-size: rem(24);
                                color: #808080;
                            }
                        }
                    }
                }
            }
            .videos {
                .item {
                    line-height: rem(160);
                    font-size: 0;
                    .cover {
                        display: inline-block;
                        width: rem(248);
                        height: rem(140);
                        border-radius: rem(8);
                        background-size: cover;
                        background-position: 50% 50%;
                        vertical-align: middle;
                        margin-left: rem(32);
                        position: relative;
                        .playCount {
                            position: absolute;
                            top: rem(9);
                            right: rem(15);
                            font-size: 0;
                            line-height: rem(20);
                            i {
                                display: inline-block;
                                width: rem(16);
                                height: rem(20);
                                background-image: url('~@/assets/img/play.png');
                                background-size: 100% 100%;
                                vertical-align: middle;
                                margin-right: rem(9);
                            }
                            label {
                                font-size: rem(24);
                                color: white;
                                display: inline-block;
                                line-height: rem(20);
                                vertical-align: middle;
                            }
                        }
                    }
                    .info {
                        display: inline-block;
                        vertical-align: middle;
                        height: rem(140);
                        width: rem(400);
                        margin-left: rem(21);
                        .name {
                            line-height: rem(40);
                            font-size: rem(31);
                            margin-top: rem(19);
                            margin-bottom: rem(15);
                            overflow: hidden;
                            text-overflow: ellipsis;
                            -webkit-line-clamp: 2;
                            display: -webkit-box;
                            height: rem(80);
                            .mv {
                                display: inline-block;
                                font-size: rem(15);
                                color: #d44339;
                                line-height: rem(22);
                                padding: 0 rem(4);
                                border: rem(1) solid #d44339;
                                margin-right: rem(8);
                                border-radius: rem(4);
                            }
                        }
                        .row {
                            line-height: rem(25);
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            .duration, .creator {
                                font-size: rem(24);
                                color: #999999;
                            }
                        }
                    }
                }
            }
            .lyric {
                .item {
                    // height: rem(364);
                    margin-left: rem(70);
                    margin-right: rem(32);
                    border-bottom: rem(1) solid #e6e6e6;
                    .name {
                        font-size: rem(30);
                        color: #333334;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        line-height: rem(28);
                        margin-top: rem(31);
                        margin-bottom: rem(20);
                    }
                    .artists {
                        font-size: rem(24);
                        color: #808080;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        line-height: rem(20);
                        margin-bottom: rem(20);
                    }
                    .words {
                        font-size: rem(30);
                        color: #666667;
                        line-height: rem(55);
                        // height: rem(55 * 3);
                        position: relative;
                        &:before {
                            content: '词';
                            line-height: rem(28);
                            padding: 0 rem(3);
                            border-radius: rem(4);
                            color: white;
                            background-color: #cccccc;
                            position: absolute;
                            left: rem(-38);
                            top: rem(14);
                            font-size: rem(22);
                        }
                        .lyricItem {
                            display: block;
                            height: rem(55);
                            line-height: rem(55);
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            .blue {
                                // color: #5a7cab;
                            }
                        }
                    }
                    .lyricBtn {
                        margin-top: rem(22);
                        font-size: rem(25);
                        color: #999999;
                        line-height: rem(21);
                        display: inline-block;
                        position: relative;
                        margin-bottom: rem(36);
                        &:before {
                            content: '';
                            position: absolute;
                            right: rem(-15);
                            border-top: rem(2) solid #b3b3b3;
                            border-left: rem(2) solid #b3b3b3;
                            width: rem(13);
                            height: rem(13);
                        }
                        &.open {
                            &:before {
                                top: 0%;
                                transform: translate(100%, 0) rotate(225deg);
                            }
                        }
                        &.close {
                            &:before {
                                top: 0%;
                                transform: translate(100%, 0) rotate(45deg);
                            }
                        }
                    }
                }
            }
            .radios {
                .item {
                    height: rem(120);
                    line-height: rem(120);
                    .cover {
                        display: inline-block;
                        width: rem(100);
                        height: rem(100);
                        border-radius: rem(8);
                        background-size: cover;
                        background-position: 50% 50%;
                        vertical-align: middle;
                        margin-left: rem(32);
                        margin-right: rem(21);
                    }
                    .info {
                        display: inline-block;
                        width: rem(580);
                        vertical-align: middle;
                        .name {
                            font-size: rem(34);
                            color: #333334;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            line-height: rem(32);
                            padding-top: rem(25);
                            padding-bottom: rem(20);
                        }
                        .artists {
                            line-height: rem(23);
                            color: #808080;
                            font-size: rem(24);
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }
                }
            }
            .user {
                .item {
                    height: rem(140);
                    line-height: rem(140);
                    font-size: 0;
                    position: relative;
                    .avatar {
                        display: inline-block;
                        width: rem(108);
                        height: rem(108);
                        background-position: 50% 50%;
                        background-size: cover;
                        border-radius: 50%;
                        vertical-align: middle;
                        margin-left: rem(32);
                        margin-right: rem(21);
                    }
                    .info {
                        display: inline-block;
                        height: rem(140);
                        vertical-align: middle;
                        padding-top: rem(33);
                        width: rem(420);
                        .name {
                            line-height: rem(32);
                            color: #333334;
                            font-size: rem(34);
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            margin-bottom: rem(17);
                            display: block;
                        }
                        .signature {
                            line-height: rem(24);
                            color: #848484;
                            font-size: rem(27);
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            display: block;
                        }
                    }
                    .btn {
                        position: absolute;
                        right: rem(32);
                        top: 50%;
                        transform: translate(0, -50%);
                        padding: 0 rem(27);
                        line-height: rem(52);
                        border-radius: rem(26);
                        border: rem(1) solid #ea4d44;
                        font-size: rem(24);
                        color: #ea4d44;
                        i {
                            display: inline-block;
                            width: rem(20);
                            height: rem(20);
                            position: relative;
                            margin-right: rem(8);
                            vertical-align: middle;
                            &:before, &:after {
                                position: absolute;
                                content: '';
                                width: rem(20);
                                height: rem(2);
                                background-color: #ea4d44;
                                left: 50%;
                                top: 50%;
                            }
                            &:before {
                                transform: translate(-50%, -50%) rotate(0);
                            }
                            &:after {
                                transform: translate(-50%, -50%) rotate(90deg);
                            }
                        }
                    }
                }
            }
            .nomore {
                display: block;
                text-align: center;
                line-height: rem(120);
                font-size: rem(30);
                color: #999999;
            }
        }
    }
}
</style>
