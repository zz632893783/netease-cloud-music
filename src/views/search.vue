<template>
    <div class="search">
        <div class="inputBox">
            <span class="backBtn" v-on:click="back"></span>
            <input class="keywords" v-model="queryBody.keywords" placeholder="请输入搜索关键词" />
            <span class="clearBtn" v-on:click="queryBody.keywords = ''" v-show="queryBody.keywords"></span>
        </div>
        <div class="container">
            <div class="hotSeach" v-show="!queryBody.keywords && !searchResult.length">
                <h4 class="title">热门搜索</h4>
                <div class="item" v-for="(item, index) in hotSeach" v-bind:key="index" v-on:click="search(item.first)">
                    {{item.first}}
                </div>
            </div>
            <div class="empty" v-show="queryBody.keywords && !searchResult.length">
                未找到任何歌曲或歌单
            </div>
        </div>
    </div>
</template>
<script>
import commonRequest from '@/api/commonRequest.js'
export default {
    data: function () {
        return {
            queryBody: {
                keywords: ''
            },
            hotSeach: [],
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
                keywords: this.queryBody.keywords
            }
            this.$store.commit('setLoading', 1)
            commonRequest('/search', requestBody).then(res => {
                this.$store.commit('setLoading', -1)
                if (res.status === 200) {
                    // this.hotSeach = res.data.result.hots
                    console.log(res)
                }
            }).catch(error => {
                this.$store.commit('setLoading', -1)
                console.log(error)
            })
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
    .container {
        position: absolute;
        left: 0;
        right: 0;
        top: rem(94);
        bottom: 0;
        overflow-y: auto;
        background-color: #f2f3f4;
        padding: 0 rem(36);
        .hotSeach {
            position: relative
            font-size: 0;
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
            }
        }
        .empty {
            font-size: rem(28);
            color: #2c3e50;
            text-align: center;
            line-height: rem(200);
        }
    }
}
</style>
