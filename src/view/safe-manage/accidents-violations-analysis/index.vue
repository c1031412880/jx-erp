<template>
  <div class="accidents-violations-analysis">
    <sub-req 
      @on-ok="onSubmit"
      @on-setting="onSetting"
      @on-setMile="onSetMile"
      @on-export="exportFile"
    >
    </sub-req>
    <el-row :gutter="20" ref="echart">
      <el-col :span="6">
        <div class="card-box-item">
          <div style="text-align: center;margin-top: 5px;color: #008acd;font-size: 18px;">公司整体行车事故率变化分析</div>
          <div v-for="(item,index) in data">
            <div style="display: flex;justify-content: space-between;margin: 10px 0;">
              <div>{{ item.name }}</div>
              <div>与去年同期相比: 
                <span :style="{color: item.proportion > 0 ? 'red' : '#70B603'}">{{ item.proportion }}%</span>
              </div>
            </div>
            <div style="margin-bottom: 5px;">
              <div>
                <span style="font-size: 48px;font-weight: bold;">{{ item.value }}</span>
                次/百万公里
              </div>
            </div>
            <div style="display: flex;height: 10px;width: 80%;padding-bottom: 5px;">
              <div style="flex: 1; background-color: #fb6260;border-radius: 5px 0 0 5px;"></div>
              <div style="flex: 1; background-color: #fec03d;"></div>
              <div style="flex: 1; background-color: #58a3f7;"></div>
              <div style="flex: 1; background-color: #4bced0;border-radius: 0 5px 5px 0;"></div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="card-box-item">
          <radar-chart title="各分公司行车事故率变化分析" ref="radar1"></radar-chart>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="card-box-item">
          <radar-chart title="各分公司违章率变化分析" ref="radar2"></radar-chart>
        </div>
      </el-col>
    </el-row>
    <div>
      <div>
        <el-radio-group v-model="type" size="small" @change="onRadio">
          <el-radio-button :label="1">行车事故率</el-radio-button>
          <el-radio-button :label="2">事故类型</el-radio-button>
          <el-radio-button :label="3">违章率</el-radio-button>
        </el-radio-group>
      </div>
      <traffic-accident-rate ref="traffic" v-if="type == 1"></traffic-accident-rate>
      <accident-type ref="accident" v-if="type == 2"></accident-type>
      <violation-rate ref="violation" v-if="type == 3"></violation-rate>
    </div>

    <setting-dialog
      ref="settingDialog"
      :dialogBool.sync="isShowSettingDialog"
      @save-add-edit="saveAddEdit"
    >
    </setting-dialog>

    <setting-mile-type
      ref="settingMileType"
      :month="form.start_month"
      :dialogBool.sync="settingMileShow"
    ></setting-mile-type>
  </div>
</template> 

