<template>
  <div class="check-management">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="添加考核" name="first" lazy>
        <cor-box :height="carHeight">
          <assessment-box></assessment-box>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane :label="`待发布(${nums})`" name="second">
        <cor-box :height="carHeight">
          <release-box @out-num="getNum" ref="releaseBox"></release-box>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import corBox from './cor-box'
import assessmentBox from './assessment-box/index'
import releaseBox from './release-box/index'
export default {
  name: "check-management",
  components: {
    corBox,
    assessmentBox,
    releaseBox,
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
        this.$refs.releaseBox.setHead()
      }
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.check-management {
  width: 100%;
  height: 100%;
}
</style>
