<template>
  <div class="setting-center">
    <el-tabs :tab-position="'left'" :style="`height: ${pageHeight}px`" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全局设置" name="first" v-if="$isPowerShow('globalSettings')">
        <el-empty description="全局设置此功能暂未开放"></el-empty>
      </el-tab-pane>
      <el-tab-pane label="自定义设置" name="second" v-if="$isPowerShow('customSettings')">
        <el-empty description="自定义设置功能暂未开放"></el-empty>
      </el-tab-pane>
      <el-tab-pane label="安全设置" name="third" v-if="$isPowerShow('securitySetting')">
        <security-setting
          ref="securitySetting"
          :data="dataMap[this.activeName]"
          :curSelecedType="'add'"
          @save-add-edit-security-setting="saveSecuritySetting"
        >
        </security-setting>
      </el-tab-pane>
      <el-tab-pane label="登录页轮播图设置" name="forth" v-if="$isPowerShow('imageSetting')" lazy>
        <image-setting
        ref="imageSetting">

        </image-setting>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import securitySetting from "./component/security-setting";
import imageSetting from "./component/image-settings/index.vue";
export default {
  name: "setting-center",
  components: {
    securitySetting,
    imageSetting
  },
  data() {
    return {
      pageHeight: 500,
      activeName: 'third',
      loading: false,
      httpSettingCenterMap:{
        'first':'',
        'second':'',
        'third':'GetLoginSettingSettingCenter'
      },
      dataMap:{
        'first':{},
        'second':{},
        'third':{}
      }
    };
  },
  mounted() {
    this.loadData();
    this.$nextTick(() => {
      this.setHead();
    });
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
      switch (tab.name) {
        case 'first':
          
          break;
        case 'second':
          
          break;
        case 'third':
          
          break;
        case 'forth':
          setTimeout(()=>{
            this.$refs.imageSetting.refresh()
          },60)
          break;  
      }
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = {};
      this.$client[this.httpSettingCenterMap[this.activeName]](params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.dataMap[this.activeName] = res.context
            setTimeout(() =>{
              switch (this.activeName) {
                case 'third':
                  this.$refs.securitySetting.setSecuritySettingData(this.dataMap[this.activeName])
                  break;
  
                default:
                  break;
              }
            },500)
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    // 保存安全设置
    saveSecuritySetting(form) {
      this.$client.SetLoginSettingSettingCenter(form)
      .then(res => {
        if (res.head.result == "200") {
          this.loadData();
          this.$message({
            showClose: true,
            message: "安全设置保存成功",
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
      })
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        this.pageHeight = this.$el.offsetHeight;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.setting-center {
  width: 100%;
  height: 100%;
}
</style>
