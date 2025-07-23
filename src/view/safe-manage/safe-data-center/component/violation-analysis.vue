<template>
  <div class="violation-analysis">
    <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
      <el-radio-group v-model="vioType" size="mini" :disabled="loading">
        <el-radio-button :label="1">按分公司</el-radio-button>
        <el-radio-button :label="2">按月</el-radio-button>
      </el-radio-group>
    </div>
    <el-carousel indicator-position="none" :interval="5000">
      <el-carousel-item v-for="(item, index) in list" :key="index">
        <div class="violation-analysis-item" v-for="k in item.list" :key="k.name">
          <div class="violation-analysis-item-top">
            <count-to 
              class="violation-analysis-item-num" 
              :start-val="0" 
              :end-val="k.value" 
              :duration="2600" 
              :decimals="k.toFixed"
              :style="{ color: k.name !== '同比' ? '' : k.value >= 0 ? '#C61D29' : '#0F8CFF' }"
              />
            <span 
              class="violation-analysis-item-unit" 
              :style="{ color: k.name !== '同比' ? '' : k.value >= 0 ? '#C61D29' : '#0F8CFF' }"
              >{{ k.unit }}</span>
            <el-image v-if="k.icon && k.value < 0" :src="require('@/assets/home-image/down.png')"></el-image>
            <el-image v-if="k.icon && k.value >= 0" :src="require('@/assets/home-image/up.png')"></el-image>
          </div>
          <div class="violation-analysis-item-bottom">{{ k.name }}</div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="chart-container" id="violation-chart-container"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
import countTo from 'vue-count-to'
import { debounce, formatTime } from '@/utils/index'

