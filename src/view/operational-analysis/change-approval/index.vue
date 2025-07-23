<template>
  <change-approval-data-center/>
</template>
<script type="text/ecmascript-6">
  export default {
    name: "change-approval",
    mounted() {
      this.getAuthority('change-approval')
    },
    methods: {
    // 获取权限 
      getAuthority(name) {
        let authority = this.$store.getters.newRoutesMain
        let L = Object.getOwnPropertyNames(authority).length
        if (L == 1) {
          this.$nextTick(() => {
            // 监听路由接口   路由接口完成后 来获取相对于的 权限
            eventOn.$on('update-router', () => {
              this.getAuthority()
            })
          });
        }
        if (L > 1) {
          let code = this.$route.meta.code
          let menu_func = authority[code].menu_func
          if (menu_func.length > 0) {
            let codes = []
            menu_func.forEach(element => {
              let code = element.code.split('.')[1]
              codes.push(code)
            })
            this.$setDataCenterPageKeys(name,codes)
          }
        }
      },
    },
  }
</script>