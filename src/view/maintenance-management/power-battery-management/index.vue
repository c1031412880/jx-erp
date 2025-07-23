<template>
  <div class="power-battery-management">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="明细列表" name="明细列表">
        <cor-box :height="carHeight">
          <detail-pane ref="entryPane"></detail-pane>
        </cor-box>
      </el-tab-pane>
      <el-tab-pane label="已报废电池" name="已报废电池" lazy>
        <cor-box :height="carHeight">
          <scrap-pane ref="scrapPane"></scrap-pane>
        </cor-box>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import corBox from './component/cor-box'
import detailPane from './component/detail-pane'
import scrapPane from './component/scrap-pane'
export default {
  name: 'power-battery-management',
  components: { corBox, detailPane, scrapPane },
  data() {
    return {
      activeName: '明细列表',
      carHeight: 400
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setBoxHeight()
    })
  },
  methods: {
    handleClick(tab) {},
    setBoxHeight() {
      this.carHeight = this.$el.offsetHeight - 55
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.power-battery-management {
  width: 100%;
  height: 100%;
}
</style>