export default {
  name: 'violation-analysis',
  components: { countTo },
  props: {
    dept_id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      chart: null,
      loading: false,
      vioType: 1, // 1:按分公司 2:按月
      date: formatTime(new Date(), 'yyyy-MM-dd'),
      dataList: [
        { name: '累计违章', value: 0, unit: '次', toFixed: 0 },
        { name: '同期', value: 0, unit: '次', toFixed: 0 },
        { name: '同比', value: 0, unit: '%', icon: true, toFixed: 1 },
        { name: '违章率', value: 0, unit: '%', toFixed: 2 },
        { name: '同期', value: 0, unit: '%', toFixed: 2 },
        { name: '同比', value: 0, unit: '%', icon: true, toFixed: 1 }
      ],
      list: []
    }
  },
  created() {
    this.list = this.sliceArr(this.dataList, 3)
  },
  mounted() {
    this.loadData()
    this.$nextTick(() => {
      window.addEventListener("resize", () => {
        debounce(this.resizeChart(), 1000)
      });
    })
  },
  watch: {
    vioType: {
      handler(newVal) {
        this.getChartData(newVal)
      }
    }
  },
  methods: {
    /**
     * 图表自适应调整
     */
    resizeChart() {
      this.chart && this.chart.resize()
    },
    /**
     * 数组分片方法
     * @param {Array} arr 待拆分数组
     * @param {Number} split_len 拆分长度
     * @returns {Array} 拆分后的二维数组
     */
    sliceArr(arr, split_len) {
      const res = []
      for (let i = 0; i < arr.length; i += split_len) {
        const chunk = arr.slice(i, i + split_len)
        let obj = { list: chunk }
        res.push(obj)
      }
      return res
    },
    /**
     * 加载数据
     */
    loadData() {
      this.loading = true
      // 获取文本信息
      this.getTextData()
      // 获取图表信息
      this.getChartData(this.vioType)
    },
    /**
     * 获取违章分析文本数据
     */
    getTextData() {
      let params = {
        begin: this.date.slice(0, 4) + '-01-01 00:00:00',
        end: this.date + ' 23:59:59',
        dept_id: this.dept_id
      }
      this.$client.GetViolationAnalysisTextInfo(params).then(res => {
        if (res.head.result == '200') {
          this.dataList[0].value = res.context.violations_count || 0
          this.dataList[1].value = res.context.violations_count_last || 0
          this.dataList[2].value = res.context.violations_count_yoy || 0
          this.dataList[3].value = res.context.violations_rate || 0
          this.dataList[4].value = res.context.violations_rate_last || 0
          this.dataList[5].value = res.context.violations_rate_yoy || 0
          this.list = this.sliceArr(this.dataList, 3)
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      }).finally(() => {
        this.loading = false
      })
    },
    /**
     * 获取违章分析图表数据
     * @param {Number} type 图表类型 1:按分公司 2:按月
     */
    getChartData(type) {
      let params = {
        begin: this.date.slice(0, 4) + '-01-01 00:00:00',
        end: this.date + ' 23:59:59',
        type: type,
        dept_id: this.dept_id
      }
      this.$client.GetViolationAnalysisChartInfo(params).then(res => {
        if (res.head.result == '200') {
          this.loadChart(res.context || {})
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      }).finally(() => {
        this.loading = false
        this.loadChart()
      })
    },
    /**
     * 加载图表
     * @param {Object} data 图表数据
     */
    loadChart(data = {}) {
      if (!this.chart) this.chart = echarts.init(document.getElementById('violation-chart-container'));
      let option = {
        color: [
          '#A0BEFF', '#CFA0FF', '#89C5F3', '#387CFF', '#FF6084', '#F8BB54', '#10DFD8',
          '#97FFFF', '#3399cc', '#339966', '#9AFF9A', '#B4EEB4', '#C9C9C9', '#cc66ff'
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          },
          backgroundColor: '#222222',
          textStyle: {
            color: '#FFFFFF',
          }
        },
        legend: {
          type: 'scroll',
          bottom: '0',
          itemWidth: 14,
        },
        grid: {
          top: '30',
          bottom: '45',
          left: '30',
          right: '10',
          containLabel: false
        },
        xAxis: [
          {
            type: 'category',
            data: data.names || [],
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#D1D1D1',
              }
            },
            axisLabel: {
              color: "#666666",
              fontSize: 12,
            },
            splitLine: {
              show: false,
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '次',
            min: 0,
            axisLabel: {
              show: true
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitArea: {
              show: true,
              areaStyle: {
                color: ['#FFFFFF', '#F9F9F9']
              }
            }
          },
        ],
        series: [
          {
            name: '违章数量',
            type: 'bar',
            data: data.violations_counts || [],
          },
          {
            name: '同期数量',
            type: 'bar',
            data: data.violations_counts_last || [],
          },
          {
            name: '违章率',
            type: 'bar',
            data: data.violations_rates || [],
          },
          {
            name: '同期违章率',
            type: 'bar',
            data: data.violations_rates_last || [],
          }
        ]
      }
      this.chart.setOption(option, true)
    }
  },
  beforeDestroy() {
    this.chart && this.chart.dispose()
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;

.violation-analysis {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  // 单选按钮容器样式
  .el-radio-group {
    margin-bottom: 8px * $NumWidth;
  }
  
  /deep/ .el-carousel__container {
    height: 50px * $NumWidth;
    .el-carousel__item {
      display: flex;
      justify-content: space-around;
      .violation-analysis-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .violation-analysis-item-top {
          display: flex;
          align-items: center;
          .violation-analysis-item-num {
            font-family: DIN, DIN;
            font-weight: bold;
            font-size: 22px * $NumWidth;
            color: #333333;
          }
          .violation-analysis-item-unit {
            font-family: Source Han Sans CN, Source Han Sans CN;
            font-weight: 400;
            font-size: 12px * $NumWidth;
            color: #333333;
          }
          .el-image {
            width: 11px * $NumWidth;
            height: 15px * $NumWidth;
            margin-left: 5px * $NumWidth;
            flex-shrink: 0;
          }
        }
        .violation-analysis-item-bottom {
          font-family: Source Han Sans CN, Source Han Sans CN;
          font-weight: 400;
          font-size: 12px * $NumWidth;
          color: #333333;
          margin-top: 10px * $NumWidth;
        }
      }
    }
    .el-carousel__arrow {
      min-width: 20px * $NumWidth;
      min-height: 20px * $NumWidth;
    }
  }
  
  .chart-container {
    height: 205px * $NumWidth;
  }
}

// 单选按钮样式优化
/deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner {
  background-color: #FFF1F2;
  border: 1px solid #C61D29;
  color: #C61D29;
  -webkit-box-shadow: -1px 0 0 0 #C61D29;
  box-shadow: -1px 0 0 0 #C61D29;
}

/deep/ .el-radio-button__inner:hover {
  color: #ee6069;
}

/deep/ .el-radio-button__inner {
  font-size: 12px * $NumWidth;
  padding: 6px * $NumWidth 10px * $NumWidth;
  border-radius: 3px * $NumWidth;
}

/deep/ .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 3px * $NumWidth 0 0 3px * $NumWidth;
}

/deep/ .el-radio-button:last-child .el-radio-button__inner {
  border-radius: 0 3px * $NumWidth 3px * $NumWidth 0;
}

/deep/ .el-radio-button:not(:first-child) .el-radio-button__inner {
  margin-left: -1px;
}
</style> 