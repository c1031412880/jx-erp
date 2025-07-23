<template>
  <div class="each-batch">
    <sub-req 
      ref="head" 
      @on-ok="onSubmit" 
      @on-btn-export="exportFile"
      ></sub-req>
    <div :style="{'min-height':TableHeight + 'px','overflow':'auto'}">
      <table cellpadding="0" style="min-width:8580px" v-loading="loading" :key="key" ref="table">
        <template v-for="(item,index) in allData">
          <thead :key="index + item.name">
            <tr>
              <template v-for="(child) in item.firstLevelHeader">
                <th :key='child.id + (index + "")' :colspan="child.colspan" class="table-box header" :style="{width:child.width + 'px'}">
                  <div>{{child.label}}</div>
                </th>
              </template>
            </tr>
            <tr>
              <template v-for="(child) in item.secondLevelHeader">
                <th :key='child.id + (index + "")' class="table-box header" :style="{width:child.width + 'px'}">
                  <div>{{child.label}}</div>
                </th>
              </template>
            </tr>
          </thead>
          <tbody :key="index">
            <template v-for="(child,i) in item.data">
              <tr :key="i" class="table-tr">
                <td>{{i + 1}}</td>
                <td>{{child.model}}</td>
                <td>{{child.car_count}}</td>
                <td>{{child.record_date}}</td>
                <td>{{child.kilometres1}}</td>
                <td>{{child.fuelConsumption1}}</td>
                <td>{{child.fuelConsumption100km1}}</td>
                <td>{{child.kilometres2}}</td>
                <td>{{child.fuelConsumption2}}</td>
                <td>{{child.fuelConsumption100km2}}</td>
                <td>{{child.kilometres3}}</td>
                <td>{{child.fuelConsumption3}}</td>
                <td>{{child.fuelConsumption100km3}}</td>
                <td>{{child.kilometres4}}</td>
                <td>{{child.fuelConsumption4}}</td>
                <td>{{child.fuelConsumption100km4}}</td>
                <td>{{child.kilometres5}}</td>
                <td>{{child.fuelConsumption5}}</td>
                <td>{{child.fuelConsumption100km5}}</td>
                <td>{{child.kilometres6}}</td>
                <td>{{child.fuelConsumption6}}</td>
                <td>{{child.fuelConsumption100km6}}</td>
                <td>{{child.kilometres7}}</td>
                <td>{{child.fuelConsumption7}}</td>
                <td>{{child.fuelConsumption100km7}}</td>
                <td>{{child.kilometres8}}</td>
                <td>{{child.fuelConsumption8}}</td>
                <td>{{child.fuelConsumption100km8}}</td>
                <td>{{child.kilometres9}}</td>
                <td>{{child.fuelConsumption9}}</td>
                <td>{{child.fuelConsumption100km9}}</td>
                <td>{{child.kilometres10}}</td>
                <td>{{child.fuelConsumption10}}</td>
                <td>{{child.fuelConsumption100km10}}</td>
                <td>{{child.kilometres11}}</td>
                <td>{{child.fuelConsumption11}}</td>
                <td>{{child.fuelConsumption100km11}}</td>
                <td>{{child.kilometres12}}</td>
                <td>{{child.fuelConsumption12}}</td>
                <td>{{child.fuelConsumption100km12}}</td>
                <td>{{child.kilometres_total}}</td>
                <td>{{child.fuel_consumption_val_total}}</td>
                <td>{{child.fuel_consumption_val_avg}}</td>
                <td>{{child.fuel_consumption_price}}</td>
                <td>{{child.fuel_consumption_price_avg}}</td>
                <td>{{child.cost_1km}}</td>
              </tr>
            </template>
          </tbody>
        </template>
        <tbody>
          <template v-for="(item,i) in allTotalData">
            <tr :key="i" class="table-tr total">
              <td>{{''}}</td>
              <td>{{'总合计'}}</td>
              <td>{{item.car_count}}</td>
              <td>{{item.record_date}}</td>
              <td>{{keep_two_decimal(item.kilometres1)}}</td>
              <td>{{''}}</td>
              <td>{{''}}</td>
              <td>{{keep_two_decimal(item.kilometres2)}}</td>
              <td>{{''}}</td>
              <td>{{''}}</td>
              <td>{{keep_two_decimal(item.kilometres3)}}</td>
              <td>{{''}}</td>
              <td>{{''}}</td>
              <td>{{keep_two_decimal(item.kilometres4)}}</td>
              <td>{{''}}</td>
              <td>{{''}}</td>
              <td>{{keep_two_decimal(item.kilometres5)}}</td>
              <td>{{''}}</td>
              <td>{{''}}</td>
              <td>{{keep_two_decimal(item.kilometres6)}}</td>
              <td>{{''}}</td>
              <td>{{''}}</td>
              <td>{{keep_two_decimal(item.kilometres7)}}</td>
              <td>{{''}}</td>
              <td>{{''}}</td>
              <td>{{keep_two_decimal(item.kilometres8)}}</td>
              <td>{{''}}</td>
              <td>{{''}}</td>
              <td>{{keep_two_decimal(item.kilometres9)}}</td>
              <td>{{''}}</td>
              <td>{{''}}</td>
              <td>{{keep_two_decimal(item.kilometres10)}}</td>
              <td>{{''}}</td>
              <td>{{''}}</td>
              <td>{{keep_two_decimal(item.kilometres11)}}</td>
              <td>{{''}}</td>
              <td>{{''}}</td>
              <td>{{keep_two_decimal(item.kilometres12)}}</td>
              <td>{{''}}</td>
              <td>{{''}}</td>
              <td>{{keep_two_decimal(item.kilometres_total)}}</td>
              <td>{{''}}</td>
              <td>{{''}}</td>
              <td>{{''}}</td>
              <td>{{''}}</td>
              <td>{{''}}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./sub-req";
