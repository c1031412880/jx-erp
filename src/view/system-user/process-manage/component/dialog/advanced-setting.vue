<template>
  <div class="advanced-container">
    <el-tabs tab-position="left" v-model="activeName">
      <el-tab-pane label="流程设置" name="process">
        <Process ref="process" tabName="process" :object_id="object_id" :formData="advancedInfo"/>
      </el-tab-pane>
      <!-- <el-tab-pane label="展示设置" name="presentation"></el-tab-pane>
      <el-tab-pane label="提醒设置" name="remind"></el-tab-pane>
      <el-tab-pane label="权限设置" name="jurisdiction"></el-tab-pane> -->
    </el-tabs>
  </div>
</template>
<script type="text/ecmascript-6">
import Process from '../setting/process'
export default {
  props: ["tabName","advancedInfo", 'object_id'],
  data() {
    return {
      activeName: 'process'
    };
  },
  components: {Process},
  created() {
  },
  methods: {
    // 给父级页面提供得获取本页数据得方法
    getData() {
      return new Promise((resolve, reject) => {
        const getCmpData = name => this.$refs[name].getData()
        let p1 = getCmpData('process')
        resolve({ formData: p1.formData, target: this.tabName })
      });
    }
  }
};
</script>
<style lang="stylus" scoped>
  .advanced-container {
    width: 800px;
    height: calc(100% - 5px);
    margin: auto;
    background: white;
    padding: 16px;
  }
</style>>

