<template>
  <div class="vehicle-seat-statistics">
    <sub-req 
      ref="head"
      @on-ok="onSubmit" 
      @on-btn-export="exportFile"
    ></sub-req>
    <tr-table
      ref="table"
      :indexShow="true"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :isShowSummary="true">
      <template slot="vehicle_number" slot-scope="scope">
        <el-button type="text" size="mini" @click="jumpVehicle(scope.data)">{{scope.data.vehicle_number}}</el-button>
      </template>
    </tr-table>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import common from '@/mixin/exportToExcel'
export default {
  name: "vehicle-seat-statistics",
  components: {
    subReq,
  },
  mixins: [common],
  data() {
    return {
      data: [],
      form: {},
      loading: false,
      TableHeight: 500,
      customSettingList: [
        {
          id: 1,
          label: "车辆型号",
          align: "center",
          prop: "vehicle_model",
          width: '150',
          signIndex: 0,
        },
        {
          id: 2,
          label: "车辆类型",
          align: "center",
          prop: "car_type_name",
          width: '120',
          signIndex: 1,
        },
        {
          id: 3,
          label: "登记日期",
          align: "center",
          prop: "record_date",
          width: '120',
          signIndex: 2,
        },
        {
          id: 4,
          label: "车辆数量",
          align: "center",
          prop: "car_count",
          width: '120',
          signIndex: 3,
        },
        {
          id: 5,
          label: "自编号",
          align: "center",
          prop: "vehicle_number",
          width: '120',
          signIndex: 4,
        },
        {
          id: 6,
          label: "座位数(人)",
          align: "center",
          prop: "oil_consume",
          width: '150',
          signIndex: 5,
          nestedTablesHeader: [
            {
              id: 1,
              label: "单车",
              prop: "seat_count_single",
              width: "80",
              align: "center",
              signIndex: 0,
              sortable: false,
            },
            {
              id: 2,
              label: "小计",
              prop: "seat_count_total",
              width: "80",
              align: "center",
              signIndex: 1,
              sortable: false,
            }
          ]
        },
        {
          id: 7,
          label: "站位数(人)",
          align: "center",
          prop: "seat_stand",
          width: '120',
          signIndex: 6,
        },
        {
          id: 8,
          label: "荷载人(人)",
          align: "center",
          prop: "oil_consume",
          width: '120',
          signIndex: 7,
          nestedTablesHeader: [
            {
              id: 1,
              label: "单车",
              prop: "verify_person_single",
              width: "80",
              align: "center",
              signIndex: 0,
              sortable: false,
            },
            {
              id: 2,
              label: "小计",
              prop: "verify_person_total",
              width: "80",
              align: "center",
              signIndex: 1,
              sortable: false,
            }
          ]
        },
        {
          id: 9,
          label: "计划报废年限",
          align: "center",
          prop: "plan_scrap_date",
          width: '120',
          signIndex: 8,
        },
        {
          id: 10,
          label: "残疾人无障碍导板",
          align: "center",
          prop: "handicapped_accessibility_guide_plate",
          width: '150',
          signIndex: 9,
        },
        {
          id: 11,
          label: "有轮椅停放区(残疾人专用位)",
          align: "center",
          prop: "wheelchair_parking_area",
          width: '240',
          signIndex: 10,
        },
      ],
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
      this.form = form
      this.loadData()
    },
    // 获取数据
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form);
      this.$client.GetVehicleRegisteredSeatsReports(params).then(req => {
        this.loading = false
        if (req.head.result == "200") {
            this.data = req.context.list.data_list
            this.data.forEach(item => {
              item.handicapped_accessibility_guide_plate = item.handicapped_accessibility_guide_plate == 1 ? '有' : '无'
              item.wheelchair_parking_area = item.wheelchair_parking_area == 1 ? '有' : '无'
            })
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      })
    },
    // 导出Excel
    exportFile() {
      let table_dom = this.$refs['table'].$refs.table.$el
      this.exportToExcel(table_dom,'在册车辆座位统计表')
    },
    jumpVehicle(row){
      this.$router.push({
        name:'vehinfo-manage',
        params:{
          ids: row.vehicle_ids.split(',')
        }
      })
    },
    // 计算表格高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.vehicle-seat-statistics {
  height: 100%;
  width: 100%;
}
</style>