import { deepCopy,uuid } from '@/utils/index'
import common from '@/mixin/exportToExcel'
export default {
  name: "each-batch",
  components: {
    subReq,
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
      // TableHeight: 500,
      allData: [],
      firstLevelHeader: [
        {
          id: 0,
          label: 'LNG',
          colspan: 4,
          width: 500,
        },
        {
          id: 1,
          label: "1月份",
          colspan: 3,
          width: 600,
        },
        {
          id: 2,
          label: "2月份",
          colspan: 3,
          width: 600,
        },
        {
          id: 3,
          label: "3月份",
          colspan: 3,
          width: 600,
        },
        {
          id: 4,
          label: "4月份",
          colspan: 3,
          width: 600,
        },
        {
          id: 5,
          label: "5月份",
          colspan: 3,
          width: 600,
        },
        {
          id: 6,
          label: "6月份",
          colspan: 3,
          width: 600,
        },
        {
          id: 7,
          label: "7月份",
          colspan: 3,
          width: 600,
        },
        {
          id: 8,
          label: "8月份",
          colspan: 3,
          width: 600,
        },
        {
          id: 9,
          label: "9月份",
          colspan: 3,
          width: 600,
        },
        {
          id: 10,
          label: "10月份",
          colspan: 3,
          width: 600,
        },
        {
          id: 11,
          label: "11月份",
          colspan: 3,
          width: 600,
        },
        {
          id: 12,
          label: "12月份",
          colspan: 3,
          width: 600,
        },
        {
          id: 13,
          label: "全年汇总",
          colspan: 3,
          width: 600,
        },
        {
          id: 14,
          label: "全年成本核算",
          colspan: 3,
          width: 320,
        },
      ],
      secondLevelHeader: [],
      key: null,
      // 总合计
      allTotalData: []
    }
  },
  created() {
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.setHead();
    //   window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
    //     this.setHead()
    //   })
    // });
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
      this.$client.GetVehicleModelBatchReports(params).then(req => {
        this.loading = false
        if (req.head.result == "200") {
            let info = req.context.list

            this.getNewData(info)
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
    getNewData(info) {
      let response_data_dic = info.response_data_dic
      let names = []
      for (const key in response_data_dic) {
        let name = key
        let unit = unit
        response_data_dic[key].forEach(item => {
          unit = item.unit
        })
        names.push({
          name:name,
          unit:unit
        })
      }

      this.getCustoms(names)
      this.getList(response_data_dic)
      this.key = new Date().getTime()
    },
    // 组装表头
    getCustoms(names){
      this.allData = []
      names.forEach(item => {
        let header = deepCopy(this.firstLevelHeader)
        let content = []

        let content1 = [
          {
            id: 1,
            label: '序号',
            width: 80
          },
          {
            id: 2,
            label: '车辆型号',
            width: 220
          },
          {
            id: 3,
            label: '数量',
            width: 120
          },
          {
            id: 4,
            label: '登记日期',
            width: 120
          },
        ]
        let content2 = []
        let content3 = [
          {
            id: 99,
            label: '燃料消耗金额(元)',
            width: 220
          },
          {
            id: 100,
            label: '平均单价',
            width: 220
          },
          {
            id: 101,
            label: '每公里成本(元)',
            width: 180
          },
        ]
        header[0].label = item.name
        for (let index = 0; index < 13; index++) {
          let list = [
            {
              id: uuid(),
              label: '行驶里程(km)',
              width: 140
            },
            {
              id: uuid(),
              label: `消耗总量(${item.unit})`,
              width: 140
            },
            {
              id: uuid(),
              label: `平均百公里消耗(${item.unit}/百公里)`,
              width: 260
            }
          ]
          content2 = [...content2,...list]
        }
  
        content3[1].label = `平均单价(元/${item.unit})`

        content = [...content1,...content2,...content3]

        let obj = {
          firstLevelHeader: header,
          secondLevelHeader: content,
          data: [],
          name: item.name
        }

        this.allData.push(obj)
      });
    },
    // 组装列表数据
    getList(response_data_dic){
      for (const key in response_data_dic) {
        let list = response_data_dic[key]
        let data = []
        list.forEach(item => {
          let obj = {
              model: item.vehicle_model,
              car_count: item.car_count,
              record_date: item.record_date,
              kilometres1: '',
              fuelConsumption1: '',
              fuelConsumption100km1: '',
              kilometres2: '',
              fuelConsumption2: '',
              fuelConsumption100km2: '',
              kilometres3: '',
              fuelConsumption3: '',
              fuelConsumption100km3: '',
              kilometres4: '',
              fuelConsumption4: '',
              fuelConsumption100km4: '',
              kilometres5: '',
              fuelConsumption5: '',
              fuelConsumption100km5: '',
              kilometres6: '',
              fuelConsumption6: '',
              fuelConsumption100km6: '',
              kilometres7: '',
              fuelConsumption7: '',
              fuelConsumption100km7: '',
              kilometres8: '',
              fuelConsumption8: '',
              fuelConsumption100km8: '',
              kilometres9: '',
              fuelConsumption9: '',
              fuelConsumption100km9: '',
              kilometres10: '',
              fuelConsumption10: '',
              fuelConsumption100km10: '',
              kilometres11: '',
              fuelConsumption11: '',
              fuelConsumption100km11: '',
              kilometres12: '',
              fuelConsumption12: '',
              fuelConsumption100km12: '',
              kilometres_total:item.kilometres_total,
              fuel_consumption_val_total: item.fuel_consumption_val_total,
              fuel_consumption_val_avg: item.fuel_consumption_val_avg,
              fuel_consumption_price: item.fuel_consumption_price,
              fuel_consumption_price_avg: item.fuel_consumption_price_avg,
              cost_1km: item.cost_1km,
          }
          let month_data_dic = item.month_data_dic
          for (const k in month_data_dic) {
            let k_index = k.slice(0,-2)
            for (const t in obj) {
              if (t.indexOf('kilometres') != -1) {        // 根据字段名后面定义数值才匹配相对于的月份
                let t_index = t.slice(10)
                if (k_index == t_index) {
                  obj[t] = month_data_dic[k].kilometres 
                }
              }
              if (t.indexOf('fuelConsumption') != -1) {
                let t_index = t.slice(15)
                if (k_index == t_index) {
                  obj[t] = month_data_dic[k].fuel_consumption_val 
                }
              }
              if (t.indexOf('fuelConsumption100km') != -1) {
                let t_index = t.slice(20)
                if (k_index == t_index) {
                  obj[t] = month_data_dic[k].fuel_consumption_val_100km 
                }
              }
            }
          }

          data.push(obj)
        })
        // 合计
        let totalObj = this.getTotalObj(data)
        data.push(totalObj)
        this.allData.forEach(child => {
          if (child.name == key) {
            child.data = data
          }
        })
      }
      // 总合计
      let allList = []
      this.allData.forEach(item => {
        item.data.forEach(child => {
          // 剔除合计行
          if (child.model != '合计') {
            allList.push(child)
          }
        })
      })

      this.allTotalData = [this.getTotalObj(allList)]

    },
    // 返回组装的合计对象
    getTotalObj(data) {
      let obj = {
        model: '合计',
        car_count: 0,
        record_date: '',
        kilometres1: 0,
        fuelConsumption1: 0,
        fuelConsumption100km1: 0,
        kilometres2: 0,
        fuelConsumption2: 0,
        fuelConsumption100km2: 0,
        kilometres3: 0,
        fuelConsumption3: 0,
        fuelConsumption100km3: 0,
        kilometres4: 0,
        fuelConsumption4: 0,
        fuelConsumption100km4: 0,
        kilometres5: 0,
        fuelConsumption5: 0,
        fuelConsumption100km5: 0,
        kilometres6: 0,
        fuelConsumption6: 0,
        fuelConsumption100km6: 0,
        kilometres7: 0,
        fuelConsumption7: 0,
        fuelConsumption100km7: 0,
        kilometres8: 0,
        fuelConsumption8: 0,
        fuelConsumption100km8: 0,
        kilometres9: 0,
        fuelConsumption9: 0,
        fuelConsumption100km9: 0,
        kilometres10: 0,
        fuelConsumption10: 0,
        fuelConsumption100km10: 0,
        kilometres11: 0,
        fuelConsumption11: 0,
        fuelConsumption100km11: 0,
        kilometres12: 0,
        fuelConsumption12: 0,
        fuelConsumption100km12: 0,
        kilometres_total: 0,
        fuel_consumption_val_total: 0,
        fuel_consumption_val_avg: 0,
        fuel_consumption_price: 0,
        fuel_consumption_price_avg: 0,
        cost_1km: 0,
      }
      data.forEach(item => {
        for (const key in obj) {
          if (!isNaN(Number(item[key]))) {
            if (key == 'fuel_consumption_price_avg') {
              obj[key] = item[key]
            } else {
              obj[key] += Number(item[key])
            }
          }
        }
      })
      // for (const key in obj) {
      //   // 计算平均消耗
      //   if (key.indexOf('fuelConsumption100km') != -1) {
      //     let k_index = key.slice(20)
      //     if (obj['kilometres' + k_index] == 0) {
      //       obj['fuelConsumption100km' + k_index] = 0
      //     } else {
      //       obj['fuelConsumption100km' + k_index] = (obj['fuelConsumption' + k_index] / obj['kilometres' + k_index] * 100).toFixed(2)
      //     }
      //   }

      //   // 计算平均消耗
      //   if (key == 'fuel_consumption_val_avg') {
      //     obj['fuel_consumption_val_avg'] = obj ['kilometres_total'] ? (obj['fuel_consumption_val_total'] / obj ['kilometres_total'] * 100).toFixed(2) : 0
      //   }
      //   // 每公里成本
      //   if (key == 'cost_1km') {
      //     obj['cost_1km'] = obj ['kilometres_total'] ? (obj['fuel_consumption_price'] / obj ['kilometres_total']).toFixed(2) : 0
      //   }
      // }

      // for (const key in obj) {
      //   obj[key] =  this.keep_two_decimal(obj[key])
      // }

      return obj
    },
    // 保留两位小数 
    keep_two_decimal(val) {
      return val ? Number(val).toFixed(2) : 0
    },
    // 导出Excel
    exportFile() {
      let table_dom = this.$refs['table']
      let style = `
        thead th {
          background: rgb(224, 243, 255);
          color: rgb(51, 51, 51);
          font-size: 16px;
          padding: 2px 0px;
          font-weight: 700;
        }`
      this.exportToExcel(table_dom,'各批次车辆型号燃料、里程消耗统计表',style)
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
.each-batch {
  height: 100%;
  width: 100%;

  .table-box {
    border:1px solid rgb(193, 205, 205);
    font-size:18px
  }
  .header {
    background: rgb(224, 243, 255);
    color: rgb(51, 51, 51);
    font-size: 16px;
    padding: 2px 0px;
    font-weight: 700;
    div {
      height: 34px;
      line-height: 34px;
    }
  }
  .table-tr {
    td {
      border:1px solid rgb(193, 205, 205);
      font-size:18px;
      text-align:center;
      padding: 4px;
      background-color: #fafafa;
    }
  }
  .total {
    td {
      background-color:#f2f2f2;
    }
  }
}
</style>
