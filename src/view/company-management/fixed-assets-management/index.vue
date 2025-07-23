<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="固定资产列表" name="first">
      <fixed-assets-list></fixed-assets-list>
    </el-tab-pane>
    <el-tab-pane label="部门资产列表" name="second">
      <dept-assets-list :currentType="activeName"></dept-assets-list>
    </el-tab-pane>
  </el-tabs>
</template>

<script type="text/ecmascript-6">
import fixedAssetsList from './fixed-assets-list'
import deptAssetsList from './dept-assets-list'
export default {
  name: 'fixed-assets-management',
  components: {
    fixedAssetsList,
    deptAssetsList
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-tabs
  width: 100%
  height: 100%
  /deep/ .el-tabs__content
    height: calc(100% - 57px)
    width: 100%
  /deep/ .el-tab-pane
    height: 100%
    width: 100%
</style>