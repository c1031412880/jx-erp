<template>
  <div class="login-container" v-loading="visitLoading">
    <div v-swiper:mySwiper="swiperOptions" ref="mySwiper" style="width: 100%; height: 100%">
      <div class="swiper-wrapper">
        <div class="swiper-slide" :key="item.id" v-for="item in backgroundImages">
          <img :src="item.url" style="width: 100%; height: 100%" />
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
    <div class="login-body">
      <div class="body-right">
        <div class="body-form-title">
          <img src="../../assets/bg/logo.png" class="icon" />
          <div class="content">
            <div class="form-title">综合信息管理系统</div>
            <div class="label">Information System Platform</div>
          </div>
        </div>
        <!--<h3 class="title">电 子 站 牌 管 理 系 统</h3>-->
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.Username"
              name="username"
              type="text"
              auto-complete="on"
              placeholder="用户名"
              @blur="loginForm.Username = $event.target.value"
            >
              <span slot="prefix" class="svg-container">
                <svg-icon icon-class="user" />
              </span>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :type="pwdType"
              v-model="loginForm.Password"
              name="password"
              auto-complete="on"
              placeholder="密码"
              @keyup.enter.native="showPhotoValidation"
            >
              <span slot="prefix" class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <span slot="suffix" class="show-pwd" @click="showPwd">
                <svg-icon icon-class="eye-none" v-if="pwdType === 'password'" />
                <svg-icon icon-class="eye" v-else />
              </span>
            </el-input>
          </el-form-item>
          <el-form-item style="text-align: right">
            <!-- <el-button type="texx`t">忘记密码?</el-button> -->
          </el-form-item>
          <el-form-item>
            <el-button
              round
              :loading="loading"
              type="primary"
              style="width: 100%"
              @click.native.prevent="showPhotoValidation"
            >
              登录
            </el-button>
          </el-form-item>

          <!-- <el-form-item class="show-flex-box-r show-flex-center">
            <el-popover
              v-for="(item,index) in appImageList"
              placement="bottom"
              width="120"
              title=""
              class="download-app-box-popover"
              trigger="hover"
            >
              <div class="show-flex-box-c" style="align-items: center;">
                <div style="height: 125px ">
                  <el-image
                    style="width: 125px; height: 100%;flex-shrink: 0;"
                    :src="item.url"
                    fit="contain"
                  ></el-image>
                </div>
                <span
                  style="font-size: 12px; font-weight: bold;"
                  >{{ item.title }}</span
                >
              </div>
              <el-button slot="reference" circle class="pop-button">
                <svg-icon :icon-class="item.icon" />
              </el-button>
            </el-popover>
            
          </el-form-item> -->
        </el-form>
      </div>
    </div>
    <div class="image-box">
      <div
        class="show-flex-box-c"
        style="align-items: center; background: #fff; width: 140px; border-radius: 5px"
        v-for="(item, index) in appImageList"
        :key="index"
      >
        <div style="height: 125px">
          <el-image
            style="width: 125px; height: 100%; flex-shrink: 0"
            :src="item.url"
            fit="contain"
          ></el-image>
        </div>
        <span style="font-size: 12px; font-weight: bold">{{ item.title }}</span>
      </div>
    </div>
    <unified-loading v-show="unifiedLoading"></unified-loading>
    <div>
      <information-dialog
        ref="informationDialog"
        :dialogBool.sync="informationDialogShow"
      ></information-dialog>
      <photo-validation
        ref="photoValidationRef"
        :dialogVisible.sync="photoValidationVisible"
        @success-photo-valid="successPhotoValid"
      ></photo-validation>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import { isvalidUsername } from '@/utils/validate'
