<template>
  <div class="three-inspections-statistical">
    <el-tabs v-model="activeName">
      <el-tab-pane label="检查情况" name="first">
        <cor-box :height="carHeight">
          <inspection-situation @on-jump="onJump"></inspection-situation>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="检查统计" name="second">
        <cor-box :height="carHeight">
          <check-statistics ref="checkStatistics"></check-statistics>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import corBox from './component/cor-box'
import inspectionSituation from './component/inspection-situation/index'
import checkStatistics from './component/check-statistics/index'
import {formatDate} from "@/utils/index"
export default {
  name: "three-inspections-statistical",
  components: {
    corBox,
    inspectionSituation,
    checkStatistics,
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
    // 跳转 
    onJump(type,val) {
      this.activeName = 'second'
      let params = {
        check_date: formatDate(new Date(),'yyyy-MM-dd')
      }
      switch (type) {
        case 1:
        params.is_first  = true
        break;
        case 2:
          params.is_dispatch  = false
          break;
        case 3:
          params.check  = true
          break;
        case 4:
          params.risk_level = 1
          break;
        case 5:
          params.risk_level = 2
          break;
        case 6:
          params.risk_level = 3
          break;
        case 7:
          params.is_err  = true
          break;
        case 8:
          params.error_res  = true
          break;
        case 9:
          params.id = val
          break;
      }
      this.$nextTick(() => {
        this.$refs.checkStatistics.form = params
        this.$refs.checkStatistics.loadData()
      })
    },
    // 计算表格高度 和初始化表头
    setHead() {
      this.carHeight = this.$el.offsetHeight - 55
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.three-inspections-statistical {
  width: 100%;
  height: 100%;
}
</style>
