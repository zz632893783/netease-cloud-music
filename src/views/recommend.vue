<template>
    <div class="recommend">
        <div class="recommendBanner">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item, index) in bannerList" v-bind:key="index">
                    <div class="cover" v-bind:style="`background-image: url(${item.imageUrl});`"></div>
                </div>
            </div>
        </div>
        <h4 class="sectionTitle">推荐歌单</h4>
        <ul class="songList">
            <li class="listItem" v-for="(item, index) in list" v-bind:key="index" v-on:click="viewDetail(item)">
                <div class="cover" v-bind:style="`background-image: url(${item.picUrl});`"></div>
                <p class="desc">{{item.name}}</p>
            </li>
        </ul>
        <div class="nomore">已经到底了~</div>
    </div>
</template>
<script>
import commonRequest from '@/api/commonRequest.js'
import Swiper from 'swiper'
export default {
    data: function () {
        return {
            msg: 'recommend',
            bannerList: [],
            list: [],
            swiperObj: null
        }
    },
    // /recommend/resource
    methods: {
        getDailyRecommend: function () {
            let requestBody = {}
            this.$store.commit('setLoading', 1)
            commonRequest('/banner', requestBody).then(res => {
                if (res.status === 200) {
                    this.$store.commit('setLoading', -1)
                    this.bannerList = res.data.banners.slice(0, 10)
                    this.$nextTick(() => {
                        this.initBanner()
                    })
                }
            }).catch(error => {
                this.$store.commit('setLoading', -1)
                console.log(error)
            })
        },
        getRecommendList: function () {
            let requestBody = {
                limit: 200
            }
            this.$store.commit('setLoading', 1)
            // commonRequest('/personalized', requestBody).then(res => {
            commonRequest('/recommend/resource', requestBody).then(res => {
                if (res.status === 200) {
                    this.$store.commit('setLoading', -1)
                    // this.list = res.data.result
                    this.list = res.data.recommend
                }
            }).catch(error => {
                this.$store.commit('setLoading', -1)
                console.log(error)
            })
        },
        initBanner: function () {
            this.swiperObj = new Swiper('.recommendBanner', {
                autoplay: true,
                loop: true
            })
        },
        viewDetail: function (item) {
            this.$router.push({
                path: '/songListDetail',
                query: {
                    id: item.id
                }
            })
        }
    },
    mounted: function () {
        this.getRecommendList()
        this.getDailyRecommend()
    }
}
</script>
<style lang="stylus" scoped>
@import '~@/style/index.styl'
.recommend {
    .recommendBanner {
        height: rem(160);
        display: block;
        .cover {
            width: rem(400);
            height: rem(160);
            background-size: cover;
            background-position: 50% 50%;
        }
    }
    .sectionTitle {
        height: rem(60);
        line-height: rem(60);
        padding-left: rem(4);
        font-size: rem(12);
    }
    .songList {
        margin: 0 rem(10);
        font-size: 0;
        .listItem {
            display: inline-block;
            width: rem(120);
            margin-right: rem(10);
            &:nth-child(3n) {
                margin-right: 0;
            }
            .cover {
                display: block;
                width: rem(120);
                height: rem(120);
                border-radius: rem(4);
                background-size: cover;
                background-position: 50% 50%;
            }
            .desc {
                height: rem(52);
                line-height: rem(16);
                font-size: rem(12);
                color: #2e3030;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 3;
                display: -webkit-box;
                -webkit-box-orient: vertical;
            }
        }
    }
    .nomore {
        font-size: rem(14);
        color: #666;
        text-align: center;
        // height: rem(40);
        line-height: rem(40);
        padding-bottom: rem(20);
    }
}
</style>
