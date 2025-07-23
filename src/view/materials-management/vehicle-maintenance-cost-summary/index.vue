<template>
  <div class="vehicle-maintenance-cost-summary">
    <sub-req
      ref="head"
      @on-export="onExport"
      @on-ok="onSubmit"
    ></sub-req>
    <!-- :omitColumnIndex="[1,2,3,6,7,8,9,10]" -->
    <tr-table
      :selectionShow="true"
      :data="data"
      :isShowSummary="true"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :sumTotal="sumTotal"
      :sumColumnIndex="[4,5,6,7,8,9,10,11,12,13,14,15,16]"
      @on-select-change-row="selectedList"
    >
    <template slot-scope="scope" slot="operation" >
       <!-- v-if="$isPowerShow('details')" -->
        <el-button type="text" size="mini" @click="checkDetail(scope.data)" v-if="$isPowerShow('details')">明细</el-button>
    </template>
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
      :total="pageInfo.pageCount"
    >
    </el-pagination>

    <div>
      <information-dialog
        ref="informationDialog"
        :dialogBool.sync="informationDialogShow"
      ></information-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
export default {
  name: "vehicle-maintenance-cost-summary",
  components: {
    subReq,
    informationDialog
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
      selectedIds:[], //勾选的ID
      loading: false,
      TableHeight: 500,
      customSettingList: [
        {
          id: 1,
          label: "线路",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "自编号",
          prop: "v_num",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "维修次数",
          prop: "count",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "总工时",
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
          label: "总工时费（元）",
          prop: "bz_hours",
          width: "120",
          align: "center",
          signIndex: 5,
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
          id: 7,
          label: "材料费",
          prop: "bz_common",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable: false,
          nestedTablesHeader: [
            {
              label: "普通材料费",
              prop: "material_common",
              width: "120",
              align: "center",
              signIndex: 1,
              sortable:false,
            },
            {
              label: "三包材料费",
              prop: "material_sanbao",
              width: "120",
              align: "center",
              signIndex: 2,
              sortable:false,
            },
            {
              label: "事故材料费",
              prop: "material_repair",
              width: "120",
              align: "center",
              signIndex: 3,
              sortable:false,
            },
          ]
        },
        {
          id: 8,
          label: "施救费",
          prop: "rescue_cost",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "合计",
          prop: "total",
          width: "160",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "毛利",
          prop: "gross_profit",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "里程(KM)",
          prop: "miles",
          width: "160",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "千公里材料费",
          prop: "kilo_material_fee",
          width: "170",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "备用件金额",
          prop: "total",
          width: "150",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
      ],
      frontFixedNum: 3, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      informationDialogShow: false,
      sumTotal:{ //约定某一列汇总合计自定义数据
        4: '',
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
        15: '',
        16: '',
        17: '',
        18: '',
        19: '',
      },
    };
  },
  mounted() {
    // this.loadData();
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 查询
    onSubmit(form) {
      this.form = form
      // console.log(this.form);
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      this.data = [];
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetDataVehicleRepair(params)
        .then(res => {
          // console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
            this.sumTotal = {
              4 : res.context.total_count,
              5 : res.context.bz_hours_common,
              6 : res.context.bz_hours_sanbao,
              7 : res.context.bz_hours_repair,
              8 : res.context.reality_hours_common,
              9 : res.context.reality_hours_sanbao,
              10 : res.context.reality_hours_repair,
              11 : res.context.material_common,
              12 : res.context.material_sanbao,
              13 : res.context.material_repair,
              14 : res.context.rescue_cost,
              15 : res.context.total_material_fee,
              16 : res.context.total_hour_fee,
              17 : res.context.total_total_fee,
              18 : res.context.total_gross_profit,
              19 : res.context.total_miles,
            }
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
    // 导出
    onExport() {
      let params = Object.assign({}, this.form);
      let ids = [ ...this.selectedIds ]
      if(ids.length) {
        params.ids = ids
      }
      this.$client.ExportVehicleRepair(params).then((res) => {
        if(res.head) {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        }else{
          this.$message({ type: "warning", message: "暂无可导出内容" });
        }       
      });
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.id)
        });
      }
    },
    // 查看明细
    checkDetail(row) {
      this.$refs.informationDialog.form.start_date = this.form.start
      this.$refs.informationDialog.form.end_date = this.form.end
      this.$refs.informationDialog.form.vehicle_id = row.id || row.lp_num
      this.$refs.informationDialog.form.vehicle_name = row.lp_num
      this.$refs.informationDialog.form.pick_depatment_id = row.group
      if(!row.id) {
        this.$refs.informationDialog.activeNameList =[{id: 2,lable: "物料明细",value: 'second',},]
        this.$refs.informationDialog.activeName = 'second'
      }
      this.informationDialogShow = true
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th - 30;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.vehicle-maintenance-cost-summary {
  width: 100%;
  height: 100%;
}
</style>
