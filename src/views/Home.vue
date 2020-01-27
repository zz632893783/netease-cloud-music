<template>
    <div class="home">
        <div class="header">
            <div class="headRow">
                <span class="menuBtn">
                    <i></i>
                    <i></i>
                    <i></i>
                </span>
                <h4 class="projectName">音悦台</h4>
                <span class="searchBtn"></span>
            </div>
            <nav>
                <div v-for="(item, index) in navList" v-bind:class="`navItem${activeNavIndex === index ? ' active' : ''}`" v-bind:key="index"><span v-on:click="setActiveNav(index)">{{item.name}}</span></div>
            </nav>
        </div>
        <div class="section">
            <keep-alive>
                <router-view />
            </keep-alive>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src

export default {
    name: 'home',
    components: {
    },
    data: function () {
        return {
            msg: 'home',
            activeNavIndex: 0,
            navList: [{
                name: '推荐'
            }, {
                name: '歌手'
            }, {
                name: '排行榜'
            }]
        }
    },
    methods: {
        setActiveNav: function (index) {
            this.activeNavIndex = index
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '~@/style/index.styl'
.home {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
    >.header {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: rem(89 * 2);
        background-color: #d44339;
        .headRow {
            height: rem(50 * 2);
            line-height: rem(50 * 2);
            display: block;
            position: relative;
            margin-bottom: rem(14 * 2);
            .menuBtn {
                position: absolute;
                left: rem(11 * 2)
                width: rem(18 * 2);
                top: 50%;
                transform: translate(0, -50%);
                i {
                    display: block;
                    height: rem(2 * 2);
                    background-color: white;
                    margin-bottom: rem(4 * 2);
                    &:nth-last-child(1) {
                        margin-bottom: 0;
                    }
                }
            }
            .projectName {
                display: block;
                width: 100%;
                text-align: center;
                color: white;
                font-size: rem(18 * 2);
                font-weight: 200;
            }
            .searchBtn {
                position: absolute;
                right: rem(11 * 2);
                top: 50%;
                transform: translate(0, -50%);
                width: rem(22 * 2);
                height: rem(22 * 2);
                background-image: url('~@/assets/img/search.png');
                background-size: 100% 100%;
            }
        }
        nav {
            display: block;
            font-size: 0;
            .navItem {
                display: inline-block;
                width: 33.33%;
                line-height: rem(12 * 2);
                text-align: center;
                span {
                    position: relative;
                    color: white;
                    font-weight: 200;
                    // font-size: rem(12 * 2);
                    font-size: rem(27);
                    &:before {
                        content: '';
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        height: rem(2 * 2);
                        background-color: white;
                        transform: translate(0, rem(6 * 2));
                        display: none;
                    }
                }
                &.active {
                    span {
                        font-weight: 600;
                        &:before {
                            display: block;
                        }
                    }
                }
            }
        }
    }
    >.section {
        position: absolute;
        top: rem(89 * 2);
        right: 0;
        bottom: 0;
        left: rem(0);
        overflow-x: hidden;
    }
}
</style>
