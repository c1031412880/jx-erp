<template>
  <div class="model-chart">
    <el-row v-if="data.children" type="flex" :gutter="20" style="height: 100%">
      <el-col v-for="(item,j) in data.children" :key="`j${j}`" style="height: 100%">
        <div class="model-chart-car-box">
          <model-chart :data="item" :ref="item.refs"></model-chart>
        </div>
      </el-col>
    </el-row>
    <online-chart
      :label="data.label || null"
      v-if="data.tage === 'online-chart'"
      @item-click="chartClick"
      :ref="data.refs">
    </online-chart>
    <play-chart
      :label="data.label || null"
      :ref="data.refs"
      @item-click="chartClick"
      v-if="data.tage === 'play-chart'">
    </play-chart>
    <bar-chart
      :label="data.label || null"
      :ref="data.refs"
      @item-click="chartClick"
      v-if="data.tage === 'bar-chart'">
    </bar-chart>
  </div>
</template>

<script type="text/ecmascript-6">
import playChart from './play-chart'
import onlineChart from './online-chart'
import barChart from './bar-chart'
export default {
  name: "modelChart",
  components: {onlineChart, playChart, barChart},
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          refs: 'personnelAnalysis',
          tage: 'play-chart',
          label: ''
        }
      }
    }
  },
  methods: {
    // 设置图表数据
    setData({refs = '', obj = {}}) {
      if (this.data.children) {
        this.$refs[obj.refs][0].setData({refs: obj.refs, obj: obj})
      } else {
        this.$refs[refs].setOptions(obj)
      }
    },
    chartClick(item) {
      // this.$emit('on-chart-click', this.data.refs, item)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$NumWidth: 100vw / 1920px;
.model-chart{
  width: 100%;
  height: 100%;
  .model-chart-car-box{
    width: 100%;
    height: 100%;
  }
}
</style>
