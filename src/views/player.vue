<template>
    <div class="player">
        <div class="preview">
            <div class="cover"></div>
            <div class="info">
                <p class="name">富士山下</p>
                <p class="singer">陈奕迅</p>
            </div>
            <span class="btn"></span>
            <span class="songList"></span>
        </div>
    </div>
</template>
<script>
export default {
    data: function () {
        return {
            msg: 'player'
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '~@/style/index.styl'
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
            border: 1px solid;
            vertical-align: middle;
            margin-left: rem(36);
            margin-right: rem(20);
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
            border: 1px solid;
            right: rem(120);
            bottom: rem(34);
        }
        .songList {
            position: absolute;
            width: rem(64);
            height: rem(64);
            border: 1px solid;
            right: rem(19);
            bottom: rem(34);
        }
    }
}
</style>
