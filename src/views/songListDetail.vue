<template>
    <div class="songListDetail">
        <div class="intoContainer">
            <div class="bg" v-bind:style="`background-image: url(${listBaseInfo.coverImg});`"></div>
            <div class="cover" v-bind:style="`background-image: url(${listBaseInfo.coverImg});`">
                <span class="playCount">{{computePlayCount(listBaseInfo.playCount)}}</span>
            </div>
            <h4 class="title">{{listBaseInfo.title}}</h4>
            <div class="author">
                <span class="avatar" v-bind:style="`background-image: url(${listBaseInfo.avatar});`"></span>
                <span class="name">{{listBaseInfo.author}}</span>
            </div>
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
                avatar: ''
            }
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
        }
    },
    mounted: function () {
        this.getSongListDetail()
    }
}
</script>
<style lang="stylus" scoped>
@import '~@/style/index.styl'
.songListDetail {
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px solid;
    .intoContainer {
        height: rem(254);
        overflow: hidden;
        position: relative;
        .bg {
            position: absolute;
            top: rem(-10);
            right: rem(-10);
            bottom: rem(-10);
            left: rem(-10);
            background-size: cover;
            background-position: 50% 50%;
            filter: blur(rem(20));
        }
        .cover {
            position: absolute;
            left: rem(18);
            top: rem(54);
            width: rem(120);
            height: rem(120);
            border-radius: rem(4);
            background-size: cover;
            background-position: 50% 50%;
            .playCount {
                position: absolute;
                right: rem(2);
                top: rem(4);
                font-size: rem(12);
                color: #f1f1f1;
                &:before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translate(rem(-13), -50%);
                    width: rem(10);
                    height: rem(10);
                    border: 1px solid white;
                }
            }
        }
        .title {
            position: absolute;
            left: rem(148);
            right: rem(40);
            top: rem(68);
            height: rem(46);
            line-height: rem(23);
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 2;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            font-size: rem(17);
            color: white;
        }
        .author {
            position: absolute;
            left: rem(148);
            top: rem(141);
            font-size: 0;
            white-space: nowrap;
            .avatar {
                height: rem(20);
                width: rem(20);
                background-size: cover;
                background-position: 50% 50%;
                display: inline-block;
                vertical-align: middle;
                border-radius: 50%;
            }
            .name {
                display: inline-block;
                line-height: rem(20);
                vertical-align: middle;
                margin-left: rem(6);
                max-width: rem(160);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: white;
                font-size: rem(13);
                font-weight: 200;
            }
        }
    }
}
</style>