import { getBrowserNameVersion } from '@/utils/getBrowserVersion'
import informationDialog from './information-dialog'
import photoValidation from './photo-validation'
//平阳
import p1 from '../../assets/download-app-images/first.png'
import p2 from '../../assets/download-app-images/second.png'
import p3 from '../../assets/download-app-images/third.png'
//丽水
import p4 from '../../assets/download-app-images/fourth.png'
import xiaochengxu from '../../assets/download-app-images/jxxcx.jpg'
import fuwuhao from '../../assets/download-app-images/fwh.jpg'
import unifiedLoading from './unified-loading'
import { md5 } from '@/api/md5'

import defaultBg from '../../assets/bg/bg.png'
export default {
  components: {
    unifiedLoading,
    informationDialog,
    photoValidation,
    Swiper,
    SwiperSlide
  },
  directives: {
    swiper: directive
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      backgroundImages: [],
      loginForm: {
        Username: '',
        Password: ''
      },
      loginRules: {
        Username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        Password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      visitLoading: false,
      pwdType: 'password',
      redirect: undefined,
      informationDialogShow: false,
      unifiedLoading: false,
      appImageList: [
        {
          id: 1,
          title: '嘉兴公交掌上办',
          url: xiaochengxu,
          icon: 'xcx'
        },
        {
          id: 2,
          title: '嘉兴公交公众号',
          url: fuwuhao,
          icon: 'gzh'
        }
      ],

      photoValidationVisible: false,
      swiperOptions: {
        autoplay: {
          delay: 5000,
          disableOnInterraction: false
        },
        loop: true,
        simulateTouch: false,
        pagination: {
          el: '.swiper-pagination'
        }
      }
    }
  },
  // watch: {

  //   $route: {
  //     handler: function (route) {
  //       let token = route.query.token
  //       let url = route.query.url
  //       // 中台 token 免登
  //       if (!!token) {
  //         this.$store.dispatch("getUserInfo",{userInfo: '',token:token}).then(res => {
  //           localStorage.setItem('centerUrl',url)
  //           // 中台token 免登   token丢失 退回中台页面
  //           localStorage.setItem('FreeLogin',true)
  //           // 创建一个新的 URL，但不替换当前的 URL，也不刷新页面
  //           let newUrl = `${window.location.origin}/#/login`;
  //           // 使用 pushState 替换当前的 URL，但不刷新页面
  //           window.history.pushState({}, '', newUrl);

  //           this.loginDataMiddleground(token)
  //           this.$router.push({ path: "/" });
  //         })
  //       } else {
  //         localStorage.setItem('FreeLogin',false)
  //         localStorage.setItem('centerUrl','')
  //       }
  //     },
  //     immediate: true,
  //   },
  // },

  created() {
    this.getLoginImages()
  },
  mounted() {
    // 在组件挂载后，初始化Swiper实例
    // this.loginForm.version = getBrowserNameVersion()
    // console.log(this.loginForm.version)
  },
  methods: {
    getLoginImages() {
      this.$client
        .getBackgroundImages({})
        .then(res => {
          if (res.head.result == '200') {
            this.backgroundImages = res.context
          } else {
            this.backgroundImages = [defaultBg]
          }
        })
        .catch(err => {})
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    showPhotoValidation() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.photoValidationVisible = true
        }
      })
    },
    successPhotoValid() {
      this.photoValidationVisible = false
      this.handleLogin()
    },
    handleLogin() {
      // if(this.loginForm.password == '1234'){
      //   this.informationDialogShow = true;
      // }

      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('getUserInfo', { userInfo: this.loginForm, token: '' })
            .then(req => {
              localStorage.setItem('FreeLogin', false)
              this.loading = false
              this.visitLoading = false
              let context = req.context
              // this.loginDataMiddleground(this.loginForm.Username,this.loginForm.Password)
              this.loginDataMiddleground(
                req.token,
                this.loginForm.Username,
                this.loginForm.Password
              )
              console.log(context)
            })
            .catch(err => {
              this.loading = false
              this.$message({ type: 'error', message: err ? err : '连接到服务器失败！' })
            })
        } else {
          this.loading = false
          console.log('登录失败!!')
          return false
        }
      })
    },
    // 登录中台获取中台应用、用户信息 、再初始化中台信息
    loginDataMiddleground(token, username, password) {
      this.$setDataCenterRequestConfig({
        url: window.newHttpConfig.login_url,
        excel_url: window.newHttpConfig.excel_url,
        upload_url: process.env.NODE_ENV == 'production' ? window.newHttpConfig.upload_url : '',
        tenant_code: 'jxgj',
        // user_name: username.trim(),
        // password: md5(password),
        app_key: 'erp-web,erp-app',
        token: token
      })
        .then(res => {
          let isInitPassword = res.isInitPassword
          let notValid = this.$checkIsUnqualifiedPassword(password)
          if (notValid) this.$refs.informationDialog.type = 2
          if (isInitPassword) this.$refs.informationDialog.type = 1
          if (isInitPassword || notValid) {
            this.informationDialogShow = true
          } else {
            // setTimeout(() => {
            //   this.$store.dispatch("ToggleSideBar");
            //   if (!this.$store.getters.sidebar.opened) {
            //     setTimeout(() => {
            //       this.$store.dispatch("ToggleSideBar");
            //     }, 100);
            //   }
            // }, 100);
            this.$router.push({ path: '/' })
          }
        })
        .catch(err => {
          this.$message({ type: 'error', message: err.msg })
          console.log('err', err)
        })
    }
    // checkOpen() {
    //   this.informationDialogShow = true;
    // },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #999999;
