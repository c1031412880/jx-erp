<template>
  <div class="person-list">
    <!-- <div class="select-box">
      <el-radio-group v-model="type" size="mini">
        <el-radio-button :label="1">月</el-radio-button>
        <el-radio-button :label="2">年</el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-model="year"
        type="year"
        format="yyyy"
        value-format="yyyy"
        style="width: 90px;"
        size="mini"
        v-show="type === 2"
        placeholder="选择年">
      </el-date-picker>
      <el-date-picker
        v-model="month"
        type="month"
        style="width: 110px;"
        size="mini"
        format="yyyy-MM"
        value-format="yyyy-MM"
        v-show="type === 1"
        placeholder="选择月">
      </el-date-picker>
    </div> -->
    <div class="person-chart-box" id="person-chart-box"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import echarts from 'echarts'
import { debounce, formatTime } from '@/utils/index';
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  name: 'person-list',

  components: {getDepartmentSelect},
  data() {
    const nowYear = formatTime(new Date(),'yyyy').slice(0,4);
    const nowMonth = formatTime(new Date(),'yyyy-MM').slice(0,7);
    return {
      type: 2,
      year: nowYear,
      month: nowMonth,
      perChart: null,
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
      this.perChart && this.perChart.resize()
    },
    loadData() {
      let params ={
        is_driver: 0,
        type: 1,
        query_condition: ''
      }
      this.$client.QueryEmpTypeEmployeeAnalysis(params).then(res => {
        if (res.head.result == '200') {
          let total = res.context.reduce((item, index) => {
            return item + index.count
          }, 0);
          this.initChart(total, res.context);
        } else {
          this.initChart();
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
      //   this.initChart(total, data);
    },
    initChart(total = 0, data = []) { 
      const chartBox = document.getElementById('person-chart-box');
      this.perChart = echarts.init(chartBox);
      const option = {
        color: [
          '#A0BEFF', '#CFA0FF', '#89C5F3', '#387CFF', '#FF6084', '#F8BB54', '#10DFD8',

          '#97FFFF', '#3399cc', '#339966', '#9AFF9A', '#B4EEB4', '#C9C9C9', '#cc66ff'
        ],
        title: {
          text: [
            '{value|' + total + '}' + '{type|人}',
            '{name|总数}'
          ].join('\n'),
          top: 'center',
          left: '24%',
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
            let value = data.length ?  data.filter(item => item.name === name)[0].count : 0;
            let percentage = data.length ? data.filter(item => item.name === name)[0].value : '';
            return name + ': ' + value + '人 ' + percentage;
          },
        },
        series: [
          {
            name: '人员分析',
            type: 'pie',
            radius: ['40%', '60%'],
            center: ['25%', '50%'],
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
                value: item.count,
                name: item.name,
                percentage: item.value,
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
      this.perChart.setOption(option);
    }
  },
  beforeDestroy() {
		this.perChart.dispose()
	}
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.person-list {
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
  .person-chart-box {
    width: 100%;
    // height: 280px * $NumWidth;
    height: 310px * $NumWidth;
  }
}
</style>