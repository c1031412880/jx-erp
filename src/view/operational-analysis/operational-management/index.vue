<template>
  <div class="operational-management-dashboard">
    <!-- 顶部统计面板 -->
    <TopStatisticsPanel
      ref="topStatisticsPanel"
      :dataCards="dataCards"
      :selectedDeptId="selectedDeptId"
      :selectedDate="selectedDate"
      @dept-change="deptChange"
      @date-change="onDateChange"
    />

    <!-- 营运质量对比 -->
    <LineDispatchChartWrapper
      ref="lineDispatchChartWrapper"
      :lineDispatchData="lineDispatchData"
      @export-data="exportData"
      @line-dispatch-type-change="handleLineDispatchTypeChange"
      @line-dispatch-data-change="handleLineDispatchDataChange"
    />

    <!-- 客流趋势 + 热门线路 -->
    <PassengerFlowAndHotRoutes
      ref="passengerFlowAndHotRoutes"
      :passengerFlowData="passengerFlowData"
      :hotRoutes="hotRoutes"
      @passenger-flow-type-change="handlePassengerFlowTypeChange"
      @hot-routes-switch="handleHotRoutesSwitch"
    />

    <!-- 营收分析 + 线路客流排名 -->
    <RevenueAndRouteRanking
      ref="revenueAndRouteRanking"
      :revenueData="revenueData"
      :revenueLineData="revenueLineData"
      :revenuePieData="revenuePieData"
      :routeRankingData="routeRankingData"
      @route-ranking-data-change="handleRouteRankingDataChange"
      @revenue-type-change="handleRevenueTypeChange"
    />

    <!-- 里程分析 -->
    <el-row :gutter="10" class="chart-row">
      <el-col :span="24">
        <RouteAnalysis
          ref="routeAnalysis"
          :routeStatsData="routeStatsData"
          :mileageRankingData="mileageRankingData"
          :dailyMileageData="dailyMileageData"
          @data-change="handleRouteAnalysisDataChange"
        />
      </el-col>
    </el-row>

    <!-- 服务质量指标分析 -->
    <el-row :gutter="10" class="chart-row">
      <el-col :span="24">
        <ServiceQualityAnalysis
          ref="serviceQualityAnalysis"
          :qualityData="qualityData"
          :intervalChartData="intervalChartData"
          :speedChartData="speedChartData"
          @data-change="handleServiceQualityDataChange"
        />
      </el-col>
    </el-row>

    <!-- 包车分析 -->
    <el-row :gutter="10" class="chart-row">
      <el-col :span="24">
        <CharterAnalysis
          ref="charterAnalysis"
          :charterData="charterData"
          :chartData="charterChartData"
          @data-change="handleCharterAnalysisDataChange"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import deptSelect from "@/components/component/dept-select"
import TopStatisticsPanel from './components/TopStatisticsPanel.vue'
import LineDispatchChartWrapper from './components/LineDispatchChartWrapper.vue'
import PassengerFlowAndHotRoutes from './components/PassengerFlowAndHotRoutes.vue'
import RevenueAndRouteRanking from './components/RevenueAndRouteRanking.vue'
import RouteAnalysis from './components/RouteAnalysis.vue'
import ServiceQualityAnalysis from './components/ServiceQualityAnalysis.vue'
import CharterAnalysis from './components/CharterAnalysis.vue'
import responsiveMixin from '@/mixins/responsive'