<script type="text/ecmascript-6">
import subReq from './component/sub-req'
import radarChart from './component/radar-chart'
import trafficAccidentRate from './component/traffic-accident-rate'
import accidentType from './component/accident-type'
import violationRate from './component/violation-rate'
import settingDialog from './component/setting-dialog'
import settingMileType from "./component/setting-mile-type";
export default {
  name: "accidents-violations-analysis",
  components: {
    subReq,
    radarChart,
    trafficAccidentRate,
    accidentType,
    violationRate,
    settingMileType,
    settingDialog
  },
  data() {
    return {
      type: 1,
      form: {}, 
      data: [
        {
          name: '行车事故率',
          proportion: -10,
          value: '3.54',
        },
        {
          name: '违章率',
          proportion: 15,
          value: '2.88',
        },
      ],
      settingMileShow: false,
      isShowSettingDialog: false,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    onSubmit(form) {
      this.form = JSON.parse(JSON.stringify(form))
      this.setTime()
      this.loadData()
      this.onRadio()
    },
    setTime() {
      let year = new Date(this.form.end_month).getFullYear()
      let month = new Date(this.form.end_month).getMonth()
      let days = new Date(year,month+1,0).getDate()

      this.form.start_month = this.form.start_month + '-01' + " 00:00:00"
      this.form.end_month = this.form.end_month + '-' + days + " 23:59:59"
    },
    loadData() {
      this.GetAccidentTitle()
    },
    onRadio() {
      switch (this.type) {
        case 1:
          this.$nextTick(() => {
            this.$refs.traffic.loadData(this.form)
          })
          break;
        case 2:
          this.$nextTick(() => {
            this.$refs.accident.loadData(this.form)
          })
          break;
        case 3:
          this.$nextTick(() => {
            this.$refs.violation.loadData(this.form)
          })
          break;
        default:
          break;
      }
    },
      // 获取头部数据 
    GetAccidentTitle() {
      this.$client.GetAccidentTitle({context:this.form}).then(res => {
        if (res.head.result === '200') {
          let info = res.context
          this.data[0].proportion = info.accident_last_synchronism || 0
          this.data[0].value = info.accident_rate || 0

          this.data[1].proportion = info.violation_last_synchronism || 0
          this.data[1].value = info.violation_rate || 0

          let accident_company_rates = info.accident_company_rates
          if (accident_company_rates.length > 0) {
            let names = []
            let data1 = []
            let data2 = []
            accident_company_rates.forEach(item => {
              names.push({
                text:item.dept_name
              })
              data1.push(item.accident_last_synchronism || 0)
              data2.push(item.accident_rate || 0)
            });

            this.$refs.radar1.setOptions({
              names: names,
              data1: data1,
              data2: data2,
              titles: this.getNames('行车事故率')
            })
          }
          
          let violation_company_rates = info.violation_company_rates
          if (violation_company_rates.length > 0) {
            let names = []
            let data1 = []
            let data2 = []
            violation_company_rates.forEach(item => {
              names.push({
                text:item.dept_name
              })
              data1.push(item.violation_last_synchronism || 0)
              data2.push(item.violation_rate || 0)
            });

            this.$refs.radar2.setOptions({
              names: names,
              data1: data1,
              data2: data2,
              titles: this.getNames('违章率')
            })
          }
        }
      })
    },
    // 组装图标 name  
    getNames(title) {
      let year = new Date(this.form.start_month).getFullYear()
      let month1 = new Date(this.form.start_month).getMonth()
      let month2 = new Date(this.form.end_month).getMonth()

      let time1 = `${year}-${month1 + 1} 至 ${year}-${month2 + 1}${title}`
      let time2 = `${year - 1}-${month1 + 1} 至 ${year - 1}-${month2 + 1}${title}`

      return [time2,time1]
    },
    // 查询风险标准设置 
    onSetting() {
      this.$client.GetSettingAccidentsReport({}).then(res => {
        if (res.head.result === '200') {
          this.isShowSettingDialog = true
          this.$nextTick(()=> {
            this.$refs.settingDialog.initData(res.context)
          })
        }
      })
    },
    // 保存设置 
    saveAddEdit(data) {
      this.$client.AddOrUpdateSetting({context:data}).then(res => {
        if (res.head.result === '200') {
          this.isShowSettingDialog = false
          this.$message({
            showClose: true,
            message: '保存成功',
            type: "success"
          });
        }
      })
    },
    // 公里数设置
    onSetMile() {
      this.settingMileShow = true
    },
    exportFile() {
      switch (this.type) {
        case 1:
          this.$nextTick(() => {
            this.$refs.traffic.exportFile(this.form)
          })
          break;
        case 2:
          this.$nextTick(() => {
            this.$refs.accident.exportFile(this.form)
          })
          break;
        case 3:
          this.$nextTick(() => {
            this.$refs.violation.exportFile(this.form)
          })
          break;
        default:
          break;
      }
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.echart.$el.offsetHeight;
        this.TableHeight = maxh - th - 100;
      }, 60);
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$NumWidth: 100vw / 1920px;
.accidents-violations-analysis{
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  padding: 0 5px;
  .card-box-item{
    height: 400px * $NumWidth;
  }
}
</style>
