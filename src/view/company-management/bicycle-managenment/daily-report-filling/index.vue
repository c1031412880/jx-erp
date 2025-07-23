<template>
  <div class="daily-report-filling">
    <el-tabs v-model="activeName">
      <el-tab-pane label="填写报表" name="first" lazy>
        <cor-box :height="carHeight">
          <fill-report></fill-report>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="我填写的" name="second" lazy>
        <cor-box :height="carHeight">
          <my-filled></my-filled>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="全部" name="third" lazy v-if="$isPowerShow('all')">
        <cor-box :height="carHeight">
          <all-report></all-report>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="报表查询" name="fourth" lazy>
        <cor-box :height="carHeight">
          <query-report ref="queryReport"></query-report>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="按时段查询" name="fifth" lazy>
        <cor-box :height="carHeight">
          <time-interval-report></time-interval-report>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import corBox from './cor-box'
import fillReport from './fill-report/index'
import myFilled from './my-filled/index'
import allReport from './all-report/index'
import queryReport from './query-report/index'
import timeIntervalReport from './time-interval-report/index'
export default {
  name: "daily-report-filling",
  components: {
    corBox,
    fillReport,
    myFilled,
    allReport,
    queryReport,
    timeIntervalReport
  },
  data() {
    return {
      activeName:"first",
      carHeight: 500,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        let date = route.params.date
        console.log('-------',date);
        if (!!date) {
          this.activeName = 'fourth'
          this.$nextTick(() => {
            this.$refs.queryReport.$refs.head.form.date = date
            this.$refs.queryReport.$refs.head.onSubmit()
          })
        }
      },
      immediate: true,
    },
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
.daily-report-filling {
  width: 100%;
  height: 100%;
}
</style>
