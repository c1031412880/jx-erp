<template>
  <div class="monthly-consume-statistics">
    <sub-req ref="head" @on-ok="onSubmit" @on-btn-export="exportFile"></sub-req>
    <tr-table
      ref="table"
      :indexShow="true"
      :selectionShow="false"
      :data="data"
      :frontFixedNum="1"
      :backFixedNum="1"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :spanMethodType="['column']"
      :rowspanObj="rowspanObj"
      :mergekeys="mergekeys"
      :loading="loading">
      <template slot-scope="scope" slot="month_01">
        <el-button type="text" @click="clickRowHandle(scope.data, 'month_01')">{{scope.data.month_01}}</el-button>
      </template>
      <template slot-scope="scope" slot="month_02">
        <el-button type="text" @click="clickRowHandle(scope.data, 'month_02')">{{scope.data.month_02}}</el-button>
      </template>
      <template slot-scope="scope" slot="month_03">
        <el-button type="text" @click="clickRowHandle(scope.data, 'month_03')">{{scope.data.month_03}}</el-button>
      </template>
      <template slot-scope="scope" slot="month_04">
        <el-button type="text" @click="clickRowHandle(scope.data, 'month_04')">{{scope.data.month_04}}</el-button>
      </template>
      <template slot-scope="scope" slot="month_05">
        <el-button type="text" @click="clickRowHandle(scope.data, 'month_05')">{{scope.data.month_05}}</el-button>
      </template>
      <template slot-scope="scope" slot="month_06">
        <el-button type="text" @click="clickRowHandle(scope.data, 'month_06')">{{scope.data.month_06}}</el-button>
      </template>
      <template slot-scope="scope" slot="month_07">
        <el-button type="text" @click="clickRowHandle(scope.data, 'month_07')">{{scope.data.month_07}}</el-button>
      </template>
      <template slot-scope="scope" slot="month_08">
        <el-button type="text" @click="clickRowHandle(scope.data, 'month_08')">{{scope.data.month_08}}</el-button>
      </template>
      <template slot-scope="scope" slot="month_09">
        <el-button type="text" @click="clickRowHandle(scope.data, 'month_09')">{{scope.data.month_09}}</el-button>
      </template>
      <template slot-scope="scope" slot="month_10">
        <el-button type="text" @click="clickRowHandle(scope.data, 'month_10')">{{scope.data.month_10}}</el-button>
      </template>
      <template slot-scope="scope" slot="month_11">
        <el-button type="text" @click="clickRowHandle(scope.data, 'month_11')">{{scope.data.month_11}}</el-button>
      </template>
      <template slot-scope="scope" slot="month_12">
        <el-button type="text" @click="clickRowHandle(scope.data, 'month_12')">{{scope.data.month_12}}</el-button>
      </template>
    </tr-table>

    <veh-mile-dialog
      ref="vehMileDialog"
      :pageNum="type"
      :dialogBool.sync="vehMileDialogShow">
    </veh-mile-dialog>
    <energy-loss-dialog
      ref="energyLossDialog"
      :dialogBool.sync="energyLossDialogShow">
    </energy-loss-dialog>
    <maintenance-fee-dialog
      ref="maintenanceFeeDialog"
      :dialogBool.sync="maintenanceFeeDialogShow">
    </maintenance-fee-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./sub-req";
