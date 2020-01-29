<template>
    <div class="singer">
        <div class="defaultClassification">
            <span class="title">分类(默认热门):</span>
            <span v-bind:class="`item${queryBody.typeCode === item.code ? ' active' : ''}`" v-for="(item, index) in typeList" v-bind:key="index" v-on:click="setType(item.code)">{{item.name}}</span>
        </div>
        <div class="initials">
            <span class="title">首字母:</span>
            <span v-bind:class="`item${queryBody.initials === String.fromCharCode(96 + index) ? ' active' : ''}`" v-for="index in 26" v-bind:key="index" v-on:click="setInitials(String.fromCharCode(96 + index))">{{String.fromCharCode(96 + index).toUpperCase()}}</span>
        </div>
        <div class="sinterList" ref="sinterList" v-on:scroll="scrollFunc">
            <div class="item" v-for="(item, index) in singerList" v-bind:key="index" v-on:click="viewSingerDetail(item)">
                <div class="avatar" v-bind:style="`background-image: url(${item.img1v1Url});`"></div>
                <span class="name">{{item.name}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import commonRequest from '@/api/commonRequest.js'
export default {
    data: function () {
        return {
            msg: 'singer',
            queryBody: {
                typeCode: '',
                initials: '',
                offset: 0,
                pageSize: 30
            },
            typeList: [{
                name: '入驻歌手',
                code: '5001'
            }, {
                name: '华语男歌手',
                code: '1001'
            }, {
                name: '华语女歌手',
                code: '1002'
            }, {
                name: '华语组合/乐队',
                code: '1003'
            }, {
                name: '欧美男歌手',
                code: '2001'
            }, {
                name: '欧美女歌手',
                code: '2002'
            }, {
                name: '欧美组合/乐队',
                code: '2003'
            }, {
                name: '日本男歌手',
                code: '6001'
            }, {
                name: '日本女歌手',
                code: '6002'
            }, {
                name: '日本组合/乐队',
                code: '6003'
            }, {
                name: '韩国男歌手',
                code: '7001'
            }, {
                name: '韩国女歌手',
                code: '7002'
            }, {
                name: '韩国组合/乐队',
                code: '7003'
            }, {
                name: '其他男歌手',
                code: '4001'
            }, {
                name: '其他女歌手',
                code: '4002'
            }, {
                name: '其他组合/乐队',
                code: '4003'
            }],
            singerList: []
        }
    },
    methods: {
        setType: function (code) {
            this.singerList = []
            this.queryBody.typeCode = code
            this.queryBody.initials = ''
            this.queryBody.offset = 0
            this.querySingers()
        },
        setInitials: function (initials) {
            this.singerList = []
            this.queryBody.initials = initials
            this.queryBody.offset = 0
            this.querySingers()
        },
        querySingers: function () {
            let requestBody = {
                cat: this.queryBody.typeCode,
                limit: this.queryBody.pageSize,
                offset: this.queryBody.offset
            }
            if (this.queryBody.initials) {
                requestBody.initial = this.queryBody.initials
            }
            this.$store.commit('setLoading', 1)
            commonRequest('/artist/list', requestBody).then(res => {
                if (res.status === 200) {
                    this.$store.commit('setLoading', -1)
                    this.singerList = [...this.singerList, ...res.data.artists]
                }
            }).catch(error => {
                this.$store.commit('setLoading', -1)
                console.log(error)
            })
        },
        scrollFunc: function () {
            let height = this.$refs.sinterList.scrollTop + parseInt(window.getComputedStyle(this.$refs.sinterList).height)
            let temp = (130 / (750 / 20) * window.innerWidth / 20) * this.singerList.length
            if (temp <= height) {
                this.queryBody.offset = this.queryBody.offset + this.queryBody.pageSize
                this.querySingers()
            }
        },
        viewSingerDetail: function (obj) {
            this.$router.push({
                path: '/singerDetail',
                query: {
                    id: obj.id
                }
            })
        }
    },
    mounted: function () {
        this.querySingers()
    }
}
</script>
<style lang="stylus" scoped>
@import '~@/style/index.styl'
.singer {
    padding-top: rem(12);
    position: relative;
    height: 100%;
    overflow-y: hidden;
    .defaultClassification, .initials {
        line-height: rem(60);
        height: rem(60);
        font-size: 0;
        white-space: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        .title {
            display: inline-block;
            font-size: rem(21);
            color: #858384;
            padding-left: rem(4);
            margin-right: rem(12);
        }
        .item {
            display: inline-block;
            font-size: rem(21);
            color: #242324;
            padding: rem(11) rem(16);
            border-radius: rem(20);
            border: rem(2) solid transparent;
            line-height: normal;
            &.active {
                border: rem(2) solid #d44439;
            }
        }
        &::-webkit-scrollbar {
            // opacity: 0;
            // background-color: red;
            width: 0;
            height: 0;
        }
    }
    .sinterList {
        position: absolute;
        top: rem(130);
        right: 0;
        bottom: 0;
        left: 0;
        overflow-y: auto;
        .item {
            height: rem(130);
            line-height: rem(130);
            border-bottom: rem(2) solid #e3e4e3;
            font-size: 0;
            .avatar {
                width: rem(100);
                height: rem(100);
                border-radius: rem(10);
                display: inline-block;
                vertical-align: middle;
                background-size: cover;
                background-position: 50%;
                margin-left: rem(6);
            }
            .name {
                font-size: rem(21);
                color: #21150c;
                margin-left: rem(40);
                max-width: rem(570);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
</style>
