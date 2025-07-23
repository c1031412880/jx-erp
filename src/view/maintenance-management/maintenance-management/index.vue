  <template>
    <div class="maintenance-management-dashboard">
      <!-- 顶部统计面板 -->
      <div class="top-statistics-panel">
        <!-- 数据统计总览 -->
        <div class="statistics-header">
          <h3 class="section-title">
            <el-form :inline="true" size="mini">
              <el-row>
                <el-form-item label="部门:">
                  <dept-select
                    ref="departmentlTree"
                    @on-change="deptChange"
                    :size="'mini'"
                  ></dept-select>
                </el-form-item>
              </el-row>
            </el-form>
          </h3>
        </div>
        
        <!-- 数据卡片区域 -->
        <div class="data-cards-grid">
          <div class="data-card" v-for="(card, index) in dataCards.slice(0, 5)" :key="index">
            <div class="card-header">
              <div class="card-title-wrapper">
                <span class="card-title" style="height: 28px;">{{ card.title }}</span>
                <!-- 燃料类型选择器（仅在燃料消耗卡片显示） -->
                <el-select 
                  v-if="index === 1" 
                  v-model="selectedFuelType" 
                  size="mini" 
                  @change="onFuelTypeChange"
                  style="width: 90px; margin-left: 18px;"
                >
                  <el-option label="全部" value="all"></el-option>
                  <el-option label="气" value="gas"></el-option>
                  <el-option label="氢气" value="hydrogen"></el-option>
                  <el-option label="电" value="electricity"></el-option>
                </el-select>
              </div>
            </div>
            <div class="card-content">
              <div class="card-value">{{ card.value }}</div>
              <div class="card-unit">{{ card.unit }}</div>
            </div>
            <div class="card-trend">
              <span class="trend-text">同比</span>
              <span :class="['trend-value', card.trend > 0 ? 'trend-up' : 'trend-down']">
                <i :class="card.trend > 0 ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
                {{ Math.abs(card.trend) }}%
              </span>
            </div>
            <div class="card-chart" >
              <!-- 小型趋势图 -->
              <div class="mini-chart" :ref="'miniChart' + index"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 第一行图表区域 -->
      <el-row :gutter="10" class="chart-row">
        <!-- 机务数据总览 -->
        <el-col :span="8">
          <machine-data-overview
            :overview-period="overviewPeriod"
            :overview-month="overviewMonth"
            :overview-dept-id="overviewDeptId"
            :overview-data="overviewData"
            :show-dept-selector="showDeptSelector"
            @period-change="handlePeriodChange"
            @month-change="overviewMonth = $event; loadOverviewData()"
            @dept-change="onOverviewDeptChange"
          />
        </el-col>

        <!-- 车辆各年各类型数量分布 -->
        <el-col :span="8">
          <vehicle-distribution-chart
            :company="vehicleDistributionCompany"
            :show-dept-selector="showDeptSelector"
            @company-change="vehicleDistributionCompany = $event"
          />
        </el-col>

                <!-- 车辆分析 -->
        <el-col :span="8">
          <vehicle-analysis-chart
            :analysis-type="vehicleAnalysisType"
            :filters="vehicleAnalysisFilters"
            :department-options="departmentOptions"
            :show-dept-selector="showDeptSelector"
            @type-change="changeVehicleType"
            @filter-change="loadVehicleAnalysisData"
          />
          </el-col>
      </el-row>

      <!-- 第二行图表区域 -->
      <el-row :gutter="10" class="chart-row">
        <el-col :span="8">
          <vehicle-mileage-analysis :dept-id="selectedDeptId" />
        </el-col>

        <el-col :span="8">
          <vehicle-energy-consumption-analysis :dept-id="selectedDeptId" />
        </el-col>

        <!-- 百公司排名TOP 10 -->
        <el-col :span="8">
          <energy-consumption-top10 :dept-id="selectedDeptId" />
        </el-col>
      </el-row>

      <!-- 第三行图表区域 -->
      <el-row :gutter="10" class="chart-row">
        <!-- 机务成本分析 -->
        <el-col :span="12">
                    <div class="chart-container">
              <div class="chart-header">
                <h3>机务成本分析</h3>
                <div class="chart-controls">
                  <el-radio-group v-model="costAnalysisType" size="mini" @change="handleCostAnalysisTypeChange">
                    <el-radio-button :label="1">月</el-radio-button>
                    <el-radio-button :label="2">年</el-radio-button>
                  </el-radio-group>
                  <el-radio-group v-model="costAnalysisQueryType" size="mini" @change="handleCostAnalysisQueryTypeChange" style="margin-left: 10px;">
                    <el-radio-button :label="1">总体</el-radio-button>
                    <el-radio-button :label="2">燃油</el-radio-button>
                    <el-radio-button :label="3">车龄</el-radio-button>
                    <el-radio-button :label="4">车型</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            <div class="chart-content">
              <div ref="costAnalysisChart" style="flex: 1;"></div>
            </div>
          </div>
        </el-col>

        <!-- 维修材料费分析 -->
        <el-col :span="12">
          <material-fee-analysis-chart :dept-id="selectedDeptId" />
            <!-- <div class="chart-content">
              <div class="material-chart-wrapper">
                <div v-if="materialClickIndex == 1" ref="materialFeeChart" style="width: 100%; flex: 1;"></div>
                <div v-if="materialClickIndex == 2" ref="materialRankingChart" style="width: 100%; flex: 1;"></div>
              </div>
            </div> -->
        </el-col>
      </el-row>

      <!-- 第四行：表格和图表 -->
      <el-row :gutter="10" class="chart-row">
        <!-- 车辆维修总览 -->
        <el-col :span="16">
          <vehicle-maintenance-overview @view-detail="editInfo" @view-detail-warehouse="editRowInfo" />
        </el-col>

        <!-- 维修计划执行率 -->
        <el-col :span="8">
          <div class="chart-container">
            <div class="chart-header">
              <h3>维修计划执行率</h3>
            </div>
            <div class="chart-content">
              <div class="plan-chart-wrapper">
                <div ref="maintenancePlanChart" class="plan-chart-inner"></div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="dialog-box">
        <!-- 添加信息 -->
        <add-dialog
          ref="addDialog"
          :dialogBool.sync="addDialogShow"
          :curChangeType="curChangeType"
          :detailLoading="detailLoading"
          :containerLifeData="containerLifeData"
          :isAccidentDetail="isAccidentDetail"
          :isCheckout="isCheckout"
          :state="iState"
          :isAccidentEdit="isAccidentEdit"
        ></add-dialog>
        <information-dialog
          ref="informationDialog"
          :dialogBool.sync="informationDialogShow"
          :curSelecedType="curSelecedType"
          :title="informationDialogTitle"
        ></information-dialog>
      </div>
    </div>
  </template>

  <script>
  import addDialog from "@/view/maintenance-management/repairs-management/component/dialog/add-dialog.vue";
  import informationDialog from "@/view/materials-management/warehouse-management/component/information-dialog.vue";
  import echarts from 'echarts'
  import deptSelect from "@/components/component/dept-select"
  import MachineDataOverview from "./components/MachineDataOverview"
  import VehicleDistributionChart from "./components/VehicleDistributionChart"
  import VehicleAnalysisChart from "./components/VehicleAnalysisChart"
  import VehicleMileageAnalysis from "./components/VehicleMileageAnalysis.vue"
  import VehicleEnergyConsumptionAnalysis from "./components/VehicleEnergyConsumptionAnalysis.vue"
  import EnergyConsumptionTop10 from "./components/EnergyConsumptionTop10.vue"
  import MaterialFeeAnalysisChart from "./components/MaterialFeeAnalysisChart.vue"
  import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
  import VehicleMaintenanceOverview from "./components/VehicleMaintenanceOverview.vue"

  export default {
    name: 'MaintenanceManagementDashboard',
    components: {
      deptSelect,
      MachineDataOverview,
      VehicleDistributionChart,
      VehicleAnalysisChart,
      VehicleMileageAnalysis,
      VehicleEnergyConsumptionAnalysis,
      EnergyConsumptionTop10,
      MaterialFeeAnalysisChart,
      getVehicleSelectDialog,
      addDialog,
      VehicleMaintenanceOverview,
      informationDialog
    },
    computed: {
      // 判断是否显示部门选择器：当顶部选择全部时显示，选择具体部门时隐藏
      showDeptSelector() {
        return !this.selectedDeptId || this.selectedDeptId === '' || this.selectedDeptId === 'all'
      }
    },
    data() {
      const today = new Date();
      const start = new Date();
      start.setDate(today.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      today.setHours(23, 59, 59, 999);
      return {
        // 组织选择相关
        informationDialogShow: false,
        informationDialogTitle: '',
        curSelecedType: '',
        selectedDeptId: '',
        loading: false,
        
                // 燃料类型选择
          selectedFuelType: 'all', // all: 全部, gas: 气, hydrogen: 氢, electricity: 电
          
          // 车辆分析类型
          vehicleAnalysisType: 1, // 1: 能源类型, 2: 品牌, 3: 标台系数
          vehicleChart: null, // 车辆分析图表实例
          vehicleAnalysisFilters: {
            deptId: null,
            selectedMonth: null
          },
          departmentOptions: [], // 部门选项
          
          // 成本分析类型
          costAnalysisType: 2, // 1: 月, 2: 年
          costAnalysisQueryType: 1, // 1: 总体, 2: 燃油, 3: 车龄, 4: 车型
          
          // 材料费分析类型
                  materialFeeType: 2, // 1: 月, 2: 年
        materialClickIndex: 1, // 1: 材料费, 2: 材料使用排名
          // 数据指标卡片
        dataCards: [
          {
            title: '车辆里程',
            value: '0',
            unit: '公里',
            trend: 0,
            icon: 'el-icon-truck',
            dataKey: 'mileage'
          },
          {
            title: '燃料消耗量',
            value: '0',
            unit: '升/百公里',
            trend: 0,
            icon: 'el-icon-lightning',
            dataKey: 'gas_consumption'
          },
          {
            title: '报修次数',
            value: '0',
            unit: '次',
            trend: 0,
            icon: 'el-icon-setting',
            dataKey: 'repair_count'
          },
          {
            title: '物料金额',
            value: '0',
            unit: '元',
            trend: 0,
            icon: 'el-icon-money',
            dataKey: 'material_amount'
          },
          {
            title: '车辆利用率',
            value: '0',
            unit: '%',
            trend: 0,
            icon: 'el-icon-data-analysis',
            dataKey: 'utilization_rate'
          }
        ],
        
        // 每日数据用于迷你图表
        dailyData: null,
        // 机务数据总览
        overviewPeriod: '2', // 1-月度，2-年度
        overviewMonth: null, // 选择的月份
        overviewDeptId: '', // 选择的部门ID
        overviewData: [
          { label: '车辆(辆)', value: '0', unit: '' },
          { label: '线路(条)', value: '0', unit: '' },
          { label: '站点(个)', value: '0', unit: '' },
          { label: '维修车辆(辆)', value: '0', unit: '' },
          { label: '维修总工时(时)', value: '0', unit: '' },
          { label: '材料费用(元)', value: '0', unit: '' },
          { label: '总里程(KM)', value: '0', unit: '' },
          { label: '千公里材料费(元)', value: '0', unit: '' },
          { label: '万公里小修(次)', value: '0', unit: '' },
          { label: '维修人工费比(元)', value: '0', unit: '' }
        ],
        // 车辆分布
        vehicleDistributionCompany: 'all',
        // 车辆分析
        vehicleAnalysisDate: new Date(),
        vehicleAnalysisCompany: 'all',
        rankingData: [],
        // 维修表格
        maintenanceDate: [start, today],
        maintenanceCompany: 'all',
        addDialogShow: false,
        curChangeType: 'add',
        detailLoading: false,
        containerVehicleRecode: {},
        containerLifeData: {},
        isAccidentDetail: false,
        isCheckout: false,
        iState: 0,
        isAccidentEdit: false,
        isAccidentDetail: false,
        isCheckout: false,
        maintenancePlanData: {},
      }
    },
    mounted() {
      this.loadVehicleStatistics()
      this.loadDepartmentOptions()
      this.loadOverviewData()
      console.log('mounted')
      this.initCharts()
    },
    watch: {
      selectedDeptId: {
        handler(newVal) {
          // 只影响顶部5个数据指标卡片（车辆里程、燃料消耗量、报修次数、物料金额、车辆利用率）
          this.loadVehicleStatistics()
        },
        immediate: true
      }
    },
    methods: {
      // 切换机务数据总览时间维度
      handlePeriodChange(value) {
        this.overviewPeriod = value
        if (value === '2') {
          this.overviewMonth = null
        }
        this.loadOverviewData()
      },
      setColor(state) {
        switch (state) {
          case 1:
            return 'rgb(255, 153, 0)'
          case 2:
            return '#0CB780'
          case 3:
            return '#999999'
          default:
            return '#999999'
        }
      },
      // 加载车辆统计数据
      async loadVehicleStatistics() {
        try {
          this.loading = true
          const params = {
            // dept_id: this.selectedDeptId || ''
          }
          if(this.selectedDeptId){
            params.dept_id = this.selectedDeptId
          }
          const res = await this.$client.getVehicleStatistics(params)
          if (res.head.result === '200') {
            this.updateDataCards(res.context)
          }
        } catch (error) {
          console.error('加载车辆统计数据失败:', error)
          this.$message.error('加载数据失败')
        } finally {
          this.loading = false
        }
      },

      // 更新数据卡片（基于新的API数据结构）
      updateDataCards(data) {
        console.log('更新数据卡片，接收到的数据:', data)
        
        this.dataCards.forEach(card => {
          let value = data[card.dataKey] || 0
          let yoyValue = data[card.dataKey + '_yoy'] || 0
          
          // 特殊处理燃料消耗量（根据selectedFuelType显示不同数据）
          if (card.dataKey === 'gas_consumption') {
            const fuelResult = this.calculateFuelConsumption(data)
            console.log('fuelResult',fuelResult)
            value = fuelResult.value
            yoyValue = fuelResult.yoy
            card.unit = fuelResult.unit
            card.title = fuelResult.title
          }
          
          // 格式化显示值
          if (card.dataKey === 'mileage') {
            card.value = value.toFixed(2) // 里程保持原单位
          } else if (card.dataKey === 'material_amount') {
            card.value = value.toFixed(2)
          } else if (card.dataKey === 'utilization_rate') {
            card.value = value.toFixed(2) // 利用率已经是百分比
          } else {
            card.value = value.toFixed(2)
          }
          
          card.trend = yoyValue
        })
        
        // 存储每日数据用于迷你图表
        this.dailyData = {
          mileage: Array.isArray(data.daily_mileage) ? data.daily_mileage : [],
          hydrogen_consumption: Array.isArray(data.daily_hydrogen_consumption) ? data.daily_hydrogen_consumption : [],
          gas_consumption: Array.isArray(data.daily_gas_consumption) ? data.daily_gas_consumption : [],
          electricity_consumption: Array.isArray(data.daily_electricity_consumption) ? data.daily_electricity_consumption : [],
          repair_count: Array.isArray(data.daily_repair_count) ? data.daily_repair_count : [],
          material_amount: Array.isArray(data.daily_material_amount) ? data.daily_material_amount : [],
          utilization_rate: Array.isArray(data.vehicle_utilization) ? data.vehicle_utilization : []
        }
        
        // 重新渲染迷你图表
        this.$nextTick(() => {
          this.initMiniCharts()
        })
      },

      // 加载部门选项数据
      async loadDepartmentOptions() {
        try {
          // 这里可以根据实际的API接口来获取部门数据
          // 暂时使用模拟数据
          this.departmentOptions = [
            { value: '', label: '全部部门' },
            { value: '1', label: '运营部' },
            { value: '2', label: '维修部' },
            { value: '3', label: '调度部' },
            { value: '4', label: '安全部' }
          ]
        } catch (error) {
          console.error('加载部门数据失败:', error)
        }
      },

      // 组织选择变化事件
      onDeptChange(vehs, nodes, parentNode) {
        this.selectedDeptId = vehs || ''
        this.loadVehicleStatistics()
      },

      // 大屏部门选择变化事件
      deptChange(value) {
        this.selectedDeptId = value || ''
        this.loadVehicleStatistics()
        this.initCharts()
        
        // 当选择具体部门时，同步所有子组件的部门选择
        if (value && value !== '' && value !== 'all') {
          this.overviewDeptId = value
          this.vehicleDistributionCompany = value
          this.vehicleAnalysisFilters.deptId = value
        } else {
          // 选择全部时，重置所有子组件的部门选择
          this.overviewDeptId = ''
          this.vehicleDistributionCompany = 'all'
          this.vehicleAnalysisFilters.deptId = null
        }
      },
      editRowInfo(form,type = 'detail') {
        this.$refs.informationDialog.state_name = form.state_name
        this.$client.getDataLeaveHouse({id:form.id})
        .then(res => {
          if(res.head.result == '200') {
            this.curSelecedType = type;
            if(type == 'edit') {
              this.informationDialogTitle = "编辑出库单";
            }else{
              this.informationDialogTitle = "查看出库单";
            }
            this.informationDialogShow = true;
            this.$nextTick(() => {
              this.$refs.informationDialog.setData(res.context)
            })
          }else{
            this.$message({type: 'error', message: '失败'})
          }
        })

      },
      // 机务数据总览部门选择变化事件
      onOverviewDeptChange(value) {
        this.overviewDeptId = value || ''
        this.loadOverviewData()
      },
      editInfo(val) {
        // console.log(val,'数据')
        this.iState = val.state;
        this.addDialogShow = true;
        this.isAccidentDetail = true
        this.isCheckout = false
        this.isAccidentEdit = false
        this.curChangeType = 'addtrue'

        this.$refs["addDialog"].setData(val);
        let params = {
          tyre_id: val.id
        };
        this.$client.getTyreLifeTyreManage(params).then(res => {
          if (res.head.result == "200") {
            this.containerLifeData = res.context.list;
            this.detailLoading = false;
          } else {
            this.$message({ type: "error", message: res.head.describle });
          }
        });
      },
      // 加载机务数据总览
      async loadOverviewData() {
        try {
          this.loading = true
          const params = {
            type: parseInt(this.overviewPeriod),
          }
          
          if (this.overviewPeriod === '1') {
            params.month = this.overviewMonth || new Date().toISOString().slice(0, 7) // 默认当前月份
          }
          
          if (this.overviewDeptId) {
            params.dept_id = this.overviewDeptId
          }
          
          const res = await this.$client.GetMachineDataOverviewmonth(params)
          if (res.head.result === '200') {
            this.updateOverviewData(res.context)
          }
        } catch (error) {
          console.error('加载机务数据总览失败:', error)
          this.$message.error('加载数据失败')
        } finally {
          this.loading = false
        }
      },

      // 更新机务数据总览数据
      updateOverviewData(data) {
        console.log('机务数据总览数据:', data)
        
        // 根据实际API返回的数据结构更新overviewData
        if (data) {
          this.overviewData.forEach((item, index) => {
            switch (item.label) {
              case '车辆(辆)':
                item.value = data.vehicle_count || '0'
                break
              case '线路(条)':
                item.value = data.line_count || '0'
                break
              case '站点(个)':
                item.value = data.station_count || '0'
                break
              case '维修车辆(辆)':
                item.value = data.maintenance_vehicle_count || '0'
                break
              case '维修总工时(时)':
                item.value = data.total_maintenance_hours || '0'
                break
              case '材料费用(元)':
                item.value = data.material_cost || '0'
                break
              case '总里程(KM)':
                item.value = data.total_mileage || '0'
                break
              case '千公里材料费(元)':
                item.value = data.material_cost_per_thousandkm || '0'
                break
              case '万公里小修(次)':
                item.value = data.minor_repairs_per_tenthousandkm || '0'
                break
              case '维修人工费比(元)':
                item.value = data.maintenance_labor_vehicle_ratio || '0'
                break
            }
          })
        }
      },

      // 燃料类型选择变化事件
      onFuelTypeChange() {
        // 重新加载车辆统计数据以更新燃料消耗卡片
        this.loadVehicleStatistics()
      },

      // 计算燃料消耗量
      calculateFuelConsumption(data) {
        const averageYoY = ((data.gas_consumption_yoy || 0) + (data.hydrogen_consumption_yoy || 0) + (data.electricity_consumption_yoy || 0)) / 3;
        const formattedYoY = averageYoY.toFixed(2); // 例如 "3.14"
        const typeMap = {
          all: {
            title: '燃料消耗量',
            unit: '升/百公里',
            value: (data.gas_consumption || 0) + (data.hydrogen_consumption || 0) + (data.electricity_consumption || 0),
            yoy: formattedYoY
          },
          gas: {
            title: '天然气消耗',
            unit: 'm³/百公里',
            value: data.gas_consumption || 0,
            yoy: data.gas_consumption_yoy || 0
          },
          hydrogen: {
            title: '氢气消耗',
            unit: 'kg/百公里',
            value: data.hydrogen_consumption || 0,
            yoy: data.hydrogen_consumption_yoy || 0
          },
          electricity: {
            title: '电气消耗',
            unit: 'kWh/百公里',
            value: data.electricity_consumption || 0,
            yoy: data.electricity_consumption_yoy || 0
          }
        }

        return typeMap[this.selectedFuelType] || typeMap.all
      },

      // 获取燃料消耗图表数据
      getFuelConsumptionChartData() {
        let values = []
        let xAxis = []
        let hasData = false

        // 根据selectedFuelType返回不同的数据结构
        if (this.selectedFuelType === 'all') {
          // 全部模式：返回三种燃料的数据
          const gasData = this.dailyData && this.dailyData.gas_consumption ? this.dailyData.gas_consumption : []
          const hydrogenData = this.dailyData && this.dailyData.hydrogen_consumption ? this.dailyData.hydrogen_consumption : []
          const electricityData = this.dailyData && this.dailyData.electricity_consumption ? this.dailyData.electricity_consumption : []
          
          if (gasData.length > 0 || hydrogenData.length > 0 || electricityData.length > 0) {
            // 使用最长的数据作为基准
            const maxLength = Math.max(gasData.length, hydrogenData.length, electricityData.length)
            const sourceData = gasData.length >= maxLength ? gasData : 
                            hydrogenData.length >= maxLength ? hydrogenData : electricityData
            
            xAxis = sourceData.map(item => {
              const date = new Date(item.date)
              return `${date.getMonth() + 1}/${date.getDate()}`
            })
            
            values = {
              gas: gasData.map(item => item.value || 0),
              hydrogen: hydrogenData.map(item => item.value || 0),
              electricity: electricityData.map(item => item.value || 0)
            }
            hasData = true
          }
        } else {
          // 单一类型模式
          const dataKey = this.selectedFuelType + '_consumption'
          const sourceData = this.dailyData && this.dailyData[dataKey] ? this.dailyData[dataKey] : []
          
          if (sourceData.length > 0) {
            values = sourceData.map(item => item.value || 0)
            xAxis = sourceData.map(item => {
              const date = new Date(item.date)
              return `${date.getMonth() + 1}/${date.getDate()}`
            })
            hasData = true
          }
        }

        return { values, xAxis, hasData }
      },

      // 获取燃料消耗图表配置
      getFuelConsumptionChartOption(commonTooltip, xAxisData, dailyValues, hasData) {
        const option = {
          tooltip: {
            ...commonTooltip,
            formatter: this.getFuelTooltipFormatter(hasData)
          },
          grid: { top: 5, bottom: 5, left: 5, right: 5 },
          xAxis: { type: 'category', show: false, data: xAxisData },
          yAxis: { type: 'value', show: false },
          series: []
        }

        if (this.selectedFuelType === 'all' && typeof dailyValues === 'object') {
          // 全部模式：显示三条线
          const colors = [
            { name: '天然气', color: '#409EFF', data: dailyValues.gas || [], unit: 'm³/百公里' },
            { name: '氢气', color: '#67C23A', data: dailyValues.hydrogen || [], unit: 'kg/百公里' },
            { name: '电气', color: '#E6A23C', data: dailyValues.electricity || [], unit: 'kWh/百公里' }
          ]

          colors.forEach((fuel, index) => {
            if (fuel.data.length > 0) {
              option.series.push({
                name: fuel.name,
                type: 'line',
                data: fuel.data,
                smooth: true,
                lineStyle: { color: fuel.color, width: 1.5 },
                showSymbol: false
              })
            }
          })
        } else {
          // 单一类型模式：显示单条线
          const colorMap = {
            gas: '#409EFF',
            hydrogen: '#67C23A', 
            electricity: '#E6A23C'
          }
          
          option.series.push({
            type: 'line',
            data: Array.isArray(dailyValues) ? dailyValues : [],
            smooth: true,
            lineStyle: { color: colorMap[this.selectedFuelType] || '#67C23A', width: 2 },
            areaStyle: { color: `rgba(103, 194, 58, 0.2)` },
            showSymbol: false
          })
        }

        return option
      },

      // 获取燃料tooltip格式化器
      getFuelTooltipFormatter(hasData) {
        return (params) => {
          if (!params || params.length === 0) return '无数据'
          
          const date = params[0].name || '无数据'
          const dataSource = hasData ? '' : ' (模拟数据)'
          
          if (this.selectedFuelType === 'all') {
            // 全部模式：显示多个燃料类型
            let content = `${date}<br/>`
            params.forEach(param => {
              const value = typeof param.value === 'number' ? param.value.toFixed(2) : param.value || '0'
              const unitMap = {
                '天然气': 'm³/百公里',
                '氢气': 'kg/百公里',
                '电气': 'kWh/百公里'
              }
              const unit = unitMap[param.seriesName] || '升/百公里'
              content += `${param.marker}${param.seriesName}: ${value} ${unit}<br/>`
            })
            return content + dataSource
          } else {
            // 单一类型模式
            const param = params[0]
            const value = typeof param.value === 'number' ? param.value.toFixed(2) : param.value || '0'
            const unitMap = {
              gas: 'm³/百公里',
              hydrogen: 'kg/百公里',
              electricity: 'kWh/百公里'
            }
            const unit = unitMap[this.selectedFuelType] || '升/百公里'
            const nameMap = {
              gas: '天然气',
              hydrogen: '氢气',
              electricity: '电气'
            }
            const name = nameMap[this.selectedFuelType] || '燃料消耗量'
            return `${date}<br/>${name}: ${value} ${unit}${dataSource}`
          }
        }
      },



      initCharts() {
        this.initMiniCharts()
        this.initCostAnalysisChart()
        this.initFuelAnalysisChart()
        this.initMaintenancePlanChart()
      },
      
      // 初始化迷你图表（使用新的每日数据结构）
      initMiniCharts() {
        this.dataCards.forEach((card, index) => {
          const chartDom = this.$refs['miniChart' + index][0]
          if (chartDom) {
            const chart = echarts.init(chartDom)
            let option = {}
            
            // 获取对应的每日数据
            let dailyValues = []
            let xAxisData = []
            let hasData = false
            
            if (this.dailyData) {
              switch(index) {
                case 0: // 车辆里程
                  if (this.dailyData.mileage && Array.isArray(this.dailyData.mileage) && this.dailyData.mileage.length > 0) {
                    dailyValues = this.dailyData.mileage.map(item => item.value || 0)
                    xAxisData = this.dailyData.mileage.map(item => {
                      const date = new Date(item.date)
                      return `${date.getMonth() + 1}/${date.getDate()}`
                    })
                    hasData = true
                  }
                  break
                  
                case 1: // 燃料消耗（根据selectedFuelType显示不同数据）
                  const fuelData = this.getFuelConsumptionChartData()
                  dailyValues = fuelData.values
                  xAxisData = fuelData.xAxis
                  hasData = fuelData.hasData
                  break
                  
                case 2: // 报修次数
                  if (this.dailyData.repair_count && Array.isArray(this.dailyData.repair_count) && this.dailyData.repair_count.length > 0) {
                    dailyValues = this.dailyData.repair_count.map(item => item.value || 0)
                    xAxisData = this.dailyData.repair_count.map(item => {
                      const date = new Date(item.date)
                      return `${date.getMonth() + 1}/${date.getDate()}`
                    })
                    hasData = true
                  }
                  break
                  
                case 3: // 物料金额
                  if (this.dailyData.material_amount && Array.isArray(this.dailyData.material_amount) && this.dailyData.material_amount.length > 0) {
                    dailyValues = this.dailyData.material_amount.map(item => item.value || 0)
                    xAxisData = this.dailyData.material_amount.map(item => {
                      const date = new Date(item.date)
                      return `${date.getMonth() + 1}/${date.getDate()}`
                    })
                    hasData = true
                  }
                  break
                  
                case 4: // 车辆利用率
                  if (this.dailyData.utilization_rate && Array.isArray(this.dailyData.utilization_rate) && this.dailyData.utilization_rate.length > 0) {
                    dailyValues = this.dailyData.utilization_rate.map(item => item.value || 0)
                    xAxisData = this.dailyData.utilization_rate.map(item => {
                      const date = new Date(item.date)
                      return `${date.getMonth() + 1}/${date.getDate()}`
                    })
                    hasData = true
                  }
                  break
              }
            }
            
            // 如果没有数据，使用默认数据
            if (!hasData || dailyValues.length === 0) {
              // 生成最近7天的日期
              const today = new Date()
              xAxisData = []
              for (let i = 6; i >= 0; i--) {
                const date = new Date(today)
                date.setDate(today.getDate() - i)
                xAxisData.push(`${date.getMonth() + 1}/${date.getDate()}`)
              }
              
              switch(index) {
                case 0: // 车辆里程
                  dailyValues = [15200, 16800, 14500, 17200, 18900, 19500, 20100]
                  break
                case 1: // 燃料消耗
                  if (this.selectedFuelType === 'all') {
                    dailyValues = {
                      gas: [12.5, 13.2, 11.8, 14.1, 13.7, 12.9, 13.5],
                      hydrogen: [8.3, 8.7, 7.9, 9.1, 8.5, 8.8, 9.2],
                      electricity: [45.7, 47.2, 44.1, 48.9, 46.3, 47.8, 48.1]
                    }
                  } else {
                    const defaultValues = {
                      gas: [12.5, 13.2, 11.8, 14.1, 13.7, 12.9, 13.5],
                      hydrogen: [8.3, 8.7, 7.9, 9.1, 8.5, 8.8, 9.2],
                      electricity: [45.7, 47.2, 44.1, 48.9, 46.3, 47.8, 48.1]
                    }
                    dailyValues = defaultValues[this.selectedFuelType] || defaultValues.gas
                  }
                  break
                case 2: // 报修次数
                  dailyValues = [23, 18, 31, 24, 19, 27, 22]
                  break
                case 3: // 物料金额
                  dailyValues = [85600, 92400, 78300, 103200, 89700, 96800, 91500]
                  break
                case 4: // 车辆利用率
                  dailyValues = [85.2, 88.7, 82.1, 91.5, 86.8, 89.3, 87.9]
                  break
                default:
                  dailyValues = [0, 0, 0, 0, 0, 0, 0]
              }
            }
            
            // 通用tooltip配置
            const commonTooltip = {
              trigger: 'axis',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: '#e4e7ed',
              borderWidth: 1,
              textStyle: {
                color: '#333',
                fontSize: 12
              },
                          formatter: function(params) {
                if (params && params.length > 0) {
                  const param = params[0]
                  const date = param.name || '无数据'
                  const value = typeof param.value === 'number' ? param.value.toFixed(2) : param.value || '0'
                  const dataSource = hasData ? '' : ' (模拟数据)'
                  return `${date}<br/>${card.title}: ${value} ${card.unit}${dataSource}`
                }
                return '无数据'
              }
            }
            
            // 根据索引设置不同的图表类型
            switch(index) {
              case 0: // 车辆里程 - 曲线图
                option = {
                  tooltip: commonTooltip,
                  grid: { top: 5, bottom: 5, left: 5, right: 5 },
                  xAxis: { type: 'category', show: false, data: xAxisData },
                  yAxis: { type: 'value', show: false },
                  series: [{
                    type: 'line',
                    data: dailyValues,
                    smooth: true,
                    lineStyle: { color: '#409EFF', width: 2 },
                    areaStyle: { color: 'rgba(64, 158, 255, 0.2)' },
                    showSymbol: false
                  }]
                }
                break
                
              case 1: // 燃料消耗趋势 - 曲线图
                option = this.getFuelConsumptionChartOption(commonTooltip, xAxisData, dailyValues, hasData)
                break
                
              case 2: // 报修次数 - 柱状图
                option = {
                  tooltip: commonTooltip,
                  grid: { top: 5, bottom: 5, left: 5, right: 5 },
                  xAxis: { type: 'category', show: false, data: xAxisData },
                  yAxis: { type: 'value', show: false },
                  series: [{
                    type: 'bar',
                    data: dailyValues,

                    itemStyle: { 
                      color: '#409EFF',
                      borderRadius: [2, 2, 0, 0]
                    }
                  }]
                }
                break
                
              case 3: // 物料金额 - 柱状图
                option = {
                  tooltip: commonTooltip,
                  grid: { top: 5, bottom: 5, left: 5, right: 5 },
                  xAxis: { type: 'category', show: false, data: xAxisData },
                  yAxis: { type: 'value', show: false },
                  series: [{
                    type: 'bar',
                    data: dailyValues,
                    itemStyle: { 
                      color: '#409EFF',
                      borderRadius: [2, 2, 0, 0]
                    }
                  }]
                }
                break
                
              case 4: // 车辆利用率 - 柱状图
                option = {
                  tooltip: commonTooltip,
                  grid: { top: 5, bottom: 5, left: 5, right: 5 },
                  xAxis: { type: 'category', show: false, data: xAxisData },
                  yAxis: { type: 'value', show: false },
                  series: [{
                    type: 'bar',
                    data: dailyValues,
                    itemStyle: { 
                      color: '#409EFF',
                      borderRadius: [2, 2, 0, 0]
                    }
                  }]
                }
                break
                
              default:
                option = {
                  tooltip: commonTooltip,
                  grid: { top: 5, bottom: 5, left: 5, right: 5 },
                  xAxis: { type: 'category', show: false, data: xAxisData },
                  yAxis: { type: 'value', show: false },
                  series: [{
                    type: 'line',
                    data: dailyValues,
                    smooth: true,
                    lineStyle: { color: '#409EFF', width: 1 },
                    areaStyle: { color: 'rgba(64, 158, 255, 0.3)' },
                    showSymbol: false
                  }]
                }
            }
            
            chart.setOption(option)
            
            // 响应式处理
            window.addEventListener('resize', () => {
              chart.resize()
            })
          }
        })
      },

      // 车辆分析类型切换（保留给组件调用）
      changeVehicleType(index) {
        this.vehicleAnalysisType = index
      },

      // 机务成本分析类型变化
      handleCostAnalysisTypeChange(value) {
        this.costAnalysisType = value
        this.loadCostAnalysisData()
      },

      // 机务成本分析查询类型变化
      handleCostAnalysisQueryTypeChange(value) {
        this.costAnalysisQueryType = value
        this.loadCostAnalysisData()
      },

      // 车辆维修总览标签变化
      handleMaintenanceTabChange(value) {
        // 已移至子组件处理
      },

      // 车辆里程分析（使用大屏项目的GetVehicleMileage接口）
      // initMileageAnalysisChart() { ... } // 已移至子组件

      // 获取车辆里程数据（模仿大屏项目的接口调用）
      // async GetVehicleMileage() { ... } // 已移至子组件

      // 模拟车辆里程数据
      // renderMockMileageData() { ... } // 已移至子组件

      // 车辆能耗分析（从大屏项目移植）
      // initEnergyConsumptionChart() { ... } // 已移至子组件

      // 月/年切换
      // changeEnergyPeriod(type) { ... } // 已移至子组件

      // 能耗类型切换
      // changeEnergyType(index) { ... } // 已移至子组件

      // 重置能耗卡片标题和单位
      // resetEnergyCardList() { ... } // 已移至子组件

      // 百分比处理
      // replacePercent(str) { ... } // 已移至子组件

      // 加载车辆能耗数据
      // async loadEnergyConsumptionData() { ... } // 已移至子组件

      // 模拟能耗数据
      // renderMockEnergyData() { ... } // 已移至子组件

      // 渲染车辆能耗图表
      // renderEnergyConsumptionChart(xData = [], yData = []) { ... } // 已移至子组件
      
      // 加载车辆分析数据
      loadVehicleAnalysisData(filters) {
        this.vehicleAnalysisFilters = filters
        this.loadVehicleStatistics()
      },

      // 成本分析图表
      initCostAnalysisChart() {
        this.costAnalysisType = 2 // 默认按年统计
        this.costAnalysisQueryType = 1 // 默认总体分析
        console.log('initCostAnalysisChart')
        this.loadCostAnalysisData()
      },

      // 加载成本分析数据
      async loadCostAnalysisData() {
        console.log('loadCostAnalysisData')
        try {
          const params = {
            type: this.costAnalysisType,
            dept_id: this.selectedDeptId,
            query_type: this.costAnalysisQueryType,
            server_id: '60.191.59.11'
          }
          
          if (this.costAnalysisType === 1) {
            const now_date = new Date()
            params.month = now_date.getFullYear() + '-' + String(now_date.getMonth() + 1).padStart(2, '0')
          }
          
          const res = await this.$client.GetVehicleCostAnalysis(params)
          if (res.head.result === '200') {
            this.renderCostAnalysisChart(res.context || [])
          }
        } catch (error) {
          console.error('加载成本分析数据失败:', error)
          // 使用模拟数据
          const mockData = [
            { type: '2022年', materital_fee: 1200000, val_fee: 800000, hour_fee: 400000, kilometer_fee: 15.5 },
            { type: '2023年', materital_fee: 1350000, val_fee: 850000, hour_fee: 420000, kilometer_fee: 16.2 },
            { type: '2024年', materital_fee: 1500000, val_fee: 900000, hour_fee: 450000, kilometer_fee: 17.1 }
          ]
          this.renderCostAnalysisChart(mockData)
        }
      },

      // 渲染成本分析图表
      renderCostAnalysisChart(data) {
        const chartDom = this.$refs.costAnalysisChart
        if (chartDom) {
          const chart = echarts.init(chartDom)
          
          const items = [
            {
              name: '材料费',
              key: 'materital_fee',
              type: 'bar',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: '#409EFF' },
                    { offset: 1, color: '#79bbff' }
                  ]
                }
              }
            },
            {
              name: '能耗费用',
              key: 'val_fee',
              type: 'bar',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: '#67C23A' },
                    { offset: 1, color: '#95d475' }
                  ]
                }
              }
            },
            {
              name: '工时费',
              key: 'hour_fee',
              type: 'bar',
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: '#E6A23C' },
                    { offset: 1, color: '#eebe77' }
                  ]
                }
              }
            },
            {
              name: '千公里营运成本',
              key: 'kilometer_fee',
              type: 'line',
              symbol: 'circle',
              symbolSize: 6,
              yAxisIndex: 1,
              lineStyle: {
                color: '#F56C6C',
                width: 3
              },
              itemStyle: {
                color: '#F56C6C'
              }
            }
          ]

          const option = {
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderColor: '#e4e7ed',
              borderWidth: 1,
              textStyle: {
                color: '#333'
              }
            },
            legend: {
              bottom: '0%',
              itemWidth: 10,
              itemHeight: 10,
              textStyle: {
                color: '#333',
                fontSize: 12
              }
            },
            grid: {
              top: '5%',
              left: '8%',
              right: '8%',
              bottom: '15%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: data.map(x => x.type),
              axisLabel: {
                color: '#333'
              },
              axisLine: {
                lineStyle: {
                  color: '#e4e7ed'
                }
              }
            },
            yAxis: [
              {
                type: 'value',
                axisLabel: {
                  color: '#333'
                },
                axisLine: {
                  lineStyle: {
                    color: '#e4e7ed'
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#f5f7fa'
                  }
                }
              },
              {
                type: 'value',
                show: false,
                axisLabel: {
                  color: '#333'
                }
              }
            ],
            series: items.map(item => ({
              ...item,
              data: data.map(x => x[item.key])
            }))
          }
          
          chart.setOption(option)
        }
      },

      // 维修材料费分析图表
      initFuelAnalysisChart() {
        this.materialFeeType = 2 // 默认按年统计
        this.materialClickIndex = 1 // 默认显示材料费
        this.loadMaterialFeeData()
      },

      // 材料费时间类型切换
      changeMaterialTimeType(type) {
        this.materialFeeType = type
        this.loadMaterialFeeData()
      },

      // 材料费分析类型切换
      changeMaterialType(index) {
        this.materialClickIndex = index
        this.loadMaterialFeeData()
      },

      // 加载材料费数据
      async loadMaterialFeeData() {
        try {
          const params = {
            type: this.materialFeeType,
            dept_id: this.selectedDeptId,
            server_id: '60.191.59.11'
          }
          
          if (this.materialFeeType === 1) {
            const now_date = new Date()
            params.month = now_date.getFullYear() + '-' + String(now_date.getMonth() + 1).padStart(2, '0')
          }
          let res = null
          if(this.materialClickIndex === 1){
            res = await this.$client.GetMaterialFee(params)
          }else{
            res = await this.$client.GetMateriarStatistic(params)
          }
          console.log('res',res)
          if (res.head.result === '200') {
            if (this.materialClickIndex === 1) {
              this.renderMaterialFeeChart(res.context || {})
            } else {
              this.renderMaterialRankingChart(res.context || {})
            }
          }
        } catch (error) {
          console.error('加载材料费数据失败:', error)
          // 使用模拟数据
          if (this.materialClickIndex === 1) {
            const mockData = {
              fee_total: [
                { month: '2024-01', fee: 120000 },
                { month: '2024-02', fee: 135000 },
                { month: '2024-03', fee: 128000 },
                { month: '2024-04', fee: 142000 },
                { month: '2024-05', fee: 155000 },
                { month: '2024-06', fee: 148000 }
              ]
            }
            this.renderMaterialFeeChart(mockData)
          } else {
            const mockRankingData = {
              material_ranking: [
                { name: '刹车片', usage: 450, cost: 85000 },
                { name: '机油', usage: 320, cost: 65000 },
                { name: '轮胎', usage: 280, cost: 120000 },
                { name: '空滤', usage: 220, cost: 35000 },
                { name: '电瓶', usage: 180, cost: 95000 }
              ]
            }
            this.renderMaterialRankingChart(mockRankingData)
          }
        }
      },

      // 渲染材料费图表
      renderMaterialFeeChart(data) {
        const chartDom = this.$refs.materialFeeChart
        if (chartDom) {
          console.log('renderMaterialFeeChart',data)
          const chart = echarts.init(chartDom)
          
          const fee_total = data.fee_total || []
          const xData = fee_total.map(x => x.month)
          const yData = fee_total.map(x => x.fee)

          const option = {
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderColor: '#e4e7ed',
              borderWidth: 1,
              textStyle: {
                color: '#333'
              }
            },
            grid: {
              top: '10%',
              left: '8%',
              right: '5%',
              bottom: '15%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: xData,
              axisLabel: {
                color: '#333'
              },
              axisLine: {
                lineStyle: {
                  color: '#e4e7ed'
                }
              }
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                color: '#333',
                formatter: value => {
                  if (value >= 10000) {
                    return (value / 10000).toFixed(1) + '万'
                  }
                  return value
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#e4e7ed'
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#f5f7fa'
                }
              }
            },
            series: [{
              name: '材料费',
              type: 'line',
              data: yData,
              symbol: 'circle',
              symbolSize: 6,
              smooth: true,
              lineStyle: {
                color: '#409EFF',
                width: 3
              },
              itemStyle: {
                color: '#409EFF'
              },
              areaStyle: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(64, 158, 255, 0.3)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(64, 158, 255, 0.05)'
                    }
                  ]
                }
              }
            }]
          }
          chart.setOption(option)
        }
      },

      // 渲染材料使用排名图表
      renderMaterialRankingChart(data) {
        const chartDom = this.$refs.materialRankingChart
        if (chartDom) {
          const chart = echarts.init(chartDom)
          
          const material_ranking = data.material_ranking || []
          const names = material_ranking.map(x => x.name)
          const usageData = material_ranking.map(x => x.usage)
          const costData = material_ranking.map(x => x.cost)

          const option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderColor: '#e4e7ed',
              borderWidth: 1,
              textStyle: {
                color: '#333'
              }
            },
            legend: {
              data: ['使用次数', '总成本'],
              top: '5%',
              textStyle: {
                color: '#333'
              }
            },
            grid: {
              top: '15%',
              left: '8%',
              right: '8%',
              bottom: '15%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: names,
              axisLabel: {
                color: '#333',
                rotate: 30
              },
              axisLine: {
                lineStyle: {
                  color: '#e4e7ed'
                }
              }
            },
            yAxis: [
              {
                type: 'value',
                name: '使用次数',
                position: 'left',
                axisLabel: {
                  color: '#333'
                },
                axisLine: {
                  lineStyle: {
                    color: '#e4e7ed'
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: '#f5f7fa'
                  }
                }
              },
              {
                type: 'value',
                name: '总成本(元)',
                position: 'right',
                axisLabel: {
                  color: '#333',
                  formatter: value => {
                    if (value >= 10000) {
                      return (value / 10000).toFixed(1) + '万'
                    }
                    return value
                  }
                },
                axisLine: {
                  lineStyle: {
                    color: '#e4e7ed'
                  }
                }
              }
            ],
            series: [
              {
                name: '使用次数',
                type: 'bar',
                yAxisIndex: 0,
                data: usageData,
                itemStyle: {
                  color: '#409EFF'
                },
                barWidth: 30
              },
              {
                name: '总成本',
                type: 'line',
                yAxisIndex: 1,
                data: costData,
                lineStyle: {
                  color: '#67C23A',
                  width: 3
                },
                itemStyle: {
                  color: '#67C23A'
                },
                symbol: 'circle',
                symbolSize: 6
              }
            ]
          }
          chart.setOption(option)
        }
      },

      // 维修计划执行率饼图
      async initMaintenancePlanChart() {
        const chartDom = this.$refs.maintenancePlanChart
        let res = await this.$client.GetMaintenancePlanExecutionReportHomePage({
          dept_id: this.selectedDeptId,
        })
        console.log('res123',res)
        
        if (res.head.result === '200') {
          let data = res.context
          console.log('data123',data)
          this.maintenancePlanData = data
          
          if (chartDom) {
            const chart = echarts.init(chartDom)
            
            // 根据接口返回的数据结构处理数据
            const planTypes = data.plan_types || []
            const totalPlans = data.total_plans || 0
            
            // 定义颜色配置
            const colorList = [
              { colorStart: '#16B0A9', colorEnd: '#16B0A9' },
              { colorStart: '#FFF100', colorEnd: '#FAA53F' },
              { colorStart: '#4DD8FF', colorEnd: '#0078FA' },
              { colorStart: '#B792F1', colorEnd: '#801ED6' },
              { colorStart: '#FFD33B', colorEnd: '#F06B1D' },
              { colorStart: '#EB7375', colorEnd: '#F3EED9' },
              { colorStart: '#B7F98F', colorEnd: '#F9F871' }
            ]
            
            // 处理图表数据
            const chartData = planTypes.map((item, index) => {
              const colorIndex = index % colorList.length
              return {
                value: item.count,
                name: item.type_name,
                percentage: item.percentage,
                itemStyle: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: colorList[colorIndex].colorStart },
                    { offset: 1, color: colorList[colorIndex].colorEnd }
                  ])
                }
              }
            })
            
            const option = {
              tooltip: {
                trigger: 'item',
                formatter: function(params) {
                  const percentage = params.data.percentage !== undefined ? params.data.percentage : 0
                  return `${params.name}<br/>数量: ${params.value}<br/>占比: ${percentage}%`
                }
              },
              legend: {
                type: 'plain',
                orient: 'horizontal',
                bottom: '5%',
                left: 'center',
                itemWidth: 12,
                itemHeight: 12,
                itemGap: 20,
                textStyle: {
                  color: '#333',
                  fontSize: 14,
                },
                tooltip: {
                  show: true,
                },
                formatter: name => {
                  const item = chartData.find(item => item.name === name)
                  if (item) {
                    const rate = item.percentage ? `(${item.percentage}%)` : ''
                    return `${item.name} (${item.value}) ${rate}`
                  }
                  return name
                }
              },
              series: [{
                type: 'pie',
                radius: ['35%', '55%'],
                center: ['50%', '40%'],
                avoidLabelOverlap: true,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                data: chartData
              }],
              graphic: {
                type: 'text',
                left: 'center',
                top: '35%',
                z: 10,
                style: {
                  text: `${totalPlans}\n计划车辆`,
                  textAlign: 'center',
                  fill: '#333',
                  fontSize: 20, // 字体更大
                  fontWeight: 'bold',
                  lineHeight: 18 // 可选，调整行间距
                }
              }
            }
            
            chart.setOption(option)
          }
        }
      },

      // 表格数据加载方法已移至子组件
    },

    beforeDestroy() {
      // 销毁图表实例
      if (this.charts) {
        this.charts.forEach(chart => chart.dispose())
      }
      if (this.vehicleChart) {
        this.vehicleChart.dispose()
      }
      if (this.energyChart) {
        this.energyChart.dispose()
      }
    }
  }
  </script>

  <style lang="stylus" scoped>
  .maintenance-management-dashboard
    width 100%
    background #E0E1E5
    min-height 100vh
    
    // 统一radio-button样式
    /deep/ .el-radio-button__orig-radio:checked+.el-radio-button__inner
      background-color #FFF1F2
      border 1px solid #C61D29
      color #C61D29
      -webkit-box-shadow -1px 0 0 0 #C61D29
      box-shadow -1px 0 0 0 #C61D29
      
    /deep/ .el-radio-button__inner:hover
      color #ee6069

  // 顶部统计面板
  .top-statistics-panel
    background white
    border-radius 8px
    box-shadow 0 2px 8px rgba(0, 0, 0, 0.1)
    padding 12px
    margin-bottom 10px
    
    .statistics-header
      display flex
      align-items center
      margin-bottom 8px
      
      .section-title
        margin 0
        font-size 16px
        font-weight 600
        color #333
        display flex
        align-items center
        
        i
          margin-right 8px
          font-size 18px
          color #409EFF
          
      .dept-selector
        display flex
        align-items center
        gap 8px
        
        .selector-label
          font-size 12px
          color #666
          white-space nowrap
          
    .data-cards-grid
      display: grid
      grid-template-columns: repeat(5, 1fr)
      gap: 8px

  .data-card
    background: white 
    border-radius: 6px
    padding: 12px
    position: relative
    display: flex
    flex-direction: column
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08)
    
    .card-header
      display: flex
      justify-content: space-between
      align-items: center
      margin-bottom: 8px
        
      .card-title-wrapper
        display: flex
        align-items: center
        flex-grow: 1
      
      .card-title
        font-size: 12px
        color: #666
        font-weight: 500
        line-height: 1.2
        height: 24px
      
    .card-icon
      font-size: 16px
      color: #409EFF
      background: rgba(64, 158, 255, 0.1)
      padding: 4px
      border-radius: 6px
        
    .card-content
      display: flex
      align-items: baseline
      margin-bottom: 8px
      flex-shrink: 0
      
      .card-value
        font-size: 20px
        font-weight: 700
        color: #333
        margin-right: 4px
        line-height: 1.1
        
      .card-unit
        font-size: 10px
        color: #999
        font-weight: 500
        
    .card-trend
      display: flex
      align-items: center
      font-size: 10px
      margin-bottom: 8px
      flex-shrink: 0
      
      .trend-text
        color: #666
        margin-right: 4px
        font-weight: 500
        
      .trend-value
        display: flex
        align-items: center
        font-weight: 600
        
        &.trend-up
          color: #67C23A
          
        &.trend-down
          color: #F56C6C
          
        i
          margin-right: 2px
          
    .mini-chart
      height: 25px
      width: 100%
      flex: 1
      margin-top: auto

  .chart-row
    margin-bottom: 10px
    
    &:last-child
      margin-bottom: 0

  // 响应式适配
  @media (max-width: 1400px)
    .data-cards-grid
      grid-template-columns: repeat(5, 1fr)
      gap: 10px
      
    .data-card
      height: 160px
      padding: 16px
      
      .card-content .card-value
        font-size: 20px

  @media (max-width: 1200px)
    .data-cards-grid
      grid-template-columns: repeat(3, 1fr)
      gap: 10px
      
    .data-card
      min-height: 240px

  .chart-container
    background: white
    border-radius: 8px
    padding: 16px
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
    height: 420px
    display: flex
    flex-direction: column
    
    .chart-header
      display: flex
      justify-content: space-between
      align-items: center
      margin-bottom: 15px
      flex-wrap: wrap
      gap: 10px
      flex-shrink: 0
      
      h3
        font-size: 18px;
        font-weight: 600;
        margin: 0;
        color: #303133;
        
      .chart-controls
        display: flex
        align-items: center
        gap: 10px
        flex-wrap: wrap
        
    .chart-content
      position: relative
      flex: 1
      display: flex
      flex-direction: column

  // 保留原有样式（兼容性）
  .overview-data
    display: flex
    flex-direction: column
    height: 100%
    
    .overview-row
      flex: 1
      display: flex
      flex-direction: column
      
      &:first-child
        border-bottom: 2px solid #e0e0e0
        margin-bottom: 8px
        padding-bottom: 8px
      
      .overview-item
        flex: 1
        display: flex
        justify-content: space-between
        align-items: center
        padding: 6px 0
        border-bottom: 1px solid #f0f0f0
        
        &:last-child
          border-bottom: none
          
        .overview-label
          color: #666
          font-size: 13px
          flex: 1
          
        .overview-value-wrapper
          display: flex
          align-items: baseline
          flex-shrink: 0
          
          .overview-value
            font-weight: bold
            color: #333
            font-size: 15px
            margin-right: 2px
            
          .overview-unit
            color: #999
            font-size: 11px

  .ranking-list
    width: 40%
    float: right
    
    h4
      font-size: 14px
      margin: 0 0 10px 0
      color: #333
      
    .ranking-header
      display: grid
      grid-template-columns: 40px 60px 60px 40px 80px
      gap: 5px
      font-size: 12px
      color: #666
      font-weight: bold
      padding: 5px 0
      border-bottom: 1px solid #eee
      
    .ranking-item
      display: grid
      grid-template-columns: 40px 60px 60px 40px 80px
      gap: 5px
      font-size: 12px
      padding: 5px 0
      border-bottom: 1px solid #f5f5f5
      color: #333
      
      .rank-num
        width: 20px
        height: 20px
        border-radius: 50%
        color: white
        text-align: center
        line-height: 20px
        font-size: 10px
        
        &.rank-1
          background-color: #FFD700
          
        &.rank-2
          background-color: #C0C0C0
          
        &.rank-3
          background-color: #CD7F32
          
        &:not(.rank-1):not(.rank-2):not(.rank-3)
          background-color: #999

  .ranking-table-container
    flex: 1
    display: flex
    flex-direction: column
    overflow: hidden
    height: 100%
    
    .ranking-header
      display: grid
      grid-template-columns: 50px 1fr 1fr 50px 80px
      gap: 8px
      font-size: 13px
      color: #666
      font-weight: bold
      padding: 12px 8px
      border-bottom: 2px solid #e0e0e0
      background-color: #f8f9fa
      flex-shrink: 0
      
    .ranking-body
      flex: 1
      overflow-y: auto
      
    .ranking-item
      display: grid
      grid-template-columns: 50px 1fr 1fr 50px 80px
      gap: 8px
      font-size: 12px
      padding: 10px 8px
      border-bottom: 1px solid #f0f0f0
      color: #333
      transition: background-color 0.2s ease
      
      &:hover
        background-color: #f8f9fa
      
      .rank-num
        width: 24px
        height: 24px
        border-radius: 50%
        color: white
        text-align: center
        line-height: 24px
        font-size: 11px
        font-weight: bold
        margin: 0 auto
        
        &.rank-1
          background-color: #FFD700
          
        &.rank-2
          background-color: #C0C0C0
          
        &.rank-3
          background-color: #CD7F32
          
        &:not(.rank-1):not(.rank-2):not(.rank-3)
          background-color: #999

  .fuel-stats
    display: flex
    justify-content: space-around
    margin-bottom: 20px
    padding: 15px 0
    
    .fuel-stat-item
      text-align: center
      
      .stat-value
        display: block
        font-size: 24px
        font-weight: bold
        color: #333
        
      .stat-unit
        display: block
        font-size: 12px
        color: #666
        margin: 5px 0
        
      .stat-label
        display: block
        font-size: 14px
        color: #666
        
      .stat-trend
        color: #F56C6C

  .table-content
    height: 100%
    overflow: auto
    padding: 0 0 0 0 // 或者只留左右padding

  .plan-stats
    margin-top: 15px
    flex-shrink: 0
    
    .plan-stat-item
      display: flex
      justify-content: space-between
      padding: 5px 0
      
      .stat-label
        color: #666
        
      .stat-value
        font-weight: bold
        color: #333

  .plan-chart-wrapper
    width: 100%
    height: 100%
    display: flex
    justify-content: center
    align-items: center
    
    .plan-chart-inner
      width: 100%
      height: 100%

  // 车辆里程分析样式（适配白色主题）
  .mileage-cards
    display: flex
    justify-content: space-around
    align-items: center
    margin-bottom: 20px
    padding: 15px 0
    border-bottom: 1px solid #e0e0e0
    
    .mileage-card
      text-align: center
      flex: 1
      
      .card-value
        display: flex
        align-items: baseline
        justify-content: center
        margin-bottom: 8px
        
        .value-number
          font-size: 24px
          font-weight: 700
          color: #333
          margin-right: 4px
          
        .value-unit
          font-size: 14px
          font-weight: 400
          color: #666
          margin-right: 3px
          
        .trend-icon
          margin-left: 3px
          
          i
            font-size: 16px
            
      .card-name
        font-size: 13px
        font-weight: 400
        color: #666
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis

  .mileage-chart
    .chart-legend
      display: flex
      align-items: center
      justify-content: center
      margin-bottom: 15px
      max-height: 220px
      
      .legend-left, .legend-right
        flex: 1
        display: flex
        align-items: center
        
      .legend-left
        justify-content: flex-end
        
      .legend-right
        justify-content: flex-start
        
      .legend-center
        width: 60px
        text-align: center
        font-size: 14px
        color: #333
        font-weight: 500
        
      .legend-text
        font-size: 14px
        color: #333
        padding: 0 8px
        
      .legend-icon
        width: 12px
        height: 12px
        border-radius: 2px
        
        &.this-year
          background: linear-gradient(90deg, #67C23A 0%, #409EFF 100%)
          
        &.last-year
          background: linear-gradient(90deg, #F56C6C 0%, #E6A23C 100%)
          
    .chart-scroll
      max-height: 160px
      overflow-y: auto
      
      &::-webkit-scrollbar
        width: 4px
        
      &::-webkit-scrollbar-track
        background: #f1f1f1
        border-radius: 2px
        
      &::-webkit-scrollbar-thumb
        background: #ccc
        border-radius: 2px
        
        &:hover
          background: #999
          
    .chart-row
      display: flex
      align-items: center
      justify-content: center
      margin-bottom: 12px
      
      .row-left, .row-right
        flex: 1
        display: flex
        align-items: center
        
      .row-left
        justify-content: flex-end
        
      .row-right
        justify-content: flex-start
        
      .row-center
        width: 60px
        text-align: center
        font-size: 14px
        color: #333
        padding: 0 8px
        
      .row-text
        font-size: 14px
        color: #333
        padding: 0 8px
        min-width: 50px
        text-align: center
        
      .progress-bar
        height: 10px
        border-radius: 5px
        min-width: 5px
        transition: width 0.3s ease
        
        &.this-year
          background: linear-gradient(90deg, #67C23A 0%, #409EFF 100%)
          margin-right: 8px
          
        &.last-year
          background: linear-gradient(90deg, #F56C6C 0%, #E6A23C 100%)
          margin-left: 8px

  // 车辆能耗分析样式（适配白色主题）
  .energy-controls
    display: flex
    align-items: center
    gap: 10px

  .energy-cards
    display: grid
    grid-template-columns: repeat(3, 1fr)
    gap: 15px
    margin-bottom: 20px
    padding: 15px 0
    border-bottom: 1px solid #e0e0e0
    
    .energy-card
      text-align: center
      
      .card-value
        display: flex
        align-items: baseline
        justify-content: center
        margin-bottom: 6px
        
        .value-number
          font-size: 18px
          font-weight: 700
          color: #333
          margin-right: 4px
          
        .value-unit
          font-size: 12px
          font-weight: 400
          color: #666
          margin-right: 3px
          
        .trend-icon
          margin-left: 3px
          
          i
            font-size: 14px
            
      .card-name
        font-size: 12px
        font-weight: 400
        color: #666
        white-space: nowrap
        overflow: hidden
        text-overflow: ellipsis

  .energy-chart-section
    display: flex
    align-items: stretch
    gap: 15px
    flex: 1
    
    .energy-switch
      display: flex
      flex-direction: column
      gap: 8px
      min-width: 60px
      
      .switch-button
        width: 100%
        border: 1px solid #409EFF
        font-size: 12px
        font-weight: normal
        color: #333
        padding: 6px 8px
        cursor: pointer
        border-radius: 4px
        transition: all 0.3s ease
        text-align: center
        
        &:hover
          background-color: rgba(64, 158, 255, 0.1)
          
        &.active
          background: #409EFF
          color: white
          
        &.not-active
          background-color: transparent
          
    .energy-chart-wrapper
      flex: 1
      min-height: 0

  // 维修材料费分析样式（适配白色主题）
  .material-controls
    display: flex
    align-items: center
    gap: 20px
    flex-wrap: wrap

  .material-type-controls
    display: flex
    align-items: center
    gap: 8px
    
    .type-button
      border: 1px solid #67C23A
      color: #67C23A
      cursor: pointer
      padding: 6px 12px
      border-radius: 16px
      background-color: transparent
      transition: all 0.3s ease
      font-size: 13px
      font-weight: 500
      min-width: 80px
      text-align: center
      
      &:hover
        background-color: rgba(103, 194, 58, 0.1)
        
      &.active
        background: #67C23A
        color: white
        box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3)
        
      &.normal
        background-color: transparent

  .material-time-controls
    display: flex
    align-items: center
    gap: 8px
    
    .time-button
      border: 1px solid #409EFF
      color: #409EFF
      cursor: pointer
      padding: 6px 15px
      border-radius: 16px
      background-color: transparent
      transition: all 0.3s ease
      font-size: 13px
      font-weight: 500
      min-width: 50px
      text-align: center
      
      &:hover
        background-color: rgba(64, 158, 255, 0.1)
        
      &.active
        background: #409EFF
        color: white
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3)
        
      &.normal
        background-color: transparent

  .material-chart-wrapper
    width: 100%
    flex: 1
    position: relative
  </style>
