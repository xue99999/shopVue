<template>
    <div>
       <van-nav-bar
        title="登陆"
        left-text="返回"
        left-arrow
        @click-left="goBack"
        />

        <div class="register-panel">
        <van-field
            v-model="username"
            label="用户名"
            icon="clear"
            placeholder="请输入用户名"
            required
            @click-icon="username = ''"
        />

        <van-field
            v-model="password"
            type="password"
            label="密码"
            placeholder="请输入密码"
            required
        />
        <div class="register-button">
            <van-button type="primary" :loading="openLoading" @click="loginAction" size="large">马上注册</van-button>
        </div>
       </div>

    </div>
</template>

<script>
    import axios from 'axios'
    import url from '@/serviceAPI.config.js'
    import { Toast } from 'vant'

    export default {
        data() {
            return {
                username: '',
                password: '',
                openLoading: false, // 是否开启loading
                usernameErrorMsg:'',   //当用户名出现错误的时候
                passwordErrorMsg:'',   //当密码出现错误的时候
            }
        },
        created() {
            if (localStorage.userInfo) {
                Toast.success('您已经登录')
                this.$router.push('/')
            }
        },
        methods: {
            goBack() {
                this.$router.go(-1)
            },
            loginAction() {
                this.checkForm() && this.axiosLoginUser()
            },
            //*********axios注册用户方法********
            axiosLoginUser(){
                this.openLoading = true
                axios({
                    url: url.loginUser,
                    method: 'post',
                    data:{
                        userName:this.username,
                        password:this.password
                    }
                })
                  .then(response => {
                      console.log(response)
                      if (response.data.code == 200 && response.data.message) {
                        new Promise((resolve, reject) => {
                            localStorage.userInfo = { userName: this.username }
                            setTimeout(() => {
                                resolve()
                            }, 500)
                        })
                            .then(() => {
                                Toast.success("登录成功")
                                this.$router.push('/')
                            })
                            .catch(err => {
                                Toast.fail('登录状态保存失败')
                                console.log(err)
                            })
                      } else {
                        Toast.fail('登录失败')
                        this.openLoading = false
                      }
                  })
                  .catch((error) => {
                      console.log(error)
                      Toast.fail('登陆失败')
                      this.openLoading = false
                  })
            },
            // 前端校验表单数据
            checkForm() {
              let isOk = true
              if (this.username.length < 5) {
                this.usernameErrorMsg = '用户名不能小于5位'
              } else {
                this.usernameErrorMsg = ''
              }

              if (this.password.length < 6) {
                this.passwordErrorMsg = '密码不能少于6位'
                isOk =  false
              } else {
                this.passwordErrorMsg = ''
              }
              return isOk
            }
        },
    }
</script>

<style scoped>
    .register-panel{
        width:96%;
        border-radius: 5px;
        margin:20px auto;
        padding-bottom:50px;
    }
    .register-button{
        padding-top:10px;
    }
</style>
