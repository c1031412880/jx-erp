<template>
  <div class="vehicle-ownership-statistics">
    <sub-req ref="head" @on-ok="onSubmit" @on-btn-export="exportFile"></sub-req>
    <tr-table
      ref="table"
      :indexShow="false"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading">
    </tr-table>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import {deepCopy} from '@/utils/index'
import common from '@/mixin/exportToExcel'
export default {
  name: "vehicle-ownership-statistics",
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
      customSettingList: [],
      customSettingheader: [
        {
          id: 1,
          label: "月份",
          align: "center",
          prop: "month",
          width: '80',
          signIndex: 0,
        },
        {
          id: 2,
          label: "车辆数量",
          align: "center",
          prop: "car_count_total",
          width: '120',
          signIndex: 1,
        },
        {
          id: 3,
          label: "增加车辆",
          align: "center",
          prop: "add_count",
          width: '120',
          signIndex: 2,
        },
        {
          id: 4,
          label: "报废车辆",
          align: "center",
          prop: "scrapping_count",
          width: '120',
          signIndex: 3,
        },
        {
          id: 5,
          label: "合计",
          align: "center",
          prop: "car_total",
          width: '80',
          signIndex: 4,
        },
      ],
      customSettingfloor: [
        {
          id: 11,
          label: "标台数",
          align: "center",
          prop: "standard_count",
          width: '120',
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
      this.$client.GetVehicleInventoryReports(params).then(req => {
        this.loading = false
        if (req.head.result == "200") {
            let data = req.context.list.response_data_dic
            this.getNewData(data)
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      })
    },
    // 数据组装
    getNewData(data) {
      let names = []
      for (const key in data) {
        let info = data[key]
        for (const k in info.data_dic) {
          names.push(k)
        }
      }
      // 去重
      names = [...new Set(names)]
      let namesObj = {}
      // 键值对 确保唯一值  为后续字段名命名做准备
      names.forEach((item,index) => {
        namesObj[item] = index + 1 
      })

      this.getCustoms(namesObj)
      this.getList(data,namesObj)
    },
    // 组装表头
    getCustoms(namesObj) {
      let customSetting = []
      let index = 5
      for (const key in namesObj) {
        ++index
        let obj = {
          id: index,
          label: key,
          align: "center",
          prop: `model${namesObj[key]}`,
          width: '120',
          signIndex: index - 1,
        }
        customSetting.push(obj)
      }
      this.customSettingfloor[0].id = index + 1
      this.customSettingfloor[0].signIndex = index
      this.customSettingList = [...this.customSettingheader,...customSetting,...this.customSettingfloor]
      console.log('======',JSON.parse(JSON.stringify(this.customSettingList)));
    },
    // 组装列表数据
    getList(data,namesObj) {
      let objStart = {
        month: '',
        car_count_total: 0,
        add_count: 0,
        scrapping_count: 0,
        car_total: 0,
      }
      let objCenter = {}
      let objEnd = {
        standard_count: 0
      }
      for (const key in namesObj) {
        objCenter[`model${namesObj[key]}`] = 0
      }


      // 组装prop 对象
      let list = []
      for (let index = 0; index < 12; index++) {
        let obj = {}
        obj = {...objStart,...objCenter,...objEnd}
        obj.month = index + 1
        list.push(obj)
      }

      // 数据赋值
      for (const key in data) {
        let data_dic = data[key].data_dic
        let vehicle_inventory_report = data[key].vehicle_inventory_report
        list.forEach(item => {
          if (key == item.month) {
            item.car_count_total = vehicle_inventory_report.car_count_total
            item.add_count = vehicle_inventory_report.add_count
            item.scrapping_count = vehicle_inventory_report.scrapping_count
            item.car_total = vehicle_inventory_report.car_total
            item.standard_count = vehicle_inventory_report.standard_count
            
            for (const k in namesObj) {
              item[`model${namesObj[k]}`] = data_dic[k]
            }
          }
        })
      }

      let  obj = {...objStart,...objCenter,...objEnd}
      let totalData = this.getAmount(list,obj)
      let avgData = this.getAverage(totalData,obj)
      this.data = [...list,...totalData,...avgData]
      console.log('======',JSON.parse(JSON.stringify(list)));
    },
    // 计算合计
    getAmount(data,oldObj) {
      let obj = deepCopy(oldObj)
      data.forEach(item => {
        for (const key in item) {
          obj[key] += Number(item[key])
        }
      })
      obj.month = '合计'
      console.log('obj',JSON.parse(JSON.stringify(obj)));
      return [obj]
    }, 
    // 获取平均值
    getAverage(data,oldObj) {
      let obj = deepCopy(oldObj)
      for (const key in obj) {
        obj[key] = (data[0][key] / 12).toFixed(2)
      }
      obj.month = '平均车辆'
      return [obj]
    }, 
    // 导出Excel
    exportFile() {
      let table_dom = this.$refs['table'].$refs.table.$el
      this.exportToExcel(table_dom,'车辆保有量统计 ')
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
.vehicle-ownership-statistics {
  height: 100%;
  width: 100%;
}
</style>
