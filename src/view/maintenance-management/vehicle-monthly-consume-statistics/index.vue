<template>
  <div class="vehicle-monthly-consume-statistics">
    <sub-req ref="head" @on-ok="onSubmit" @on-btn-export="exportFile"></sub-req>
    <tr-table
      ref="table"
      :indexShow="true"
      :selectionShow="false"
      :data="data"
      :isShowSummary="true"
      :sumColumnIndex="sumColumnIndex"
      :sumTotal="sumTotal"
      :omitColumnIndex="[ 1, 2, 3, 4, 5]"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading">
    </tr-table>

    <el-pagination
      style="margin: 5px 0;display:flex; justify-content: flex-end;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount">
    </el-pagination>

    <!-- 表格自定义组件 -->
    <!-- <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="0"
      :backFixedNum="0"
    ></custom-setting> -->
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
export default {
  name: "vehicle-monthly-consume-statistics",
  components: {
    subReq,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      data: [],
      form: {},
      loading: false,
      TableHeight: 500,
      customSettingList: [
        {
          id: 1,
          label: "车辆信息",
          align: "center",
          prop: "department_name",
          signIndex: 0,
          nestedTablesHeader: [
            {
              label: "部门",
              prop: "department_name",
              width: "120",
              align: "center",
              id: 101,
              signIndex: 100,
            },
            {
              label: "自编号",
              prop: "auto_number",
              width: "120",
              align: "center",
              id: 102,
              signIndex: 101,
            },
            {
              label: "车牌号",
              prop: "license_number",
              width: "120",
              align: "center",
              id: 103,
              signIndex: 102,
            },
            {
              label: "车辆型号",
              prop: "vehicle_models",
              width: "120",
              align: "center",
              id: 104,
              signIndex: 103,
            },
            {
              label: "车辆类型",
              prop: "vehicle_type",
              width: "120",
              align: "center",
              id: 105,
              signIndex: 104,
            },
            {
              label: "登记日期",
              prop: "registration_date",
              width: "140",
              align: "center",
              id: 106,
              signIndex: 105,
            },
            {
              label: "车龄",
              prop: "vehicle_age",
              width: "120",
              align: "center",
              id: 107,
              signIndex: 106,
            },
            {
              label: "车辆长度(米)",
              prop: "vehicle_lenth",
              width: "120",
              align: "center",
              id: 108,
              signIndex: 107,
            },
            {
              label: "排放标准",
              prop: "emission_standard",
              width: "120",
              align: "center",
              id: 109,
              signIndex: 108,
            },
            {
              label: "发动机功率(千瓦)",
              prop: "engine_power",
              width: "140",
              align: "center",
              id: 110,
              signIndex: 109,
            },
            {
              label: "燃料类型",
              prop: "fuel_type_name",
              width: "120",
              align: "center",
              id: 111,
              signIndex: 110,
            },
          ]
        },
        {
          id: 2,
          label: "运营信息",
          align: "center",
          prop: "revision_status",
          signIndex: 1,
          nestedTablesHeader: [
            {
              label: "变更情况",
              prop: "revision_status",
              width: "120",
              align: "center",
              id: 201,
              signIndex: 200,
            },
            {
              label: "月运营期限",
              prop: "monthly_operatinglife",
              width: "120",
              align: "center",
              id: 202,
              signIndex: 201,
            },
            {
              label: "实际运营天数(天)",
              prop: "actual_operating_days",
              width: "160",
              align: "center",
              id: 203,
              signIndex: 202,
            },
            {
              label: "运营方式",
              prop: "operation_mode",
              width: "120",
              align: "center",
              id: 204,
              signIndex: 203,
            },
          ]
        },
        {
          id: 3,
          label: "客运班线信息",
          align: "center",
          prop: "line",
          signIndex: 2,
          nestedTablesHeader: [
            {
              label: "线路",
              prop: "line",
              width: "120",
              align: "center",
              id: 301,
              signIndex: 300,
            },
            {
              label: "线路起止",
              prop: "start_end_line",
              width: "120",
              align: "center",
              id: 302,
              signIndex: 301,
            },
            {
              label: "线路运营里程(公里)",
              prop: "line_mileage",
              width: "120",
              align: "center",
              id: 303,
              signIndex: 302,
            },
            {
              label: "趟数",
              prop: "execution_time",
              width: "120",
              align: "center",
              id: 304,
              signIndex: 303,
            },
          ]
        },
        {
          id: 4,
          label: "消耗总量",
          align: "center",
          prop: "diesel_fuel_consumption",
          signIndex: 3,
          nestedTablesHeader: [
            {
              label: "柴油(升)",
              prop: "diesel_fuel_consumption",
              width: "120",
              align: "center",
              id: 401,
              signIndex: 400,
            },
            {
              label: "LNG(公斤)",
              prop: "lng_consumption",
              width: "120",
              align: "center",
              id: 402,
              signIndex: 401,
            },
            {
              label: "氢气(公斤)",
              prop: "hydrogen_consumption",
              width: "120",
              align: "center",
              id: 403,
              signIndex: 402,
            },
            {
              label: "电(千瓦时)",
              prop: "electricity_consumption",
              width: "120",
              align: "center",
              id: 404,
              signIndex: 403,
            },
          ]
        },
        {
          id: 5,
          label: "GPS行驶里程(公里)",
          align: "center",
          prop: "gps_begin_kilometres",
          signIndex: 4,
          nestedTablesHeader: [
            {
              label: "月初公里(表里程)",
              prop: "gps_begin_kilometres",
              width: "160",
              align: "center",
              id: 501,
              signIndex: 500,
            },
            {
              label: "月末公里(表里程)",
              prop: "gps_end_kilometres",
              width: "160",
              align: "center",
              id: 502,
              signIndex: 501,
            },
            {
              label: "行驶里程",
              prop: "gps_travlled_distance",
              width: "120",
              align: "center",
              id: 503,
              signIndex: 502,
            },
          ]
        },
        {
          id: 6,
          label: "GPS里程平均百公里消耗(公里)",
          align: "center",
          prop: "gps_diesel100km_consumption",
          signIndex: 5,
          nestedTablesHeader: [
            {
              label: "柴油(升/百公里)",
              prop: "gps_diesel100km_consumption",
              width: "140",
              align: "center",
              id: 601,
              signIndex: 600,
            },
            {
              label: "LNG(公斤/百公里)",
              prop: "gps_lng100km_consumption",
              width: "160",
              align: "center",
              id: 602,
              signIndex: 601,
            },
            {
              label: "氢气(公斤/百公里)",
              prop: "gps_hydrogen100km_consumption",
              width: "160",
              align: "center",
              id: 603,
              signIndex: 602,
            },
            {
              label: "电(千瓦时/百公里)",
              prop: "gps_electricity100km_consumption",
              width: "160",
              align: "center",
              id: 604,
              signIndex: 603,
            },
          ]
        },
        {
          id: 7,
          label: "有效里程行驶里程(公里)",
          align: "center",
          prop: "effective_begin_kilometres",
          signIndex: 6,
          nestedTablesHeader: [
            {
              label: "月初公里(表里程)",
              prop: "effective_begin_kilometres",
              width: "160",
              align: "center",
              id: 701,
              signIndex: 700,
            },
            {
              label: "月末公里(表里程)",
              prop: "effective_end_kilometres",
              width: "160",
              align: "center",
              id: 702,
              signIndex: 701,
            },
            {
              label: "行驶里程",
              prop: "effective_travlled_distance",
              width: "120",
              align: "center",
              id: 703,
              signIndex: 702,
            },
          ]
        },
        {
          id: 8,
          label: "有效里程平均百公里消耗",
          align: "center",
          prop: "effective_diesel100km_consumption",
          signIndex: 7,
          nestedTablesHeader: [
            {
              label: "柴油(升/百公里)",
              prop: "effective_diesel100km_consumption",
              width: "140",
              align: "center",
              id: 801,
              signIndex: 800,
            },
            {
              label: "LNG(公斤/百公里)",
              prop: "effective_lng100km_consumption",
              width: "160",
              align: "center",
              id: 802,
              signIndex: 801,
            },
            {
              label: "氢气(公斤/百公里)",
              prop: "effective_hydrogen100km_consumption",
              width: "160",
              align: "center",
              id: 803,
              signIndex: 802,
            },
            {
              label: "电(千瓦时/百公里)",
              prop: "effective_electricity100km_consumption",
              width: "160",
              align: "center",
              id: 804,
              signIndex: 803,
            },
          ]
        },
      ],
      canRendererTableHeader: null,
      customSettingShowList: null,
      sumTotal: {},
      sumColumnIndex: [],
      summary: null,
    }
  },
  // created() {
  //   this.menu_code = this.$route.meta.code
  //   this.reqTitleTable()
  // },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // // 打开自定义表格头部弹窗
    // openSettingPageEvent() {
    //   this.customSettingVialogVisible = true;
    // },
    // updateTableHeader(newestTableHeaderList) {
    //   this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {
    //     this.canRendererTableHeader = null;
    // this.customSettingShowList = null;
    //     this.reqTitleTable()
    //   }).catch(err => {
    //     this.$message({
    //       showClose: true,
    //       message: err,
    //       type: "error",
    //     });
    //   })
    // },
    // // 获取表头
    // reqTitleTable() {
    //   this.headerLoading = true;
    //   this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
    //     this.titlesId = res.titlesId;
    //     this.canRendererTableHeader = res.canRendererTableHeader;
    //     this.customSettingList = res.customSettingList;
        // this.customSettingShowList = res.customSettingShowList;
    //     this.buildSumTotal()
    //     this.$forceUpdate();
    //     setTimeout(() =>{
    //       this.headerLoading = false;
    //     },600)
    //   }).catch(err => {
    //     setTimeout(() =>{
    //       this.headerLoading = false;
    //     },600)
    //   })
    // },
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    // 获取数据
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form);
      params.vehicle_ids = params.vehicle_ids.toString()
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      this.$client.GetErpFuelMonthReports(params).then(req => {
        this.loading = false
        if (req.head.result == "200") {
            let list = req.context.list

            this.getNewData(list)
            this.pageInfo.pageCount = req.context.total
            // this.buildSumTotal()
          } else {
            this.$message({
              showClose: true,
              message: req.head.describle,
              type: "error",
            });
          }
      })
    },
    // 数据组装
    getNewData(list) {
      let data = list.erp_fuel_month_report_list
      // 获取整合所有的燃料类型
      let typesData = []
      data.forEach(item => {
        for (const key in item.consumption_dic) {
          let info = item.consumption_dic[key]
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

      this.buildSumTotal(list,typesData)
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
      let fuelTotalList = []
      let AverageList100km = []
      let AverageEffectiveList100km = []
      typesData.forEach((item,index) => {
        // 油耗总量
        let obj1 = {
          id: index + 1,
          label: `${item.name}(${item.unit})`,
          prop: `fuel${item.type}`,
          width: "130",
          align: "center",
          signIndex: index,
        }
        fuelTotalList.push(obj1)
        // GPS里程平均百公里消耗
        let obj2 = {
          id: index + 1,
          label: `${item.name}(${item.unit}/百公里)`,
          prop: `average100km${item.type}`,
          width: "160",
          align: "center",
          signIndex: index,
        }
        AverageList100km.push(obj2)
        // 有效里程平均百公里消耗
        let obj3 = {
          id: index + 1,
          label: `${item.name}(${item.unit}/百公里)`,
          prop: `averageEffective100km${item.type}`,
          width: "160",
          align: "center",
          signIndex: index,
        }
        AverageEffectiveList100km.push(obj3)

      })
      this.customSettingList[3].nestedTablesHeader = fuelTotalList
      this.customSettingList[5].nestedTablesHeader = AverageList100km
      this.customSettingList[7].nestedTablesHeader = AverageEffectiveList100km
    },
    // 组装列表数据
    getList(data,typesData) {
      let list = []
      data.forEach((item,index) => {
        let info = item.monthConsumptionReport
        let obj = Object.assign({},info)
        typesData.forEach(child => {
          obj[`fuel${child.type}`] = item.consumption_dic[child.name] ? item.consumption_dic[child.name].Item2 : 0
          obj[`average100km${child.type}`] = item.gps_consumption_100km_dic[child.name] ? item.gps_consumption_100km_dic[child.name].Item2 : 0
          obj[`averageEffective100km${child.type}`] = item.effective_consumption_100km_dic[child.name] ? item.effective_consumption_100km_dic[child.name].Item2 : 0
          // for (const key in item.consumption_dic) {
          //   if (child.name == key) {
          //     obj[`fuel${child.type}`] = item.consumption_dic[key].Item2
          //     // console.log(obj[`fuel${child.type}`],child.type, item.consumption_dic[key], obj);
          //   }else {
          //     obj[`fuel${child.type}`] = 0
          //   }
          //   // console.log(child.name,key, obj);
          // }

          // for (const key in item.gps_consumption_100km_dic) {
          //   if (child.name == key) {
          //     obj[`average100km${child.type}`] = item.gps_consumption_100km_dic[key].Item2
          //   }else {
          //     obj[`average100km${child.type}`] = 0
          //   }
          // }
          // for (const key in item.effective_consumption_100km_dic) {
          //   if (child.name == key) {
          //     obj[`averageEffective100km${child.type}`] = item.effective_consumption_100km_dic[key].Item2
          //   }else {
          //     obj[`averageEffective100km${child.type}`] = 0
          //   }
          // }
        })
        list.push(obj)
      })
      this.data = list
      console.log('=======',JSON.parse(JSON.stringify(this.data)));
    },

    // 构建合计数据
    buildSumTotal(list,typesData) {
      let summary = {
        execution_time: list.execution_time_total,
        gps_travlled_distance: list.gps_travlled_distance_total,
        effective_travlled_distance: list.effective_travlled_distance_total,
      }

      typesData.forEach(child => {
        for (const key in list.consumption_total_dic) {
          if (child.name == key) {
            summary[`fuel${child.type}`] = list.consumption_total_dic[key]
          }
        }

        for (const key in list.gps_consumption_100km_avg_dic) {
          if (child.name == key) {
            summary[`average100km${child.type}`] = list.gps_consumption_100km_avg_dic[key]
          }
        }

        for (const key in list.effective_consumption_100km_avg_dic) {
          if (child.name == key) {
            summary[`averageEffective100km${child.type}`] = list.effective_consumption_100km_avg_dic[key]
          }
        }
      })

      this.sumTotal = {}
      this.sumColumnIndex = []
      let headerList = []
      this.customSettingList.forEach(item => {
        if (item.nestedTablesHeader) {
          item.nestedTablesHeader.forEach(child => {
            headerList.push(child)
          })
        }
      });
      headerList.forEach((item,index) => {
        for (const key in summary) {
          if (item.prop === key) {
            this.sumColumnIndex.push(index + 1)
            this.sumTotal[index + 1] = summary[key]
          }
        }
      })
    },
    // 导出Excel
    exportFile() {
      let params = Object.assign({},this.form);
      params.vehicle_ids = params.vehicle_ids.toString()
      this.$client.ExportErpFuelMonthReport(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: res.head.describle})
        }
      })
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData()
    },
    // 计算表格高度
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.vehicle-monthly-consume-statistics {
  height: 100%;
  width: 100%;
}
</style>
