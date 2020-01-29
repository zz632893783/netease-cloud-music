<template>
    <div class="rank">
        <h4 class="sectionTitle">官方榜</h4>
        <div class="officialRank">
            <div class="item" v-for="(item, index) in officialRank" v-bind:key="index">
                <div class="cover" v-bind:style="`background-image: url(${item.imgUrl});`">
                    <span class="updateFrequency">{{item.updateFrequency}}</span>
                </div>
                <div class="songs">
                    <div class="songItem" v-for="(song, songIndex) in item.songs" v-bind:key="`${index}_${songIndex}`">{{songIndex + 1}}.{{song.name}}</div>
                </div>
            </div>
        </div>
        <h4 class="sectionTitle">全球榜</h4>
        <div class="globalRank">
            <div class="item" v-for="(item, index) in globalRank" v-bind:key="index">
                <div class="cover" v-bind:style="`background-image: url(${item.coverImgUrl});`">
                    <span class="updateFrequency">{{item.updateFrequency}}</span>
                </div>
                <div class="text">
                    <p class="name">{{item.name}}</p>
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
            msg: 'rank',
            officialRank: [{
                name: '飙升榜',
                code: '3',
                imgUrl: '',
                songs: []
            }, {
                name: '新歌榜',
                code: '0',
                imgUrl: '',
                songs: []
            }, {
                name: '热歌榜',
                code: '1',
                imgUrl: '',
                songs: []
            }, {
                name: '原创榜',
                code: '2',
                imgUrl: '',
                songs: []
            }],
            globalRank: []
        }
    },
    methods: {
        getRankList: function () {
            let promiseList = []
            this.officialRank.forEach(item => {
                let promise = new Promise((resolve, reject) => {
                    let requestBody = {
                        idx: item.code
                    }
                    this.$store.commit('setLoading', 1)
                    commonRequest('/top/list', requestBody).then(res => {
                        this.$store.commit('setLoading', -1)
                        if (res.status === 200) {
                            item.imgUrl = res.data.playlist.coverImgUrl
                            console.log(res.data)
                            item.updateFrequency = res.data.playlist.updateFrequency
                            item.songs = (res.data.playlist.tracks || []).splice(0, 3)
                            resolve()
                        }
                    }).catch(error => {
                        this.$store.commit('setLoading', -1)
                        console.log(error)
                        reject(error)
                    })
                })
                promiseList.push(promise)
            })
            Promise.all(promiseList).then(() => {
                console.log('request success')
            })
        },
        getGlobalRankList: function () {
            let requestBody = {}
            this.$store.commit('setLoading', 1)
            commonRequest('/toplist', requestBody).then(res => {
                this.$store.commit('setLoading', -1)
                if (res.status === 200) {
                    this.globalRank = res.data.list.splice(5)
                }
            }).catch(error => {
                console.log(error)
                this.$store.commit('setLoading', -1)
            })
        }
    },
    mounted: function () {
        this.getRankList()
        this.getGlobalRankList()
    }
}
</script>
<style lang="stylus" scoped>
@import '~@/style/index.styl'
.rank {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .sectionTitle {
        font-size: rem(36);
        color: #484848;
        // font-weight: 200;
        font-weight: 600;
        padding-left: rem(34);
        line-height: rem(34);
        margin-bottom: rem(27);
        margin-top: rem(85);
    }
    .officialRank {
        font-size: 0;
        .item {
            display: block;
            margin-bottom: rem(20);
            &:nth-last-child(1) {
                margin-bottom: 0;
            }
            .cover {
                display: inline-block;
                width: rem(216);
                height: rem(216);
                background-size: cover;
                background-position: 50% 50%;
                border-radius: rem(8);
                margin: 0 rem(32);
                vertical-align: middle;
                position: relative;
                .updateFrequency {
                    position: absolute;
                    font-size: rem(24);
                    left: rem(13);
                    bottom: rem(16);
                    right: 0;
                    height: rem(23);
                    line-height: rem(23);
                    color: white;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    text-align: left;
                }
            }
            .songs {
                display: inline-block;
                width: rem(440);
                vertical-align: middle;
                .songItem {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: rem(29);
                    color: #606060;
                    line-height: rem(25);
                    margin-top: rem(30);
                    &:nth-child(1) {
                        margin-top: 0;
                    }
                }
            }
        }
    }
    .globalRank {
        font-size: 0;
        text-align: center;
        .item {
            display: inline-block;
            width: rem(216);
            margin: 0 rem(10);
            vertical-align: middle;
            .cover {
                width: rem(216);
                height: rem(216);
                background-size: cover;
                background-position: 50% 50%;
                border-radius: rem(8);
                position: relative;
                .updateFrequency {
                    position: absolute;
                    font-size: rem(24);
                    left: rem(13);
                    bottom: rem(16);
                    right: 0;
                    height: rem(23);
                    line-height: rem(23);
                    color: white;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    text-align: left;
                }
            }
            .text {
                height: rem(112);
                .name {
                    text-align: left;
                    display: block;
                    line-height: rem(31);
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -webkit-line-clamp: 3;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    font-size: rem(25);
                    color: #2d2d2d;
                    padding-top: rem(13);
                }
            }
        }
    }
}
</style>
