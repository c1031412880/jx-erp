<template>
  <div class="leave-staff-management">
    <el-tabs v-model="activeName">
      <el-tab-pane label="待确认" name="first" lazy>
        <cor-box :height="carHeight">
          <unconfirmed-separation></unconfirmed-separation>
        </cor-box>
      </el-tab-pane>
      <!-- <el-tab-pane label="审批中" name="second" lazy>
        <cor-box :height="carHeight">
          <leaving-approval></leaving-approval>
        </cor-box>
      </el-tab-pane> -->
      <el-tab-pane :label="label" name="third" lazy>
        <cor-box :height="carHeight">
          <retired-personnel @out-num="setRetiredPersonnelNum"></retired-personnel>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import corBox from './component/cor-box'
import unconfirmedSeparation from './component/unconfirmed-separation/index'
import retiredPersonnel from './component/retired-personnel/index'
import leavingApproval from './component/leaving-approval/index'
export default {
  name: "leave-staff-management",
  components: {
    corBox,
    retiredPersonnel,
    unconfirmedSeparation,
    leavingApproval
  },
  data() {
    return {
      activeName:"first",
      carHeight: 500,
      label: '已离职'
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
    })
  },
  methods: {
    setRetiredPersonnelNum(num) {
      this.label = '已离职' + '(' + num + ')'
    },
    // 计算表格高度 和初始化表头
    setHead() {
      this.carHeight = this.$el.offsetHeight - 55
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.leave-staff-management {
  width: 100%;
  height: 100%;
}
</style>
