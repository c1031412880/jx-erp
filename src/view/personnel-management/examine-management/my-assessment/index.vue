<template>
  <div class="my-assessment">
    <el-tabs v-model="activeName">
      <el-tab-pane label="我的考核" name="first" lazy>
        <cor-box :height="carHeight">
          <assessment-box></assessment-box>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="我的申诉" name="second" lazy>
        <cor-box :height="carHeight">
          <appeal-box ref="appealBox"></appeal-box>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import corBox from './cor-box'
import assessmentBox from './assessment-box/index'
import appealBox from './appeal-box/index'
export default {
  name: "my-assessment",
  components: {
    corBox,
    assessmentBox,
    appealBox,
  },
  data() {
    return {
      activeName:"first",
      carHeight: 500,
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
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.my-assessment {
  width: 100%;
  height: 100%;
}
</style>