export default {
  name: 'OperationalManagementDashboard',
  mixins: [responsiveMixin],
  components: {
    deptSelect,
    TopStatisticsPanel,
    LineDispatchChartWrapper,
    PassengerFlowAndHotRoutes,
    RevenueAndRouteRanking,
    RouteAnalysis,
    ServiceQualityAnalysis,
    CharterAnalysis
  },
  data() {
    return {
      // 部门选择
      selectedDeptId: '',
      selectedDate: new Date().toISOString().slice(0, 10), // 默认今天
      loading: false,

      // 顶部数据卡片
      dataCards: [
        {
          title: '总客流量(人次)',
          subtitle: '',
          value: '5,960',
          unit: '',
          trend: 1.6,
          dataKey: 'passenger_flow'
        },
        {
          title: '完成班次数/执行率',
          subtitle: '',
          value: '5,960',
          subValue: '99.5%',
          unit: '',
          trend: -0.5,
          dataKey: 'completion_rate'
        },
        {
          title: '运行公里/里程利用率',
          subtitle: '',
          value: '211.40',
          subValue: '95.3%',
          unit: '',
          trend: 1.6,
          dataKey: 'mileage_utilization'
        },
        {
          title: '营收总额(元)',
          subtitle: '',
          value: '5,960',
          unit: '',
          trend: -0.5,
          dataKey: 'total_revenue'
        },
        {
          title: '班次准点率',
          subtitle: '',
          value: '98.5%',
          unit: '',
          trend: 1.6,
          dataKey: 'punctuality_rate'
        },
        {
          title: '首末班准点率',
          subtitle: '',
          value: '98%',
          unit: '',
          trend: -0.5,
          dataKey: 'first_last_punctuality'
        }
      ],

      // 线路调度数据
      lineDispatchData: {
        lineData: [],
        countData: [],
        trueData: [],
        onTimeData: []
      },

      // 客流趋势数据
      passengerFlowData: {
        daily: {
          xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          data: [5200, 5800, 5400, 6200, 5900, 5500, 5100]
        },
        hourly: {
          xAxis: ['00:00-01:00', '03:00-04:00', '06:00-07:00', '09:00-10:00', '12:00-13:00', '15:00-16:00', '18:00-19:00', '21:00-22:00'],
          data: [0, 2000, 4000, 12000, 6000, 8000, 9000, 2000]
        },
        per100km: {
          xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          data: [120, 135, 128, 145, 138, 125, 118]
        }
      },

      // 热门线路数据
      hotRoutes: [
        { name: 'BRT1', flow: 5147, percentage: 100 },
        { name: '37', flow: 3225, percentage: 63 },
        { name: 'B支809', flow: 3110, percentage: 60 },
        { name: '333', flow: 2967, percentage: 58 },
        { name: 'B支101', flow: 2509, percentage: 49 },
        { name: '361', flow: 2502, percentage: 49 },
        { name: '810', flow: 2390, percentage: 46 }
      ],

      // 营收数据
      revenueData: {
        totalRevenue: '2,456,789',
        totalTrend: '+1.3%',
        perVehicleRevenue: '5,389',
        perVehicleTrend: '+3.2%',
        taxRevenue: '2,920',
        taxTrend: '+2.5%'
      },

      revenueLineData: {
        xAxis: ['1/10', '1/11', '1/12', '1/13', '1/14', '1/15', '1/16'],
        data: [80000, 85000, 82000, 88000, 90000, 87000, 92000]
      },

      revenuePieData: {},

      // 线路客流排名数据
      routeRankingData: [
        { route: '005路', passengers: '9,500', revenue: '¥90,500' },
        { route: '001路', passengers: '8,400', revenue: '¥80,400' },
        { route: '201路', passengers: '7,300', revenue: '¥70,300' },
        { route: '003路', passengers: '6,200', revenue: '¥60,200' },
        { route: '101路', passengers: '5,100', revenue: '¥50,100' },
        { route: '303路', passengers: '5,000', revenue: '¥50,000' },
        { route: '105路', passengers: '4,800', revenue: '¥40,800' },
        { route: '108路', passengers: '4,600', revenue: '¥40,600' },
        { route: '006路', passengers: '4,400', revenue: '¥40,400' }
      ],

      // 里程分析数据
      routeStatsData: {
        gps_mileage: '256.8',
        operation_mileage: '219.3',
        average_mileage: '37.5',
        utilization_rate: '85.4'
      },

      mileageRankingData: [],

      dailyMileageData: {
        xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        gpsData: [250, 240, 260, 280, 270, 230, 220],
        operationData: [200, 190, 210, 240, 230, 180, 170],
        averageData: [50, 40, 60, 50, 40, 30, 40]
      },

      // 服务质量数据
      qualityData: {
        intervals: {
          all_minute_true: '10.5',
          zao_minute_true: '7.2',
          wan_minute_true: '8.5',
          ping_minute_true: '12.8'
        },
        speeds: {
          all_speed_true: '22.5',
          zao_speed_true: '18.3',  // 早高峰速度
          wan_speed_true: '19.7',  // 晚高峰速度
          ping_speed_true: '26.4'  // 平峰速度
        }
      },

      intervalChartData: {
        // xAxis: ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
        // data: [12, 8, 15, 10, 12, 7, 13, 11, 14]
      },

      speedChartData: {
        // xAxis: ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
        // data: [25, 18, 28, 24, 26, 20, 22, 25, 27]
      },

      // 包车数据
      charterData: [
        { date: '2023-06-28', status: '普通车辆', type: '包车', time: '30', passengers: 1, startStation: '汽车南站', contact: '张三', phone: '13867382771' },
        { date: '2023-06-16', status: '普通车辆', type: '包车', time: '30', passengers: 1, startStation: '汽车南站', contact: '李四', phone: '' },
        { date: '2023-06-23', status: '普通车辆', type: '包车', time: '30', passengers: 1, startStation: '汽车南站', contact: '王五', phone: '' },
        { date: '2023-05-15', status: '普通车辆', type: '包车', time: '30', passengers: 1, startStation: '汽车南站', contact: '赵六', phone: '13827133596' },
        { date: '2023-05-11', status: '普通车辆', type: '包车', time: '30', passengers: 1, startStation: '汽车南站', contact: '钱七', phone: '13573338118' },
        { date: '2023-05-03', status: '普通车辆', type: '包车', time: '30', passengers: 1, startStation: '汽车南站', contact: '孙八', phone: '13061734316' },
        { date: '2023-04-25', status: '普通车辆', type: '包车', time: '45', passengers: 1, startStation: '汽车南站', contact: '周九', phone: '13717616' },
        { date: '2023-04-03', status: '普通车辆', type: '包车', time: '20', passengers: 1, startStation: '汽车南站', contact: '吴十', phone: '13738338200' },
        { date: '2023-03-20', status: '普通车辆', type: '包车', time: '230', passengers: 2, startStation: '汽车南站', contact: '郑十一', phone: '13738338200' },
        { date: '2023-04-05', status: '普通车辆', type: '包车', time: '60', passengers: 1, startStation: '汽车南站', contact: '王十二', phone: '13573338771' },
        { date: '2023-04-05', status: '普通车辆', type: '包车', time: '30', passengers: 1, startStation: '汽车南站', contact: '刘十三', phone: '13441033687' },
        { date: '2023-04-03', status: '普通车辆', type: '包车', time: '100', passengers: 2, startStation: '汽车南站', contact: '陈十四', phone: '13267231938' }
      ],

      charterChartData: {
        xAxis: ['1月', '2月', '3月', '4月', '5月', '6月', '7月'],
        countData: [12, 15, 10, 18, 20, 16, 14],
        revenueData: [52000, 58000, 48000, 65000, 72000, 61000, 55000]
      }
    }
  },
  mounted() {
    this.loadData()
    // 添加窗口大小变化监听
    this.handleResize = this.debounce(this.resizeAllCharts, 150)
    window.addEventListener('resize', this.handleResize)
  },

  beforeDestroy() {
    if (this.handleResize) {
      window.removeEventListener('resize', this.handleResize)
    }
  },
  watch: {
    selectedDeptId: {
      handler(newVal) {
        this.loadOperationalStatistics()
        this.loadData()
      },
      immediate: true
    }
  },
  methods: {
    loadData() {
      this.loadOperationalStatistics()
      this.loadLineDispatchData()
      this.loadPassengerFlowData()
      this.loadLinePassengerRange()
      this.loadRouteAnalysisData()
      this.loadServiceQualityData()
      this.loadCharterAnalysisData()
      this.loadDispatchMonitorReport()
      this.loadRevenueData() // 添加营收数据加载
    },

    // 加载营收数据
    loadRevenueData() {
      // 设置默认日期范围：昨天起的前一个月
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      const oneMonthAgo = new Date(yesterday)
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      
      const dateRange = [oneMonthAgo, yesterday]
      
      this.$dispatch.getRevenueMonth({
        date: dateRange,
        line_ids: '', // 默认所有线路
        dept_id: this.selectedDeptId
      }).then((res) => {
        if (res.head.result === '200') {
          let info = res.content
          this.revenueData = info.revenue_overview || this.revenueData
          this.revenueLineData = info.date_chart || this.revenueLineData
          this.revenuePieData = info.payway_chart || this.revenuePieData
          this.routeRankingData = info.line_pass_revenue_list || this.routeRankingData
          console.log('营收数据加载完成:', info)
        }
      }).catch(error => {
        console.error('营收数据加载失败:', error)
      })
    },

    loadDispatchMonitorReport() {
      this.$dispatch.getDispatchMonitorReport({
        line_group_id: this.selectedDeptId,
        bdt: this.selectedDate,
        edt: this.selectedDate
      }).then((res) => {
        // "cnt_disp": 4117, //计划班次数
        // "cnt_disp_complete": 2813, //完成班次数
        // "cnt_disp_ontime": 2845, //准点班次数
        // "sum_odo": 4.33 //当日的实际里程：万公里
        // this.dataCards[0].value = res.content.cnt_disp
        this.dataCards[1].value = res.content.cnt_disp_complete
        this.dataCards[2].value = res.content.sum_odo
        console.log(res , '调度监控报表')
      })
      this.$dispatch.getDispatchCompare({
        line_group_id: this.selectedDeptId,
        bdt: this.selectedDate,
        edt: this.selectedDate
      }).then((res) => {
        this.dataCards[1].subValue = res.content.rate_execute * 100
        this.dataCards[1].trend = res.content.rate_execute_chain_ratio
        this.dataCards[2].subValue = res.content.rate_stop_disp * 100
        this.dataCards[2].trend = res.content.odo_availability_rate_chain_ratio
        this.dataCards[4].value = res.content.rate_ontime * 100 + '%'
        this.dataCards[4].trend = res.content.rate_ontime_chain_ratio
        this.dataCards[5].value = res.content.rate_shoumo_ontime * 100 + '%'
        this.dataCards[5].trend = res.content.rate_shoumo_ontime_chain_ratio

        console.log(res , '班次完成率')
      })
    },
    // 部门选择变化事件
    deptChange(value) {
      this.selectedDeptId = value || ''
      console.log('部门变化:', this.selectedDeptId)
      // 重新加载所有数据
      this.loadAllData()
    },

    // 日期选择变化事件
    onDateChange(value) {
      this.selectedDate = value
      console.log('日期变化:', this.selectedDate)
      // 重新加载所有数据
      this.loadAllData()
    },

    // 加载所有数据的统一方法
    loadAllData() {
      this.loadOperationalStatistics()
      this.loadDispatchMonitorReport()
      this.loadLineDispatchData()
      this.loadPassengerFlowData()
      this.loadLinePassengerRange()
      this.loadRevenueData()
      this.loadRouteAnalysisData()
      this.loadServiceQualityData()
      this.loadCharterAnalysisData()
    },

    // 加载营运统计数据
    async loadOperationalStatistics() {
      try {
        this.loading = true
        const params = {
          date: this.selectedDate
        }
        if (this.selectedDeptId) {
          params.dept_id = this.selectedDeptId
        }

        // API调用示例
        // const res = await this.$client.getOperationalStatistics(params)
        // if (res.head.result === '200') {
        //   this.updateDataCards(res.context)
        // }

        // 暂时使用模拟数据
        this.updateDataCards({
          passenger_flow: 5960,
          passenger_flow_yoy: 1.6,
          completion_rate: 99.5,
          completion_rate_yoy: -0.5,
          mileage_utilization: 95.3,
          mileage_utilization_yoy: 1.6,
          total_revenue: 5960,
          total_revenue_yoy: -0.5,
          punctuality_rate: 98.5,
          punctuality_rate_yoy: 1.6,
          first_last_punctuality: 98.0,
          first_last_punctuality_yoy: -0.5
        })

      } catch (error) {
        console.error('加载营运统计数据失败:', error)
        this.$message.error('加载数据失败')
      } finally {
        this.loading = false
      }
    },

    // 更新数据卡片
    updateDataCards(data) {
      this.dataCards.forEach(card => {
        let value = data[card.dataKey] || 0
        let yoyValue = data[card.dataKey + '_yoy'] || 0

        // 特殊处理不同类型的数据
        switch (card.dataKey) {
          case 'passenger_flow':
            card.value = value.toLocaleString()
            break
          case 'completion_rate':
            card.value = `${data.completion_count || 5960}(${value}%)`
            break
          case 'mileage_utilization':
            card.value = `${data.mileage || 211.40}(${value}%)`
            break
          case 'total_revenue':
            card.value = value.toLocaleString()
            break
          case 'punctuality_rate':
          case 'first_last_punctuality':
            card.value = `${value}%`
            break
          default:
            card.value = value.toString()
        }

        card.trend = yoyValue
      })
    },

    // 加载客流趋势数据
    loadPassengerFlowData() {
      this.$dispatch.getDayPassenger({day:7,dept_id:this.selectedDeptId}).then((res) => {
        if (res.head.result === '200') {
          let info = res.content
          this.passengerFlowData.daily.xAxis = info.recent_name
          this.passengerFlowData.daily.data = info.recent_data
        }
      })
      this.$dispatch.getHourPassenger({hour:24,dept_id:this.selectedDeptId}).then((res) => {
        if (res.head.result === '200') {
          let info = res.content
          this.passengerFlowData.hourly.xAxis = info.recent_name
          this.passengerFlowData.hourly.data = info.recent_data
        }
      })
      // get_home_first_line 
      this.$dispatch.getHomeFirstLine({dept_id:this.selectedDeptId}).then((res) => {
        if (res.head.result === '200') {
          let info = res.content
          this.passengerFlowData.per100km.xAxis = info.recent_name
          this.passengerFlowData.per100km.data = info.recent_data
        }
      })
    },

    // 加载热门线路数据
    loadLinePassengerRange(type = 'routes') {
      if(type == 'routes') {
        this.$dispatch.getLinePassengerRange({
          day: 30,
          asc: false,
          number: 20,
          dept_id: this.selectedDeptId
        }).then((res) => {
          if (res.head.result === '200') {
            let info = res.content.result
            this.hotRoutes = info
            console.log('线路客流范围数据res-----------', res);
          }
        })
      } else {
        this.$dispatch.getStationPassengerRange({
          day: 30,
          asc: false,
          number: 20,
          dept_id: this.selectedDeptId
        }).then((res) => {
          if (res.head.result === '200') {
            let info = res.content.result
            this.hotRoutes = info
            console.log('站点客流范围数据res-----------', res);
          }
        })
      }
    },

    // 加载里程分析数据
    loadRouteAnalysisData() {
      let params = {
        asc:false,
        number:10,
        dept_id:this.selectedDeptId,
        bdt:this.$refs.routeAnalysis.dateRange[0],
        edt:this.$refs.routeAnalysis.dateRange[1],
        line_ids:this.$refs.routeAnalysis.selectedLines.join(',')
      }
      this.$dispatch.GetLineMileageStatic(params).then((res) => {
        if (res.head.result === '200') {
          let info = res.content
          this.mileageRankingData = info.list1
          this.dailyMileageData = info.list2
        }
      })
    },

    // 加载线路调度数据
    loadLineDispatchData(type) {
      console.log('主页面加载线路调度数据:', type)
    },

    // 加载服务质量数据
    loadServiceQualityData() {
      // API调用示例
      // getDispatchInterval - 使用默认日期范围（一周前到今天）
      const today = new Date()
      const oneWeekAgo = new Date(today)
      oneWeekAgo.setDate(today.getDate() - 7)
      
      const startDate = oneWeekAgo.toISOString().slice(0, 10)
      const endDate = today.toISOString().slice(0, 10)
      
      this.$dispatch.getDispatchInterval({
        line_group_id: this.selectedDeptId,
        bdt: startDate,
        edt: endDate
      }).then((res) => {
        if (res.head.result === '200') {
          let info = res.content
          console.log('发车间隔数据:', info)
          this.qualityData.intervals = info.disp_other_inteval_base
          this.intervalChartData = info.chart
        }
      })
      
      // getDispatchSpeed - 使用相同的日期范围
      this.$dispatch.getDispatchSpeed({
        line_group_id: this.selectedDeptId,
        bdt: startDate,
        edt: endDate
      }).then((res) => {
        if (res.head.result === '200') {
          let info = res.content
          console.log('营运速度数据:', info)
          this.speedChartData = info.chart
          this.qualityData.speeds = info.disp_other_speed_base || info.disp_other_base
        }
      })
    },

    // 加载包车分析数据
    loadCharterAnalysisData() {
      // API调用示例
      const params = { dept_id: this.selectedDeptId , start_time:this.$refs.charterAnalysis.dateRange[0],end_time:this.$refs.charterAnalysis.dateRange[1]+' 23:59:59' }
      this.$client.getChariotAnalysis(params).then((res) => {
        console.log(res , '包车分析数据')
        if (res.head.result === '200') {
          this.chartData = res.context
        }
      })
    },

    // 窗口大小变化时重绘所有图表
    resizeAllCharts() {
      this.$nextTick(() => {
        // 通知所有子组件重绘图表
        this.$children.forEach(child => {
          if (child.resizeCharts && typeof child.resizeCharts === 'function') {
            child.resizeCharts()
          }
        })
        
        // 也可以通过refs来调用特定组件的resize方法
        const components = [
          'topStatisticsPanel',
          'lineDispatchChartWrapper', 
          'passengerFlowAndHotRoutes',
          'revenueAndRouteRanking',
          'routeAnalysis',
          'serviceQualityAnalysis',
          'charterAnalysis'
        ]
        
        components.forEach(compName => {
          const comp = this.$refs[compName]
          if (comp && comp.resizeCharts && typeof comp.resizeCharts === 'function') {
            comp.resizeCharts()
          }
        })
      })
    },

    // 防抖函数
    debounce(func, wait) {
      let timeout
      return function(...args) {
        const context = this
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          func.apply(context, args)
        }, wait)
      }
    },

    // 事件处理方法
    handleLineDispatchTypeChange(type) {
      console.log('线路调度类型变化:', type)
      this.loadLineDispatchData(type)
    },

    handleLineDispatchDataChange(type) {
      console.log('线路调度数据变化:', type)
    },

    handlePassengerFlowTypeChange(value) {
      console.log('客流趋势类型变化:', value)
    },

    // 热门线路切换
    handleHotRoutesSwitch(type) {
      console.log('热门线路切换:', type)
      this.loadLinePassengerRange(type)
    },

    handleRouteRankingDataChange(data) {
      console.log('线路排名数据变化:', data)
      this.$dispatch.getRevenueMonth({
        dept_id: this.selectedDeptId,
        bdt: data.dateRange[0],
        edt: data.dateRange[1],
        line_ids: data.line_ids
      }).then((res) => {
        if (res.head.result === '200') {
          let info = res.content
          this.revenueData = info.revenue_overview
          this.revenueLineData = info.date_chart
          this.revenuePieData = info.payway_chart
          this.routeRankingData = info.line_pass_revenue_list
        }
      })
    },

    handleRevenueTypeChange(value) {
      console.log('营收类型变化:', value)
    },

    handleRouteAnalysisDataChange(params) {
      this.$dispatch.GetLineMileageStatic({day:7,asc:false,number:10,line_group_id:this.selectedDeptId,line_ids:params.line_ids,bdt:params.dateRange[0],edt:params.dateRange[1]}).then((res) => {
      }).then((res) => {
        if (res.head.result === '200') {
          let info = res.content
          console.log('里程分析数据变化:', info)
          this.mileageRankingData = info
        }
      })
      this.$dispatch.getMileageView({line_group_id:this.selectedDeptId,bdt:params.dateRange[0],edt:params.dateRange[1],line_ids:params.line_ids}).then((res) => {
        if (res.head.result === '200') {  
          let info = res.content
          console.log('里程分析数据变化:', info)
          this.routeStatsData = info
        }
      })

      console.log('里程分析数据变化:', params)
      // 调用相关API获取数据
    },

    // 处理服务质量数据变化
    handleServiceQualityDataChange(params) {
      console.log('服务质量数据变化:', params)
      
      // 使用组件传递的日期范围和线路参数
      const startDate = params.dateRange[0]
      const endDate = params.dateRange[1]
      
      this.$dispatch.getDispatchInterval({
        line_group_id: this.selectedDeptId,
        bdt: startDate,
        edt: endDate,
        line_ids: params.lines
      }).then((res) => {
        if (res.head.result === '200') {
          let info = res.content
          this.qualityData.intervals = info.disp_other_inteval_base
          this.intervalChartData = info.chart
        }
      })
      
      this.$dispatch.getDispatchSpeed({
        line_group_id: this.selectedDeptId,
        bdt: startDate,
        edt: endDate,
        line_ids: params.lines
      }).then((res) => {
        if (res.head.result === '200') {
          let info = res.content
          this.speedChartData = info.chart
          this.qualityData.speeds =  info.disp_other_base
        }
      })
    },

    handleCharterAnalysisDataChange(params) {
      console.log('包车分析数据变化:', params)
      this.$client.getChariotAnalysis({
        dept_id: this.selectedDeptId,
        year:2025,
        start_time: params.issuance_time_start,
        end_time: params.issuance_time_end,
      }).then((res) => {
        console.log(res , '包车分析数据变化')
        if (res.head.result === '200') {
          let info = res.context
          this.chartData = info        
        }
      })
      // 调用相关API获取数据
    },

    // 导出数据
    exportData() {
      this.$message.success('导出成功')
    }
  }
}
</script>

