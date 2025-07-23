<template>
  <div class="safety-overview">
    <el-carousel indicator-position="outside" :interval="5000">
      <el-carousel-item v-for="item in dataList" :key="item.name">
				<el-row class="item-box-container">
					<el-col :span="12" v-for="(t, i) in item.list" :key="i">
						<div class="item-box-content">
							<div class="item-left">
								<div class="item-title">{{ t.name }}</div>
								<div class="item-value">
									<count-to 
										:start-val="0" :end-val="t.value" :duration="3000" :decimals="t.preFixed || 0"
									></count-to>
									<span class="item-unit">{{ t.unit }}</span>
								</div>
								<div class="item-left-bottom">
									<div class="item-left-bottom-name">{{ t.compare }}</div>
									<div class="item-left-bottom-value">
										<count-to 
											:start-val="0" :end-val="t.compare_value" :duration="3000" :decimals="t.fixed"
											:style="{ color: t.compare_value >= 0 && t.compare === '同比:' ? '#C61D29' : '#0F8CFF' }"
										></count-to>
										<span class="item-left-bottom-unit" :style="{ color: t.compare_value >= 0 && t.compare === '同比:' ? '#C61D29' : '#0F8CFF' }">{{ t.last_unit ? t.last_unit : '%' }}</span>
										<div v-if="t.showIcon">
											<span>(</span>
											<countTo
												:startVal="0"
												:endVal="t.last_value"
												:duration="3000"
												:decimals="t.last_fixed || 0"
												class="flop"
											></countTo>
											<span>%)</span>
										</div>
										<div v-else>
											<el-image :src="require('@/assets/home-image/down.png')" v-if="t.compare_value < 0"></el-image>
											<el-image :src="require('@/assets/home-image/up.png')" v-else></el-image>
										</div>
									</div>
								</div>
							</div>
							<el-image class="item-img" :src="t.img"></el-image>
						</div>
					</el-col>
				</el-row>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import countTo from 'vue-count-to'
import { getDate } from '@/utils'
export default {
  name: 'safety-overview',
  components: {
    countTo
  },
	props: {
		dept_id: {
			type: Number,
			default: 0
		}
	},
  data() {
    return {
      data: [
				{
					name: '事故总数',
					value: 0,
					unit: '次',
					compare: '同比:',
					compare_value: 0,
					fixed: 2,
					img: require('@/assets/home-image/oper-1.png')
				},
				{
					name: '有责事故数量',
					value: 0,
					unit: '次',
					compare: '同比:',
					compare_value: 0,
					fixed: 2,
					img: require('@/assets/home-image/oper-2.png')
				},
				{
					name: '行车事故率',
					value: 0,
					unit: '次/百万公里',
					compare: '同比:',
					compare_value: 0,
					preFixed: 2,
					fixed: 2,
					img: require('@/assets/home-image/oper-3.png')
				},
				{
					name: '有责事故经损',
					value: 0,
					unit: '元',
					compare: '同比:',
					compare_value: 0,
					fixed: 2,
					img: require('@/assets/home-image/oper-4.png')
				},
				{
					name: '违章数量',
					value: 0,
					unit: '次',
					compare: '同比:',
					compare_value: 0,
					fixed: 2,
					img: require('@/assets/home-image/oper-5.png')
				},
				{
					name: '违章率',
					value: 0,
					unit: '次/百万公里',
					compare: '同比:',
					compare_value: 0,
					preFixed: 2,
					fixed: 2,
					img: require('@/assets/home-image/oper-6.png')
				},
				{
					name: '累计安全隐患',
					value: 0,
					unit: '件',
					compare: '已整改:',
					compare_value: 0,
					last_value: 0,
					last_unit: '件',
					last_fixed: 0,
					fixed: 0,
					showIcon: true,
					img: require('@/assets/home-image/oper-7.png')
				},
				{
					name: '安全培训次数',
					value: 0,
					unit: '次',
					compare: '同比:',
					compare_value: 0,
					fixed: 2,
					img: require('@/assets/home-image/oper-8.png')
				}
			],
			dataList: []
    }
  },
  mounted() {
    this.loadData()
  },
	methods: {
		loadData() {
			this.dataList = []
			const thisYearRange = getDate('thisYear')
			const beginStr = thisYearRange.startTime // 今年开始日期 YYYY-MM-DD
			const endStr = getDate('today', new Date()).startTime // 当天日期 YYYY-MM-DD
			this.$client
				.GetSafeOverviewInfo({
					dept_id: this.dept_id,
					begin: beginStr,
					end: endStr
				})
				.then(res => {
					if (res.head.result == '200') {
						let data = res.context || {}
						// 事故总数
						this.data[0].value = data.accident_count || 0
						this.data[0].compare_value = data.accident_count_yoy || 0
						// 有责事故数量
						this.data[1].value = data.accident_duty_count || 0
						this.data[1].compare_value = data.accident_duty_count_yoy || 0
						// 行车事故率
						this.data[2].value = data.traffic_accident_rate || 0
						this.data[2].compare_value = data.traffic_accident_rate_yoy || 0
						// 有责事故经损
						this.data[3].value = data.accident_duty_loss || 0
						this.data[3].compare_value = data.accident_duty_loss_yoy || 0
						// 违章数量
						this.data[4].value = data.violations_count || 0
						this.data[4].compare_value = data.violations_count_yoy || 0
						// 违章率
						this.data[5].value = data.violations_rate || 0
						this.data[5].compare_value = data.violations_rate_yoy || 0
						// 累计安全隐患
						this.data[6].value = data.safe_risk_count || 0
						this.data[6].compare_value = data.safe_risk_done || 0
						this.data[6].last_value = data.safe_risk_done_rate || 0
						// 安全培训次数
						this.data[7].value = data.safe_train_count || 0
						this.data[7].compare_value = data.safe_train_yoy || 0
						this.dataList = this.sliceArr(this.data, 4)
					}else {
						this.dataList = this.sliceArr(this.data, 4)
					}
				}).catch(err => {
					this.dataList = this.sliceArr(this.data, 4)
				})
		},
		sliceArr(arr, split_len) {
			// arr: 待拆分数组 ； split_len: 拆分长度
			const res = []
			for (let i = 0; i < arr.length; i += split_len) {
				const chunk = arr.slice(i, i + split_len)
				let obj = {
					list: chunk
				}
				res.push(obj)
			}
			return res
		},
	}
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
$NumWidth: 100vw / 1920px;
.safety-overview {
  height: 100%;
	/deep/ .el-carousel {
		height: 100%;
		.el-carousel__container {
			height: 270px * $NumWidth;
			.item-box-container {
				height: 100%;
				.item-box-content {
					margin: 10px * $NumWidth;
					padding: 10px * $NumWidth 0;
					display: flex;
					align-items: center;
					justify-content: space-around;
					background: #F2F7FB;
					.item-left {
						// margin-right: 25px * $NumWidth;
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
							font-size: 30px * $NumWidth;
							color: #333333;
							line-height: 41px * $NumWidth;
							padding: 10px * $NumWidth 0;
							.item-unit {
								font-size: 12px * $NumWidth;
								color: #333333;
							}
						}
						.item-left-bottom {
							display: flex;
							align-items: center;
							height: 14px * $NumWidth;
							font-size: 14px * $NumWidth;
							font-family: DIN, DIN;
							font-weight: bold;
							.item-left-bottom-value {
								display: flex;
							}
						}
					}
					.item-img {
						width: 52px * $NumWidth;
						height: 60px * $NumWidth;
						flex-shrink: 0;
					}
				}
			}
		}
	}
}
</style>