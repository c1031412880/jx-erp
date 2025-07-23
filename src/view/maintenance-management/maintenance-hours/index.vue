<template>
  <div class="maintenance-hours">
    <sub-req
      @on-ok="onSubmit"
      @on-export="exportExcel"
      ref="head"
    ></sub-req>
    <tr-table
      ref="table"
      :data="data"
      :tableHeaderList="customSettingFirstList"
      :isShowSummary="true"
      :sumTotal="sumTotal"
      :sumColumnIndex="sumColumnIndex"
      :TableHeight="TableHeight"
      :loading="loading"
    >
    </tr-table>
  </div>
</template>
<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
export default {
  name: "maintenance-hours",
  components: { subReq,},
  data() {
    return {
      sumColumnIndex:[5,6,7,8,9,10,11,12,13,14], //要定义的列的索引
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      // 要纵向合并的单元格的key数组
      customSettingFirstList: [
        {
          id: 1,
          label: "维修工",
          prop: "repair_name",
          width: "100",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "维修车间",
          prop: "dept_name",
          width: "100",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "维修班组",
          prop: "shop_name",
          width: "100",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "出勤天数",
          prop: "attent_days",
          width: "100",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "班组总工时",
          prop: "bz_hours",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable: false,
          nestedTablesHeader: [
            {
              label: "普通维修",
              prop: "bz_hours_common",
              width: "120",
              align: "center",
              signIndex: 1,
              sortable:false,
            },
            {
              label: "三包维修",
              prop: "bz_hours_sanbao",
              width: "120",
              align: "center",
              signIndex: 2,
              sortable:false,
            },
            {
              label: "事故维修",
              prop: "bz_hours_repair",
              width: "120",
              align: "center",
              signIndex: 3,
              sortable:false,
            },
          ]
        },
        {
          id: 6,
          label: "个人总工时",
          prop: "hours",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false,
          nestedTablesHeader: [
            {
              label: "普通维修",
              prop: "user_hours_common",
              width: "120",
              align: "center",
              signIndex: 1,
              sortable:false,
            },
            {
              label: "三包维修",
              prop: "user_hours_sanbao",
              width: "120",
              align: "center",
              signIndex: 2,
              sortable:false,
            },
            {
              label: "事故维修",
              prop: "user_hours_repair",
              width: "120",
              align: "center",
              signIndex: 3,
              sortable:false,
            },
          ]
        },
        {
          id: 7,
          label: "实际维修费用",
          prop: "fee",
          width: "100",
          align: "center",
          signIndex: 6,
          sortable: false,
          nestedTablesHeader: [
            {
              label: "普通维修",
              prop: "reality_hours_common",
              width: "120",
              align: "center",
              signIndex: 1,
              sortable:false,
            },
            {
              label: "三包维修",
              prop: "reality_hours_sanbao",
              width: "120",
              align: "center",
              signIndex: 2,
              sortable:false,
            },
            {
              label: "事故维修",
              prop: "reality_hours_repair",
              width: "120",
              align: "center",
              signIndex: 3,
              sortable:false,
            },
          ]
        },
        {
          id: 8,
          label: "总费用",
          prop: "total_fee",
          width: "120",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
      ],
      sumTotal: {
        5: '',
        6: '',
        7: '',
        8: '',
        9: '',
        10: '',
        11: '',
        12: '',
        13: '',
        14: '',
      }
    };
  },
  mounted() {
    this.setHead();
  },
  methods: {
    // 导出Excel
    exportExcel() {
      if(!this.data.length) {
        this.$message.error('暂无导出数据')
        return false
      }
      let params = this.form;
      this.$client.exportMaintRepairReport(params).then((res) => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    //获取工时报表记录
    getData() {
      let params = this.form;
      this.loading = true;
      // params = Object.assign({}, this.form);
      this.$client.getRecordMaintRepairReport(params).then((res) => {
        if (res.head.result == "200") {
          this.data = res.context.list;
          //合计字段
          let totalHour = {
            bz_hours_common: 0,
            bz_hours_sanbao:0 ,
            bz_hours_repair: 0, 
            reality_hours_common: 0,
            reality_hours_repair: 0,
            reality_hours_sanbao: 0,
            user_hours_common: 0,
            user_hours_repair: 0,
            user_hours_sanbao: 0,
            total_fee: 0
          } 
          //计算每列的总和
          this.data.forEach(obj =>{
            Object.keys(totalHour).forEach(key =>{
              if(obj[key]){
                totalHour[key] += obj[key]
              }
            })
          })
          this.sumTotal = { //约定某一列汇总合计自定义数据
            5: (totalHour.bz_hours_common).toFixed(2),
            6: (totalHour.bz_hours_sanbao).toFixed(2),
            7: (totalHour.bz_hours_repair).toFixed(2),
            8: (totalHour.user_hours_common).toFixed(2),
            9: (totalHour.user_hours_sanbao).toFixed(2),
            10: (totalHour.user_hours_repair).toFixed(2),
            11: (totalHour.reality_hours_common).toFixed(2),
            12: (totalHour.reality_hours_sanbao).toFixed(2),
            13: (totalHour.reality_hours_repair).toFixed(2),
            14: (totalHour.total_fee).toFixed(2),
          },
          this.loading = false;
        } else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      });
    },
    // 查询
    onSubmit(form) {
      this.form = form;
      this.getData();
    },
    // 计算表格高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th ;
      }, 60);
    },
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.maintenance-hours{
  width: 100%;
  height: 100%;
}
</style>
