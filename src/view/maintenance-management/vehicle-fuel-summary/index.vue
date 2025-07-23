<template>
  <div class="vehicle-fuel-summary">
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
    </tr-table>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import common from '@/mixin/exportToExcel'
export default {
  name: "vehicle-fuel-summary",
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
          width: '120',
          signIndex: 0,
        },
        {
          id: 2,
          label: "登记日期",
          align: "center",
          prop: "record_date",
          width: '120',
          signIndex: 1,
        },
        {
          id: 3,
          label: "车辆数量",
          align: "center",
          prop: "car_count",
          width: '120',
          signIndex: 2,
        },
        {
          id: 4,
          label: "燃料类型",
          align: "center",
          prop: "fuel_type_name",
          width: '120',
          signIndex: 3,
        },
        {
          id: 5,
          label: "行驶里程",
          align: "center",
          prop: "kilometres",
          width: '120',
          signIndex: 4,
        },
        {
          id: 6,
          label: "能源消耗",
          align: "center",
          prop: "oil_consume",
          width: '150',
          signIndex: 5,
          nestedTablesHeader: []
        },
        {
          id: 7,
          label: "百公里能源消耗",
          align: "center",
          prop: "oil_consume",
          width: '150',
          signIndex: 6,
          nestedTablesHeader: []
        },
        {
          id: 8,
          label: "停驶车辆",
          align: "center",
          prop: "offstream_count",
          width: '120',
          signIndex: 7,
        },
        {
          id: 9,
          label: "停驶车辆自编号",
          align: "center",
          prop: "offstream_car_number",
          width: '120',
          signIndex: 8,
        }
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
      this.$client.GetVehicleModelFuelConsumptionReports(params).then(req => {
        this.loading = false
        if (req.head.result == "200") {
            let data = req.context.list.response_data_list
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
      // 获取整合所有的燃料类型
      let typesData = []
      data.forEach(item => {
        for (const key in item.data_dic) {
          let info = item.data_dic[key]
          let obj = {
            name: key,
            unit: info.Item1,
          }
          typesData.push(obj)
        }
      }); 
      typesData = this.unique(typesData)
      typesData.forEach((item,index) => {
        item.type = index
      })

      this.getCustoms(typesData)
      this.getList(data,typesData)
      this.$refs.table.configTableHeaderList()
    },
    //去重
    unique(arr) {
      let map = new Map();
      for (let item of arr) {
        map.set(item.name, item);
      }
      return [...map.values()];
    },
    // 组装表头
    getCustoms(typesData) {
      let energyList = []
      let energyList100km = []
      typesData.forEach((item,index) => {
        // 能源消耗
        let obj1 = {
          id: index + 1,
          label: `${item.name}(${item.unit})`,
          prop: `energy${item.type}`,
          width: "130",
          align: "center",
          signIndex: index,
        }
        energyList.push(obj1)
        // 百公里消耗
        let obj2 = {
          id: index + 1,
          label: `${item.name}(${item.unit}/百公里)`,
          prop: `100kmenergy${item.type}`,
          width: "130",
          align: "center",
          signIndex: index,
        }
        energyList100km.push(obj2)
      })
      this.customSettingList[5].nestedTablesHeader = energyList
      this.customSettingList[6].nestedTablesHeader = energyList100km

      console.log('=======',JSON.parse(JSON.stringify(this.customSettingList)));
    },
    // 组装列表数据
    getList(data,typesData) {
      let list = []
      data.forEach(item => {
        let info = item.vehicleModelFuelConsumptionReport
        let obj = {
          vehicle_model: info.vehicle_model,
          record_date: info.record_date,
          car_count: info.car_count,
          fuel_type_name: info.fuel_type_name,
          kilometres: info.kilometres,
          offstream_count: info.offstream_count,
          offstream_car_number: info.offstream_car_number,
        }
        typesData.forEach(child => {
          for (const key in item.data_dic) {
            if (child.name == key) {
              obj[`energy${child.type}`] = item.data_dic[key].Item2
            }else {
              obj[`energy${child.type}`] = 0
            }
          }

          for (const key in item.fuel_100km_consumption_dic) {
            if (child.name == key) {
              obj[`100kmenergy${child.type}`] = item.fuel_100km_consumption_dic[key].Item2
            }else {
              obj[`100kmenergy${child.type}`] = 0
            }
          }

          // if (item.fuel_type == child.type) {
          //   obj[`energy${child.type}`] = item.fuel_consumption_val
          //   obj[`100kmenergy${child.type}`] = item.fuel_100km_consumption
          // }
        })
        list.push(obj)
      })
      this.data = list
    },
    // 导出Excel
    exportFile() {
      let table_dom = this.$refs['table'].$refs.table.$el
      this.exportToExcel(table_dom,'各车型燃料消耗汇总')
      
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
.vehicle-fuel-summary {
  height: 100%;
  width: 100%;
}
</style>
