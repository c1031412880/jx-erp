<template>
  <div class="maintenance-plan-execution-statistics">
    <sub-req
      ref="head"
      @on-export="onExport"
      @on-ok="onSubmit"
    ></sub-req>
    <tr-table
      :selectionShow="false"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :isShowSummary="true"
      :sumTotal="sumTotal"
      :sumColumnIndex="[1,9,10,11,12]"
    >
      <template  slot-scope="scope" slot="state_name">
        <el-link :type="scope.data.state ==2?'danger':'primary'" :underline="false">{{scope.data.state_name}}</el-link>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="primary" size="mini" @click="openCheckDetail(scope.data)" :disabled="!scope.data.real_date">查看明细</el-button>
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

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
    ></information-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
export default {
  name: "maintenance-plan-execution-statistics",
  components: {
    subReq,
    informationDialog,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 100,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      customSettingList: [
        {
          id: 1,
          label: "自编号",
          prop: "v_num",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "lp_num",
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
          label: "线路",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "燃料类型",
          prop: "fuel_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "保养类型",
          prop: "upkeep_type_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "计划保养日期",
          prop: "plan_date",
          width: "160",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "实际保养日期",
          prop: "real_date",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "保养执行状态",
          prop: "state_name",
          width: "150",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "工时费",
          prop: "hour_fee",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "材料费",
          prop: "material_fee",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "总费用",
          prop: "total_fee",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
        {
          id: 13,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        }
      ],
      frontFixedNum: 0, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      sumTotal:{ //约定某一列汇总合计自定义数据
        1:'',
        9: '',
        10:'',
        11: '',
        12:''
      },
    };
  },
  mounted() {
     this.$nextTick(() => {
      this.setHead()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    onExport() {
      let params = Object.assign({}, this.form);
      this.$client.ExportUKPlanExcute(params).then((res) => {
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
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetDataUKPlanExcute(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
            this.sumTotal = {
              1 : (res.context.vehicle_count + '辆')|| 0,
              9 : res.context.excute_rate || 0,
              10 : res.context.total_hour_fee || 0,
              11 : res.context.total_material_fee || 0,
              12 : res.context.total_fee || 0,
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
    
    // 查看
    openCheckDetail(row) {
      this.$refs.informationDialog.form.start_date = row.real_date
      this.$refs.informationDialog.form.end_date = row.real_date + ' 23:59:59'
      this.$refs.informationDialog.form.vehicle_id = row.vehicle_id
      this.$refs.informationDialog.form.vehicle_name = row.lp_num
      this.informationDialogTitle = "查看明细";
      this.informationDialogShow = true;
    },
    // 计算表格高度 和初始化表头
    setHead() {
      this.canRendererTableHeader = this.customSettingList;
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
.maintenance-plan-execution-statistics {
  width: 100%;
  height: 100%;
}
</style>
