<template>
  <div class="login-container">
   
  </div>
</template>

<script>
export default {
  data() {
    return {
    };

  },
  watch: {
    $route: {
      handler: function (route) {
        let token = route.query.token
        let url = route.query.url
        // 中台 token 免登
        if (!!token) {
          this.$store.dispatch("getUserInfo",{userInfo: '',token:token}).then(res => {
            localStorage.setItem('centerUrl',url)
            // 中台token 免登   token丢失 退回中台页面
            localStorage.setItem('FreeLogin',true)
            // 创建一个新的 URL，但不替换当前的 URL，也不刷新页面
            let newUrl = `${window.location.origin}/#/login_noToken`;
            // 使用 pushState 替换当前的 URL，但不刷新页面
            window.history.pushState({}, '', newUrl);
            
            this.loginDataMiddleground(token)
            this.$router.push({ path: "/" });
          })
        } else {
          localStorage.setItem('FreeLogin',false)
          localStorage.setItem('centerUrl','')
        }
      },
      immediate: true,
    },
  },
  mounted(){
  },
  methods: {
    // 登录中台获取中台应用、用户信息 、再初始化中台信息
    loginDataMiddleground(token,username,password) {
      this.$setDataCenterRequestConfig({
        url: window.newHttpConfig.login_url,
        excel_url: window.newHttpConfig.excel_url,
        tenant_code: 'jxgj',
        // user_name: username.trim(),
        // password: md5(password),
        app_key: "erp-web,erp-app",
        token:token,
      })
    },
  },
};
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
}
</style>
