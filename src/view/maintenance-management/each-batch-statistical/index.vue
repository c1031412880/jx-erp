<template>
  <div class="each-batch-statistical">
    <el-tabs class="view-tab" v-model="type" @tab-click="handleClick">
      <el-tab-pane label="有效里程" name="1" lazy>
        <data-page ref="effectiveRange" :type="Number(type)" :TableHeight="TableHeight"></data-page>
      </el-tab-pane>
      <el-tab-pane label="GPS里程" name="2" lazy>
        <data-page ref="GPSRange" :type="Number(type)" :TableHeight="TableHeight"></data-page>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import dataPage from "./component/data-page";
export default {
  name: "each-batch-statistical",
  components: {
    dataPage,
  },
  data() {
    return {
      type: '1',
      TableHeight: 500,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    handleClick() {

    },
    // 计算表格高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        this.TableHeight = maxh - 102;
        console.log(maxh, this.TableHeight);
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.each-batch-statistical {
  height: 100%;
  width: 100%;
  // .view-tab {
  //   height: 100%;
  //   /deep/ .el-tabs__content {
  //     height: calc(100% - 55px);
  //     width: 100;
  //     .el-tab-pane {
  //       height: 100%;
  //     }
  //   }
  // }
}
</style>
