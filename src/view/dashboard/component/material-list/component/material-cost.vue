<template>
  <div class="material-cost">
    <div class="select-box">
      <el-radio-group @change="loadData" v-model="type" size="mini">
        <el-radio-button :label="1">月</el-radio-button>
        <el-radio-button :label="2">年</el-radio-button>
      </el-radio-group>
      <el-date-picker
        v-model="month"
        type="month"
        style="width: 110px;"
        size="mini"
        format="yyyy-MM"
        value-format="yyyy-MM"
        v-show="type === 1"
         @change="loadData"
        placeholder="选择月">
      </el-date-picker>
    </div>
    <div class="material-cost-top">
      <el-carousel indicator-position="none" :interval="5000">
        <el-carousel-item>
          <div class="base-info-item" v-for="item in firstLoopData" :key="item.title">
            <div class="base-info-item-top" v-if="item.title === '同比'">
              <div class="base-info-item-num" :style="{'color': item.rate.includes('-') ? '#0F8CFF' : '#C61D29'}">{{ item.rate || '0%' }}</div>
              <el-image v-if="item.rate.includes('-')" :src="require('@/assets/home-image/down.png')"></el-image>
              <el-image v-else :src="require('@/assets/home-image/up.png')"></el-image>
            </div>
            <div class="base-info-item-top" v-else>
              <count-to class="base-info-item-num" :start-val="0" :end-val="item.value" :duration="2600"/>
            </div>
            <div class="base-info-item-bottom">{{item.title}}</div>
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <div class="base-info-item" v-for="item in secondLoopData" :key="item.title">
            <div class="base-info-item-top" v-if="item.title === '同比'">
              <div class="base-info-item-num" :style="{'color': item.rate.includes('-') ? '#0F8CFF' : '#C61D29'}">{{ item.rate || '0%' }}</div>
              <el-image v-if="item.rate.includes('-')" :src="require('@/assets/home-image/down.png')"></el-image>
              <el-image v-else :src="require('@/assets/home-image/up.png')"></el-image>
            </div>
            <div class="base-info-item-top" v-else>
              <count-to class="base-info-item-num" :start-val="0" :end-val="item.value" :duration="2600"/>
            </div>
            <div class="base-info-item-bottom">{{item.title}}</div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="material-cost-bottom" id="material-cost-bottom"></div>
  </div>
</template>

<script type="text/ecmascript-6">
import echarts from 'echarts'
import countTo from 'vue-count-to'
import {debounce, formatTime} from '@/utils/index'
export default {
  name: 'material-cost',
  components: {countTo},
  data() {
    const nowMonth = formatTime(new Date(),'yyyy-MM').slice(0,7);
    return {
      type: 2,
      month: nowMonth,
      matChart: null,
      firstLoopData: [
        {title: '累积材料费', value: 0},
        {title: '同期', value: 0},
        {title: '同比',  rate: '0%'},
      ],
      secondLoopData: [
        {title: '千公里材料费', value: 0},
        {title: '同期', value: 0},
        {title: '同比', rate: '0%'},
      ],
    }
  },
  mounted() {
    this.loadData()
    this.$nextTick(() => {
      window.addEventListener("resize",() => {
        debounce(this.resizeChart(), 1000)
      });
    })
  },
  methods: {
    resizeChart() {
      this.matChart && this.matChart.resize()
    },
    loadData() {
      let params = {
        type: this.type,
      }
      if(this.type === 1) {
        params.month = this.month
      }
      this.$client.GetMaterialFee(params).then(res => {
        if (res.head.result == '200') {
          this.firstLoopData[0].value = res.context.now_fee;
          this.firstLoopData[1].value = res.context.last_fee;
          this.firstLoopData[2].rate = res.context.fee_yoy;
          this.secondLoopData[0].value = res.context.now_kilometer_fee;
          this.secondLoopData[1].value = res.context.last_kilometer_fee;
          this.secondLoopData[2].rate = res.context.kilometer_fee_yoy;
          this.initChart(res.context.fee_total);
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
      // let names = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
      // let data = [100, 120, 161, 134, 105, 160, 165, 145, 137, 125, 145, 160]
      // this.initChart(names, data);
    },
    initChart(data = []) { 
      if (!this.matChart) this.matChart = echarts.init(document.getElementById('material-cost-bottom'));
      let option = {
        color: ['#3869F4'],
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
						color: '#FFFFFF'
					}
				},
				legend: {
          show: false
				},
				grid: {
					top: '10',
					bottom: '30',
					left: '30',
					right: '10',
					containLabel: false
				},
				xAxis: [
					{
						type: 'category',
						axisTick: {
							show: false,
						},
            data: data.length ? data.map(item => item.month) : [ '暂无数据' ],
            axisLine:{
							lineStyle:{
								color:'#D1D1D1',
							}
						},
            axisLabel: {
              color: "#666666",
              fontSize: 12,
              // rotate: 30,
              // interval: 0,
              // formatter: function(params) {
              //   if (params.length > 4) {
              //     return params.substring(0, 4) + '...'
              //   } else {
              //     return params
              //   }
              // }
            },
						splitLine: {
							show: false,
						}
					}
				],
				yAxis: [
					{
						type: 'value',
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
                color: ['#FFFFFF','#F9F9F9']
              }
            }
					},
				],
				series: [
					{
						name: '材料费',
						type: 'line',
            symbol: 'circle',
						smooth: true,
            areaStyle: {
							color: {
								x: 0,
								y: 0,
								x2: 0,
								y2: 1,
								colorStops: [
									{
										offset: 0,
										color: '#7698F8' // 0% 处的颜色
									},
									{
										offset: 0.8,
										color: 'transparent' // 100% 处的颜色
									}
								]
							}
						},
						data: data.length ? data.map(item => item.fee) : [ '0' ],
					},
        ]
      }
      this.matChart.setOption(option);
    },
    beforeDestroy() {
			if (this.matChart) this.matChart.dispose()
		}
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.material-cost {
  height: 100%;
  width: 100%;
  position: relative;
  .select-box {
    position: absolute;
    top: -53px;
    right: 0;
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
  /deep/ .el-carousel__container {
    height: 50px * $NumWidth;
    .el-carousel__item {
      display: flex;
      justify-content: space-around;
      .base-info-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .base-info-item-top {
          display: flex;
          align-items: center;
          .base-info-item-num {
            font-family: DIN, DIN;
            font-weight: bold;
            font-size: 22px * $NumWidth;
            color: #333333;
          }
          .el-image {
            width: 11px * $NumWidth;
            height: 15px * $NumWidth;
            margin-left: 5px * $NumWidth;
            flex-shrink: 0;
          }
        }
        .base-info-item-bottom {
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
  .material-cost-bottom {
    height: 190px * $NumWidth;
  }
}
</style>