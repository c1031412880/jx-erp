<template>
  <div class="activities-management">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="我参加的" name="first" key="wocanyu" lazy>
        <cor-box :height="carHeight">
          <table-date :currentType="activeName"></table-date>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="我发起的" name="second" key="wofaqi" lazy>
        <cor-box :height="carHeight">
          <table-date :currentType="activeName"></table-date>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="全部" name="third" key="quanbu" lazy>
        <cor-box :height="carHeight">
          <table-date :currentType="activeName"></table-date>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
    <!-- <div :style="{'height': contentHeight + 'px'}">
      <tableDate :currentType="activeName" ref="tableDate"/>
    </div> -->
  </div>
</template>

<script type="text/ecmascript-6">
import corBox from './component/cor-box'
import tableDate from "./component/tableDate"
export default {
  name: 'activities-management',
  components: { corBox, tableDate },
  data() {
    return {
      activeName: 'second',
      carHeight: 400
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setBoxHeight()
    })
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    setBoxHeight() {
      this.carHeight = this.$el.offsetHeight - 55
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.activities-management
  height: 100%
  width: 100%
</style>