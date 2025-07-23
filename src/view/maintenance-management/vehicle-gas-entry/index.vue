<template>
  <div class="vehicle-gas-entry">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="气耗录入" name="气耗录入" lazy>
        <cor-box :height="carHeight">
          <entry-pane ref="entryPane"></entry-pane>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="气耗明细" name="气耗明细" lazy>
        <cor-box :height="carHeight">
          <details-pane ref="detailsPane"></details-pane>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
  <script>
import corBox from "./component/cor-box";
import entryPane from "./component/entry-pane";
import detailsPane from "./component/details-pane";
export default {
  components: { corBox, entryPane, detailsPane },
  data() {
    return {
      activeName: "气耗录入",
      carHeight: 400,
    };
  },
  activated() {
    let activeName = this.$route.params.activeName;
    if (activeName) {
      this.activeName = activeName;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setBoxHeight();
    });
    let activeName = this.$route.params.activeName;
    if (activeName) {
      this.activeName = activeName;
    }
  },
  methods: {
    handleClick(tab) {},
    setBoxHeight() {
      this.carHeight = this.$el.offsetHeight - 55;
    },
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.vehicle-gas-entry {
  width: 100%;
  height: 100%;
}
</style>