$light_gray: #606266;

/* reset element-ui css */
/*.login-container {
  .el-input {
    display: inline-block;
    background: #DEDEDE;
    border-radius: 6px;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
        -webkit-border-radius: 6px;
      }
    }
  }
  .el-form-item {
    !*border: 1px solid rgba(255, 255, 255, 0.1);*!
    !*background: rgba(0, 0, 0, 0.1);*!
    border-radius: 5px;
    color: #454545;
  }
}*/
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  .bg-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .login-body {
    position: absolute;
    z-index: 9999;
    top: 50%;
    left: 80%;
    width: 430px;
    height: 520px;
    transform: translate(-50%, -50%);
    display: flex;

    .body-right {
      flex: 1;
      height: 100%;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 6px;
      .body-form-title {
        width: 274px;
        height: 44px;
        margin: 52px 73px 46px 73px;
        display: flex;
        .icon {
          width: auto;
          height: 44px;
          flex: 0 0 44px;
        }
        .content {
          flex: 1;
          margin-left: 10px;
          height: 100%;
          text-align: center;
          .form-title {
            font-size: 22px;
            font-weight: 700;
            color: #333333;
            margin-bottom: 2px;
          }
          .label {
            line-height: 20px;
            font-size: 16px;
            color: #999999;
          }
        }
      }
      .login-form {
        margin: 0 65px;
      }
    }
  }
  .image-box {
    position: absolute;
    z-index: 9999;
    top: calc(45% + 215px);
    left: 80%;
    width: 325px;
    height: 145px;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: space-between;
  }
  .svg-container {
    padding: 4px;
    color: $dark_gray;
    vertical-align: middle;
    display: inline-block;
  }
  .title {
    padding: 18px 30px;
    font-size: 28px;
    color: $light_gray;
    margin: 9px auto 0px auto;
    text-align: center;
    font-weight: 400;
    font-family: 'PingFang SC';
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.download-app-box-popover {
  padding: 0 !important;
}
.pop-button {
  background: rgba(255, 255, 255, 0.6);
  border: 0;
  padding: 0 !important;
  margin-right: 20px;
  .svg-icon {
    font-size: 35px;
    border-radius: 50%;
    padding: 5px;
  }
  &:hover {
    .svg-icon {
      background: rgba(255, 255, 255, 1);
    }
  }
}
</style>
