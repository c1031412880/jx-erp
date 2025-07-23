<template>
  <div class="maintenance-list">
    <div class="select-box">
      <el-radio-group @change="loadData" v-model="type" size="mini">
        <el-radio-button :label="2">月</el-radio-button>
        <el-radio-button :label="1">年</el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-model="year"
        type="year"
        format="yyyy"
        value-format="yyyy"
        style="width: 90px;"
        size="mini"
        v-show="type === 1"
        @change="loadData"
        placeholder="选择年">
      </el-date-picker>
      <el-date-picker
        v-model="month"
        type="month"
        style="width: 110px;"
        size="mini"
        format="yyyy-MM"
        value-format="yyyy-MM"
        v-show="type === 2"
        @change="loadData"
        placeholder="选择月">
      </el-date-picker>
    </div>
    <div class="maintenance-chart-box" id="maintenance-chart-box"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import echarts from 'echarts'
import { debounce, formatTime } from '@/utils/index';
export default {
  name: 'maintenance-list',

  components: {},
  data() {
    const nowYear = formatTime(new Date(),'yyyy').slice(0,4);
    const nowMonth = formatTime(new Date(),'yyyy-MM').slice(0,7);
    return {
      type: 1,
      year: nowYear,
      month: nowMonth,
      maiChart: null,
    }
  },
  mounted() {
    this.loadData();
    this.$nextTick(() => {
      window.addEventListener("resize",() => {
        debounce(this.resizeChart(), 1000)
      });
    })
  },
  methods: {
    resizeChart() {
      this.maiChart && this.maiChart.resize()
    },
    loadData() {
      const params = {
        type: this.type,
        year_month: this.type === 1 ? this.year : this.month,
      }
      this.$client.GetMaintainData(params).then(res => {
        this.loading = false
        if (res.head.result == '200') {
          this.initChart(res.context[0].total, res.context[0].vehicles);
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
      // let total = 15000;
      // let data = [
      //   {name: 'Search Engine1', quantity: 1048, percentage: 20},
      //   {name: 'Direct1', quantity: 735, percentage: 15},
      //   {name: 'Email1', quantity: 580, percentage: 10},
      //   {name: 'Union Ads1', quantity: 484, percentage: 10},
      //   {name: 'Video Ads1', quantity: 300, percentage: 5},
      //   {name: 'Affiliate Ads1', quantity: 300, percentage: 5},
      //   {name: 'Others1', quantity: 300, percentage: 5},
      //   {name: 'Search Engine', quantity: 1048, percentage: 20},
      //   {name: 'Direct', quantity: 735, percentage: 15},
      //   {name: 'Email', quantity: 580, percentage: 10},
      //   {name: 'Union Ads', quantity: 484, percentage: 10},
      //   {name: 'Video Ads', quantity: 300, percentage: 5},
      //   {name: 'Affiliate Ads', quantity: 300, percentage: 5},
      //   {name: 'Others', quantity: 300, percentage: 5},
      //   {name: 'Search Engine', quantity: 1048, percentage: 20},
      // ];
      // this.initChart(total, data);
    },
    initChart(total = 0, data = []) { 
      const chartBox = document.getElementById('maintenance-chart-box');
      this.maiChart = echarts.init(chartBox);
      const option = {
        color: [
          '#A0BEFF', '#CFA0FF', '#89C5F3', '#387CFF', '#FF6084', '#F8BB54', '#10DFD8',

          '#97FFFF', '#3399cc', '#339966', '#9AFF9A', '#B4EEB4', '#C9C9C9', '#cc66ff'
        ],
        title: {
          text: [
            '{value|' + total + '}' + '{type|辆}',
            '{name|维修车辆}'
          ].join('\n'),
          top: 'center',
          left: '19%',
          textAlign: 'center',
          textStyle: {
            rich: {
              value: {
                fontSize: 22,
                color: '#333333',
                fontFamily: 'DIN-Bold',
                padding: [0, 0, 0, 0],
              },
              type: {
                fontSize: 10,
                color: '#333333',
                fontFamily: 'SourceHanSansCN-Regular, SourceHanSansCN-Regular',
                padding: [0, 0, 0, 0],
              },
              name: {
                fontSize: 10,
                color: '#333333',
                fontFamily: 'SourceHanSansCN-Regular, SourceHanSansCN-Regular',
                padding: [0, 0, 0, 0],
              }
            }
          }
        },
        tooltip: {
					trigger: 'item',
					axisPointer: {
						type: 'cross',
						crossStyle: {
							color: '#999'
						}
					},
					backgroundColor: '#222222',
					textStyle: {
						color: '#FFFFFF'
					}
				},
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: '0',
          top: 'center',
          padding: [20, 0, 0, 0],
          icon: 'circle',
          itemGap: 5,
          itemWidth: 8,
          itemHeight: 8,
          pageIconSize: [10, 10],
          // pageButtonPosition: 'start',
          textStyle: {
            color: '#666666',
            fontSize: 12,
            fontFamily: 'SourceHanSansCN-Regular, SourceHanSansCN-Regular',
          },
          formatter: function (name) {
            let value = data.length ?  data.filter(item => item.model === name)[0].quantity : 0;
            let percentage = data.length ? data.filter(item => item.model === name)[0].percentage : '';
            return name + ': ' + value + '辆 ' + percentage;
          },
        },
        series: [
          {
            name: '维修分析',
            type: 'pie',
            radius: ['40%', '60%'],
            center: ['20%', '50%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
              borderRadius: 10
            },
            label: {
              show: false,
              position: 'center'
            },
            data: data.length ? data.map(item => {
              return {
                value: item.quantity,
                name: item.model,
                percentage: item.percentage,
              }
            }) : [
              {value: 0, name: '暂无数据'},
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            labelLine: {
              show: false
            },
          }
        ]
      };
      this.maiChart.setOption(option);
    }
  },
  beforeDestroy() {
		this.maiChart.dispose()
	}
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.maintenance-list {
  height: 100%;
  width: 100%;
  .select-box {
    display: flex;
    justify-content: flex-end;
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
  }
  .maintenance-chart-box {
    width: 100%;
    height: 280px * $NumWidth;
  }
}
</style>