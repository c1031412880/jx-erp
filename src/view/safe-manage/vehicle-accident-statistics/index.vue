<template>
  <div class="vehicle-accident-statistics">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
       @on-export="onExport"
    ></sub-req>
          <!-- :mergeTablesCellInfo="{ //合并单元格配置
        'spanMethodType': ['column'], //合并类型 row、column
        'needMergedColumnsIndex': 1, //合并列的索引
        'rowMergeNum': 'rowMergeNum' //配置可合并数量标记位名称
      }" -->
    <tr-table
      :selectionShow="false"
      :data="data"
      :stripe="false"
      :spanMethodType="['column']"
      :rowspanObj="rowspanObj"
      :mergekeys="mergekeys"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :isShowSummary="true"
      :omitColumnIndex='[1,2,3,5,6,7,8,9]'
    >
    </tr-table>
    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
export default {
  name: "vehicle-accident-statistics",
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
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      customSettingVialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "车辆组织",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "车牌号",
          prop: "lincense_plate_number",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "线路",
          prop: "line",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "驾驶员",
          prop: "driver_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "事故日期",
          prop: "d_accident_date",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "事故地点",
          prop: "c_accident_address",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "事故责任",
          prop: "accident_duty",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "事故原因",
          prop: "accident_reason",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "事故总额",
          prop: "accident_total_fee",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "保险赔付",
          prop: "n_insurance_pay_fee",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "他人赔付",
          prop: "n_personal_fee",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "事故净损失",
          prop: "n_loss_fee",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: true,
        }
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      // 要纵向合并的单元格的key数组
      mergekeys: ['department_name'],
      rowspanObj:{}
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 导出
    onExport() {
      let params = Object.assign({}, this.form);
      this.$client.exportAccidentReport(params).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    onSubmit(form) {
      this.form = form
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      this.$client.AccidentStatisticsAccidentReport(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context;
            this.buildData();

          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 构建数据排序
    buildData() {
      let dataMap = {};
      let data = []
      this.data.forEach((item, index) => {
        if (dataMap.hasOwnProperty(item.department_name)) {
          dataMap[item.department_name].push(item)
        } else {
          dataMap[item.department_name] = [item]
        }
      });
      let rowIndexArray = [0]
      Object.keys(dataMap).forEach(key => {
        data = [...data, ...dataMap[key]]
        rowIndexArray.push(dataMap[key].length)
      })
      // console.log(rowIndexArray)
      // 插入标记位子和合并行数
      // let k = 0
      // rowIndexArray.forEach((v, i, rowIndex) => {
      //   if (rowIndex[i + 1]) {
      //     data[k].rowMergeNum = rowIndex[i + 1]
      //     k += rowIndex[i + 1]
      //   }
      // })
      // console.log(data)s
      this.data = data
      this.rowspanObj = this.$handleTableSpan(this.mergekeys, this.data)
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    updateTableHeader(newestTableHeaderList) {
      this.canRendererTableHeader = null;
      this.customSettingShowList = null;
      this.customSettingShowList = newestTableHeaderList;
      this.canRendererTableHeader = newestTableHeaderList.filter(item => item.isSelected).map((sing,index) => {
        let obj = {
          id: index +1,
          label: sing.label,
          prop: sing.prop,
          width: sing.width,
          align: sing.align,
          signIndex: index,
          sortable: sing.sortable,
        }
        return obj
      });
      this.$forceUpdate();
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.vehicle-accident-statistics {
  width: 100%;
  height: 100%;
}
</style>
