<template>
  <div v-loading="loading" class="vehicle-info" id="vehicle-info"></div>
</template>

<script type="text/ecmascript-6">
import echarts from 'echarts'
export default {
  name: 'vehicle-info',
  components: {},
  data() {
    return {
      vehChart: null,
      loading: false
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
      this.vehChart && this.vehChart.resize()
    },
    loadData() {
      this.loading = true
      this.$client.GetBusData().then(res => {
        this.loading = false
        if (res.head.result == '200') {
          this.initChart(res.context.bus_overview.vehicle_count, res.context.vehicle);
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
      // let data = {
      //   total: 1500,
      //   data: [
      //     {name: '张三', value: 1000, percentage: 6.67},
      //     {name: '李四', value: 2000, percentage: 13.33},
      //     {name: '王五', value: 3000, percentage: 20.00},
      //     {name: '赵六', value: 4000, percentage: 26.67},
      //     {name: '钱七', value: 5000, percentage: 33.33},
      //   ]
      // }
      // this.initChart(data.total, data.data);
    },
    initChart(total = 0, data = []) { 
      this.vehChart = echarts.init(document.getElementById('vehicle-info'));
      const option = {
        color: [
          '#A0BEFF', '#CFA0FF', '#89C5F3', '#387CFF', '#FF6084', '#F8BB54', '#10DFD8',

          '#97FFFF', '#3399cc', '#339966', '#9AFF9A', '#B4EEB4', '#C9C9C9', '#cc66ff'
        ],
        title: {
          text: [
            '{value|' + total + '}' + '{type|辆}',
            '{name|总数}'
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
                padding: [0, 2, 0, 0],
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
            let value = data.length ?  data.filter(item => item.key === name)[0].value : 0;
            let percentage = data.length ? data.filter(item => item.key === name)[0].percentage : '';
            return name + ': ' + value + '辆 ' + percentage;
          },
        },
        series: [
          {
            name: '车辆',
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
                value: item.value,
                name: item.key,
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
      this.vehChart.setOption(option);
    },
    beforeDestroy() {
      this.vehChart && this.vehChart.dispose();
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.vehicle-info {
  height: 100%;
  width: 100%;
}
</style>