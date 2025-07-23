<template>
  <div class="employee-care">
    <div v-if="$isPowerShow('set')" style="position: absolute;right: 10px; z-index: 999;">
      <!-- <el-button type="primary" size="mini" v-show="activeName === 'first'">设置生日祝福</el-button> -->
      <el-tooltip class="item" effect="dark" content="设置代办提醒" placement="top-end">
        <el-button @click="setDialogShow = true" type="primary" icon="el-icon-s-tools" size="mini"></el-button>
      </el-tooltip>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="生日关怀" name="first" lazy>
        <div :style="{'height': carHeight + 'px'}">
          <page-data :thing="'过生日'" :activeName="activeName"></page-data>
        </div>
      </el-tab-pane>
      <el-tab-pane label="退休关怀" name="second" lazy>
        <div :style="{'height': carHeight + 'px'}">
          <page-data :thing="'到退休年龄'" :activeName="activeName"></page-data>
        </div>
      </el-tab-pane>
      <el-tab-pane label="合同到期提醒" name="third" lazy>
        <div :style="{'height': carHeight + 'px'}">
          <page-data :thing="'合同到期'" :activeName="activeName"></page-data>
        </div>
      </el-tab-pane>
    </el-tabs>

    <set-reminder-dialog 
      ref="setDialog"
      :dialogBool.sync="setDialogShow"></set-reminder-dialog>
  </div>
</template>

<script>
import pageData from './component/page-data'
import setReminderDialog from './component/set-reminder-dialog'
export default {
  name: 'employee-care',
  components: {
    pageData,
    setReminderDialog,
  },
  data() {
    return {
      carHeight: 500,
      activeName: 'first',
      setDialogShow: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
    })
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 计算表格高度 和初始化表头
    setHead() {
      this.carHeight = this.$el.offsetHeight - 55
    },
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.employee-care {
  height: 100%;
  width: 100%;
}
</style>