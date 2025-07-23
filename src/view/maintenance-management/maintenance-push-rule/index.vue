<template>
  <div class="maintenance-push-rule">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="推送规则设置" name="first">
        <push-rule-child></push-rule-child>
      </el-tab-pane>
      <el-tab-pane label="维修全局设置" name="second">
        <maintenance-global-setting></maintenance-global-setting>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import pushRuleChild from './component/push-rule-child'
import maintenanceGlobalSetting from './component/maintenance-global-setting'
export default {
  name: "maintenance-push-rule",
  components: {pushRuleChild,maintenanceGlobalSetting},
  data() {
    return {
      activeName: 'first',
    }
  },
  mounted() {},
  computed: {},
  methods: {
    handleClick(tab, event) {
    },
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.maintenance-push-rule {
  width: 100%;
  height: 100%;
  /deep/ .el-tabs {
    height: 100%;
    .el-tabs__content {
      height: calc(100% - 38.7px);
      .el-tab-pane {
        height: 100%;
      }
    }
  }
}
</style>