<template>
    <div class="login">
        <span class="logo"></span>
        <div class="loginBox">
            <input class="username" v-model="username" placeholder="请输入手机号码" />
            <div class="passwordOuter">
                <input class="password" type="password" v-model="password" placeholder="请输入密码" />
            </div>
            <span class="loginBtn" v-on:click="login">登录</span>
            <div class="otherLoginOption">
                <span class="forgetPassword">忘记密码</span>
                <span class="registry">注册</span>
            </div>
        </div>
    </div>
</template>
<script>
import commonRequest from '@/api/commonRequest.js'
import { setCookie } from '@/tools/cookie.js'
export default {
    data: function () {
        return {
            msg: 'login',
            username: '',
            password: ''
        }
    },
    methods: {
        login: function () {
            if (!this.username) {
                return console.log('手机号不能为空')
            }
            if (!this.password) {
                return console.log('密码不能为空')
            }
            let requestBody = {
                phone: '18367806291',
                password: '123qweasdzxc'
            }
            commonRequest('/login/cellphone', requestBody).then(res => {
                if (res.status === 200) {
                    setCookie('token', res.data.token)
                    setCookie('userId', res.data.userId)
                    setCookie('nickname', res.data.nickname)
                }
            }).catch(error => {
                console.log(error)
            })
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '~@/style/index.styl'
.login {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #dc2c1f;
    .logo {
        position: absolute;
        width: rem(75);
        height: rem(75);
        border-radius: 50%;
        background-size: 100% 100%;
        background-image: url('~@/assets/img/logo.png');
        left: 50%;
        top: rem(100);
        transform: translate(-50%);
    }
    .loginBox {
        position: absolute;
        left: 50%;
        top: rem(250);
        transform: translate(-50%, 0);
        .passwordOuter {
            margin-bottom: rem(16);
        }
        .username {
            margin-bottom: rem(16);
        }
        .username, .password {
            line-height: rem(43);
            height: rem(43);
            width: rem(260);
            border-radius: rem(22.5);
            border: none;
            display: block;
            outline: none;
            font-size: rem(17);
            padding: 0 rem(10);
        }
        .loginBtn {
            margin-bottom: rem(16);
            display: block;
            line-height: rem(43);
            height: rem(43);
            border: rem(0.7) solid #e66b63;
            text-align: center;
            font-size: rem(17);
            color: white;
            border-radius: rem(22.5);
            margin-bottom: rem(16);
        }
        .otherLoginOption {
            font-size: 0;
            text-align: center;
            .forgetPassword, .registry {
                font-size: rem(17);
                color: white;
                width: 35%;
                display: inline-block;
                text-align: center;
            }
        }
    }
}
</style>
