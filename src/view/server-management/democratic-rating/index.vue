<template>
  <div class="democratic-rating">
    <el-tabs v-model="activeName">
      <el-tab-pane label="我发起的" name="first">
        <cor-box :height="carHeight">
          <my-launch></my-launch>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="我的评分" name="second" lazy>
        <cor-box :height="carHeight">
          <my-rating></my-rating>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="全部" name="third" lazy v-if="$isPowerShow('all')">
        <cor-box :height="carHeight">
          <all-server></all-server>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import corBox from './cor-box'
import myLaunch from './my-launch/index'
import myRating from './my-rating/index'
import allServer from './all-server/index'
export default {
  name: "democratic-rating",
  components: {
    corBox,
    myLaunch,
    myRating,
    allServer
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
.democratic-rating {
  width: 100%;
  height: 100%;
}
</style>
