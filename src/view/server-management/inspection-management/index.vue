<template>
  <div class="inspection-management">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="稽查登记" name="first" lazy>
        <cor-box class="pane-box" :height="carHeight">
          <manage-box></manage-box>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="车辆稽查情况" name="second">
        <cor-box class="pane-box" :height="carHeight">
          <statistics-box ref="statisticsBox"></statistics-box>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import corBox from './cor-box'
import manageBox from './manage-box/index'
import statisticsBox from './statistics-box/index'
export default {
  name: "inspection-management",
  components: {
    corBox,
    manageBox,
    statisticsBox,
  },
  data() {
    return {
      activeName:"first",
      carHeight: 500,
      nums: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  methods: {
    // 计算表格高度 和初始化表头
    setHead() {
      this.carHeight = this.$el.offsetHeight - 55
    },
    getNum(nums) {
      this.nums = nums
    },
    handleClick() {
      if (this.activeName == 'second') {
        this.$refs.statisticsBox.setHead()
      }
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.inspection-management {
  width: 100%;
  height: 100%;
  .pane-box {
    width: 100%;
  }
}
</style>
