<template>
  <div class="operation-list">
    <el-carousel indicator-position="outside" :interval="5000">
      <el-carousel-item>
        <el-row class="operation-content">
          <el-col :span="12" v-for="item in firstData" :key="item.title">
            <div class="content-item">
              <div class="item-left">
                <div class="item-title">{{ item.title }}</div>
                <div class="item-value">
                  <span class="item-value-class">{{ item.percentage }}</span>
                  <span class="item-class">{{ item.class }}</span>
                </div>
                <div class="item-left-bottom">
                  <!-- <el-image :src="require('@/assets/home-image/down-1.png')" v-if="item.rate.includes('-')"></el-image>
                  <el-image :src="require('@/assets/home-image/up-1.png')" v-else></el-image>
                  <div class="item-rate" :style="{'color': item.rate.includes('-') ? '#0F8CFF' : '#C61D29'}">{{ item.rate }}</div> -->
                </div>
              </div>
              <el-image :src="item.img"></el-image>
            </div>
          </el-col>
        </el-row>
      </el-carousel-item>
      <el-carousel-item>
        <el-row class="operation-content">
          <el-col :span="12" v-for="item in secondData" :key="item.title">
            <div class="content-item">
              <div class="item-left">
                <div class="item-title">{{ item.title }}</div>
                <div class="item-value">{{ item.percentage }}</div>
                <div class="item-left-bottom">
                  <el-image :src="require('@/assets/home-image/down-1.png')" v-if="item.rate.includes('-')"></el-image>
                  <el-image :src="require('@/assets/home-image/up-1.png')" v-else></el-image>
                  <div class="item-rate" :style="{'color': item.rate.includes('-') ? '#0F8CFF' : '#C61D29'}">{{ item.rate }}</div>
                </div>
              </div>
              <el-image :src="item.img"></el-image>
            </div>
          </el-col>
        </el-row>
      </el-carousel-item>
      <el-carousel-item>
        <el-row class="operation-content">
          <el-col :span="12" v-for="item in thirdData" :key="item.title">
            <div class="content-item">
              <div class="item-left">
                <div class="item-title">{{ item.title }}</div>
                <div class="item-value">{{ item.percentage }}</div>
                <div class="item-left-bottom">
                  <el-image :src="require('@/assets/home-image/down-1.png')" v-if="item.rate.includes('-')"></el-image>
                  <el-image :src="require('@/assets/home-image/up-1.png')" v-else></el-image>
                  <div class="item-rate" :style="{'color': item.rate.includes('-') ? '#0F8CFF' : '#C61D29'}">{{ item.rate }}</div>
                </div>
              </div>
              <el-image :src="item.img"></el-image>
            </div>
          </el-col>
        </el-row>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: 'operation-list',
  data() {
    return {
      firstData: [
        {title: '计划班次数', percentage: '0', rate: '0', class: '次', img: require('@/assets/home-image/oper-1.png')},
        {title: '实时完成数', percentage: '0', rate: '0', class: '次', img: require('@/assets/home-image/oper-2.png')},
        {title: '准点班次数', percentage: '0', rate: '0', class: '次', img: require('@/assets/home-image/oper-3.png')},
        {title: '运营里程数', percentage: '0', rate: '0', class: '万公里', img: require('@/assets/home-image/oper-4.png')},
      ],
      secondData: [
        {title: '首末班准点率', percentage: '0', rate: '0', img: require('@/assets/home-image/oper-5.png')},
        {title: '班次执行率', percentage: '0', rate: '0', img: require('@/assets/home-image/oper-6.png')},
        {title: '班次准点率', percentage: '0', rate: '0', img: require('@/assets/home-image/oper-7.png')},
        {title: '里程利用率', percentage: '0', rate: '0', img: require('@/assets/home-image/oper-8.png')},
      ],
      thirdData: [
        {title: '设备完好率', percentage: '0', rate: '0', img: require('@/assets/home-image/oper-5.png')},
        {title: '车辆利用率', percentage: '0', rate: '0', img: require('@/assets/home-image/oper-6.png')},
      ],
    };
  },
  mounted() {
    this.loadData();
    this.get_dispatch_chart()
  },
  methods: {
    loadData() {
			Promise.all([this.get_dispatch_monitor_real(), this.get_dispatch_compare()]).then(res => {
				console.log('运营总览data', res)
				let info = res[0]
				let info1 = res[1]
        
        this.firstData[0].percentage = info.cnt_disp
        this.firstData[1].percentage = info.cnt_disp_complete
        this.firstData[2].percentage = info.cnt_disp_ontime
        this.firstData[3].percentage = info.sum_odo

        this.thirdData[0].percentage  = info1.rate_device_good + '%'
        this.thirdData[0].rate  = info1.rate_device_good_chain_ratio + '%'
        this.thirdData[1].percentage  = info1.rate_veh + '%'
        this.thirdData[1].rate  = info1.rate_veh_chain_ratio + '%'
			})
		},
		// 站点总览
		get_dispatch_compare() {
			return new Promise(resolve => {
				this.$client.GetYingYun({date_type: 4}).then(res => {
					if (res.head.result === '200') {
						resolve(res.context)
					}
				})
			})
		},
		get_dispatch_monitor_real() {
			return new Promise(resolve => {
				this.$client.GetYunYing({}).then(res => {
					if (res.head.result === '200') {
						resolve(res.context)
					}
				})
			})
		},
		get_dispatch_chart() {
      this.$client.GetYunYingCompare({}).then(res => {
        if (res.head.result === '200') {
          this.secondData[0].percentage = (res.context.rate_shoumo_ontime * 100).toFixed(2) + '%'
          this.secondData[0].rate = res.context.rate_shoumo_ontime_chain_ratio + '%'
          this.secondData[1].percentage = (res.context.rate_execute * 100).toFixed(2) + '%'
          this.secondData[1].rate = res.context.rate_execute_chain_ratio + '%'
          this.secondData[2].percentage = (res.context.rate_ontime * 100).toFixed(2) + '%'
          this.secondData[2].rate = res.context.rate_ontime_chain_ratio + '%'
          this.secondData[3].percentage = (res.context.odo_availability_rate * 100).toFixed(2) + '%'
          this.secondData[3].rate = res.context.odo_availability_rate_chain_ratio + '%'
        }
      })
		},
	},
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.operation-list {
  height: 100%;
  /deep/ .el-carousel {
    height: 100%;
    .el-carousel__container {
      height: 270px * $NumWidth;
      .operation-content {
        height: 100%;
        .content-item {
          margin: 10px * $NumWidth;
          padding: 10px * $NumWidth 0;
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          background: #F2F7FB;
          .item-left {
            margin-right: 25px * $NumWidth;
            .item-title {
              font-family: Source Han Sans CN, Source Han Sans CN;
              font-weight: 400;
              font-size: 14px * $NumWidth;
              color: #333333;
              line-height: 17px * $NumWidth;
            }
            .item-value {
              font-family: DIN, DIN;
              font-weight: bold;
              font-size: 34px * $NumWidth;
              color: #333333;
              line-height: 41px * $NumWidth;
              padding: 10px * $NumWidth 0;
              .item-value-class {
                font-family: DIN, DIN;
                font-weight: bold;
                font-size: 34px * $NumWidth;
                color: #333333;
                line-height: 41px * $NumWidth;
              }
              .item-class {
                font-size: 12px * $NumWidth;
                font-family: Source Han Sans CN, Source Han Sans CN;
                color: #333333;
              }
            }
            .item-left-bottom {
              display: flex;
              align-items: center;
              // justify-content: center;
              height: 14px * $NumWidth;
              .el-image {
                width: 12px * $NumWidth;
                height: 11px * $NumWidth;
                flex-shrink: 0;
                margin-right: 5px * $NumWidth;
              }
              .item-rate {
                font-family: DIN, DIN;
                font-weight: bold;
                font-size: 14px * $NumWidth;
              }
            }
          }
          .el-image {
            width: 52px * $NumWidth;
            height: 60px * $NumWidth;
            flex-shrink: 0;
          }
        }
      }
    }
    .el-carousel__indicator--horizontal {
      margin: 0 10px * $NumWidth;
      padding: 0;
      .el-carousel__button {
        width: 13px * $NumWidth;
        height: 6px * $NumWidth;
        flex-shrink: 0;
        background: #0F8CFF;
      }
    }
  }
}
</style>