import { formatDate } from "@/utils/index";
import vehMileDialog from './veh-mile-dialog'
import energyLossDialog from './energy-loss-dialog'
import maintenanceFeeDialog from './maintenance-fee-dialog'
import common from '@/mixin/exportToExcel'
export default {
  components: {
    subReq,
    vehMileDialog,
    energyLossDialog,
    maintenanceFeeDialog
  },
  props: {
    type: {
      type: Number,
      default: 1
    },
    TableHeight: {
      type: Number,
      default: 500
    }
  },
  mixins: [common],
  data() {
    return {
      data: [],
      form: {},
      loading: false,
      isShowSummary: true,
      customSettingList: [
        {
          id: 1,
          label: "统计类型",
          align: "center",
          prop: "name",
          width: '120',
          signIndex: 0,
        },
        {
          id: 2,
          label: "燃料类型",
          align: "center",
          prop: "type",
          width: '160',
          signIndex: 1,
        },
        {
          id: 3,
          label: "1月份",
          align: "center",
          prop: "month_01",
          width: '100',
          signIndex: 2,
        },
        {
          id: 4,
          label: "2月份",
          align: "center",
          prop: "month_02",
          width: '100',
          signIndex: 3,
        },{
          id: 5,
          label: "3月份",
          align: "center",
          prop: "month_03",
          width: '100',
          signIndex: 4,
        },
        {
          id: 6,
          label: "4月份",
          align: "center",
          prop: "month_04",
          width: '100',
          signIndex: 5,
        },
        {
          id: 7,
          label: "5月份",
          align: "center",
          prop: "month_05",
          width: '100',
          signIndex: 6,
        },
        {
          id: 8,
          label: "6月份",
          align: "center",
          prop: "month_06",
          width: '100',
          signIndex: 7,
        },
        {
          id: 9,
          label: "7月份",
          align: "center",
          prop: "month_07",
          width: '100',
          signIndex: 8,
        },
        {
          id: 10,
          label: "8月份",
          align: "center",
          prop: "month_08",
          width: '100',
          signIndex: 9,
        },
        {
          id: 11,
          label: "9月份",
          align: "center",
          prop: "month_09",
          width: '100',
          signIndex: 10,
        },
        {
          id: 12,
          label: "10月份",
          align: "center",
          prop: "month_10",
          width: '100',
          signIndex: 11,
        },
        {
          id: 13,
          label: "11月份",
          align: "center",
          prop: "month_11",
          width: '100',
          signIndex: 12,
        },
        {
          id: 14,
          label: "12月份",
          align: "center",
          prop: "month_12",
          width: '100',
          signIndex: 13,
        },
        {
          id: 15,
          label: "全年合计",
          align: "center",
          prop: "total",
          width: '100',
          signIndex: 14,
        },
      ],
      rowspanObj: {},
      mergekeys: ['name'],
      vehMileDialogShow: false,
      energyLossDialogShow: false,
      maintenanceFeeDialogShow: false,
    }
  },
  mounted() {
    
  },
  methods: {
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    // 获取数据
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form);
      params.type = this.type
      this.$client.GetAnnualFuelConsumption(params).then(req => {
        this.loading = false
        if (req.head.result == "200") {
            this.data = req.context.list.annualFuelConsumptionDtos
            this.rowspanObj = this.$handleTableSpan(this.mergekeys, this.data,'name')
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      })
    },
    // 点击查看明细
    clickRowHandle(row, val) {
      console.log(row, val);
      let obj = {}
      obj.type = row.fuel_type
      let list = val.split('_')
      obj.begin_time	= this.form.year + '-' + list[1] + '-01'
      obj.end_time	= formatDate(new Date(this.form.year, list[1], 0),'yyyy-MM-dd')
      if(row.name.includes('车辆里程')) {
        this.vehMileDialogShow = true
        this.$refs.vehMileDialog.setData(obj)
      }else if(row.name.includes('能源消耗')) {
        this.energyLossDialogShow = true
        this.$refs.energyLossDialog.setData(obj)
      }else if(row.name.includes('维保费用')) {
        this.$message.warning('该功能暂未开发，敬请期待')
        // this.maintenanceFeeDialogShow = true
        // this.$refs.maintenanceFeeDialog.setData(obj)
      }
    },
    // 导出Excel
    exportFile() {
      let table_dom = this.$refs['table'].$refs.table.$el
      this.exportToExcel(table_dom,'年度燃料消耗、维保费统计')
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.monthly-consume-statistics {
  height: 100%;
  width: 100%;
}
</style>