<style lang="stylus" scoped>
.operational-management-dashboard
  width 100%
  background #E0E1E5
  min-height 100vh
  padding 0 10px

  // 统一radio-button样式
  /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner
    background-color #FFF1F2
    border 1px solid #C61D29
    color #C61D29
    -webkit-box-shadow -1px 0 0 0 #C61D29
    box-shadow -1px 0 0 0 #C61D29

  /deep/ .el-radio-button__inner:hover
    color #ee6069

.chart-row
  margin-bottom 10px

  &:last-child
    margin-bottom 0

// 响应式设计
@media (max-width: 1400px)
  .operational-management-dashboard
    padding 0 8px
    transform scale(0.95)
    transform-origin top left
    width 105.3%

@media (max-width: 1200px)
  .operational-management-dashboard
    padding 0 5px
    transform scale(0.85)
    transform-origin top left
    width 117.6%

@media (max-width: 768px)
  .operational-management-dashboard
    padding 0
    background #f5f5f5
    transform scale(0.7)
    transform-origin top left
    width 142.9%
    
  .chart-row
    margin-bottom 8px
    
    /deep/ .el-col
      margin-bottom 8px
      
      &:last-child
        margin-bottom 0

@media (max-width: 480px)
  .operational-management-dashboard
    min-height auto
    transform scale(0.6)
    transform-origin top left
    width 166.7%
    
  .chart-row
    margin-bottom 5px
</style>
