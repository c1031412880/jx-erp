<template>
  <div class="Gas-system-inspection">
    <el-tabs v-model="activeName">
      <el-tab-pane label="气瓶" name="first" lazy>
        <cor-box :height="carHeight">
          <air-bottle></air-bottle>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="压力表" name="second" lazy>
        <cor-box :height="carHeight">
          <pressure-gauge></pressure-gauge>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="安全阀" name="third" lazy>
        <cor-box :height="carHeight">
          <safety-valve></safety-valve>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import corBox from './component/cor-box'
import airBottle from './component/air-bottle/index'
import pressureGauge from './component/pressure-gauge/index'
import safetyValve from './component/safety-valve/index'
export default {
  name: "Gas-system-inspection",
  components: {
    corBox,
    airBottle,
    pressureGauge,
    safetyValve
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
.Gas-system-inspection {
  width: 100%;
  height: 100%;
}
</style>
