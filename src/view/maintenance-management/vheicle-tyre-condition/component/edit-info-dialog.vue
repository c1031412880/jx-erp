<template>
  <tr-dialog 
    :visible="dialogBool" 
    :title="showTitle" 
    :width="'860px'"
    @before-close="dialogClose">
    <el-tabs v-model="activeName">
      <el-tab-pane label="车辆轮胎信息" name="first">
        <veh-tyre-info 
          ref="vehTyreInfo" 
          @update-load="updateLoadData"
        ></veh-tyre-info>
      </el-tab-pane>
      <el-tab-pane label="使用轮胎记录" name="second">
        <tyre-used-info 
          ref="tyreUsedInfo" 
        ></tyre-used-info>
      </el-tab-pane>
    </el-tabs>
  </tr-dialog>
</template>

<script type="text/ecmascript-6">
import tyreUsedInfo from './tyre-used-info';
import vehTyreInfo from './veh-tyre-info'
export default {
  components: {
    tyreUsedInfo,
    vehTyreInfo,
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      activeName: 'first',
      showTitle:'编辑车辆轮胎',
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.resetData();
        this.$parent.selectId = 0
        Object.assign(this.$data, this.$options.data());
      }
    },
  },
  mounted() {},
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    updateLoadData() {
      this.$emit('on-load');
    },
    resetData(){
      setTimeout(() => {
        this.$refs['vehTyreInfo'].resetData()  // 基础信息清除
        this.$refs['tyreUsedInfo'].resetData()  // 安装车辆信息清除
      },60)
    },
    // 编辑时数据回显
    setData(val){
      setTimeout(() => {
        this.$refs['vehTyreInfo'].setData(val)
        this.$refs['tyreUsedInfo'].setData(val);
      }, 60);
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
