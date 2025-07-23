<template>
  <div ref="importWages" class="import-wages">
    <sub-req ref="wagesHead" @on-ok="onSubmit" @on-btn-import="openImportFilePop" @on-btn-issue="openIssuePop"></sub-req>
    <p style="margin-bottom: 17px; color: #02A7F0; "><span v-if="!!time">{{time.replace('-','年')}}月</span>工资条已上传，已上传 {{ count || 0 }} 条工资条，总实发金额 {{ money.toFixed(2) || 0 }} 元</p>
    <tr-table
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :backFixedNum="1"
      :loading="loading">
      <template slot-scope="scope" slot="operation">
          <el-popconfirm
            @confirm="deleteRowInfo(scope.data)"
            v-if="$isPowerShow('delete')"
            title="确定删除此条记录吗？">
            <el-button slot="reference" type="text" size="mini" style="margin-left: 10px; color: red;">删除</el-button>
          </el-popconfirm>
      </template>
    </tr-table>
    <!-- 上传文件 导出文件弹窗组件 -->
    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      @on-submit-excel ="importInfoExcel"
    ></file-dialog>
      <!-- @on-submit-excel ="importInfoExcel" -->

    <information-dialog
      ref="informationDialog"
      :time="time"
      :dialogBool.sync="isShowIssuePop"
      @save-issue="saveIssue"
    ></information-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import fileDialog from "./component/file-dialog";
import { formatDateTime } from "@/utils/index";
import informationDialog from "./component/information-dialog";
export default {
  name: "importWages",
  components: {
    subReq,
    fileDialog,
    informationDialog
  },
  mounted() {
    this.loadData()
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  data() {
    return {
      data: [],
      time:'',
      count: 0,
      money: 0,
      queryform: {},
      loading: false,
      TableHeight: 500,
      customSettingList: [
        {
          id: 1,
          label: "姓名",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable:false
        },
        {
          id: 2,
          label: "手机号",
          prop: "phone",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable:false
        },
        {
          id: 3,
          label: "账号",
          prop: "account",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable:false
        },
        {
          id: 4,
          label: "基本工资",
          prop: "basic_salary",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable:false
        },
        {
          id: 5,
          label: "工龄工资",
          prop: "seniority_pay",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable:false
        },
        {
          id: 6,
          label: "职称补贴",
          prop: "title_subsidies",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable:false
        },
        {
          id: 7,
          label: "预发数",
          prop: "pretest_number",
          width: "145",
          align: "center",
          signIndex: 6,
          sortable:false
        },

        {
          id: 8,
          label: "奖金",
          prop: "bonus",
          width: "145",
          align: "center",
          signIndex: 7,
          sortable:false
        },
        {
          id: 9,
          label: "加班费",
          prop: "overtime_pay",
          width: "145",
          align: "center",
          signIndex: 8,
          sortable:false
        },
        {
          id: 10,
          label: "代发工资",
          prop: "agency_salary",
          width: "145",
          align: "center",
          signIndex: 9,
          sortable:false
        },
        {
          id: 11,
          label: "应发工资",
          prop: "should_pay",
          width: "145",
          align: "center",
          signIndex: 10,
          sortable:false
        },
        {
          id: 12,
          label: "扣基本养老金",
          prop: "pension",
          width: "145",
          align: "center",
          signIndex: 11,
          sortable:false
        },
        {
          id: 13,
          label: "扣医保基本金",
          prop: "health_care",
          width: "145",
          align: "center",
          signIndex: 12,
          sortable:false
        },
        {
          id: 14,
          label: "扣住房公积金",
          prop: "accumulation_fund",
          width: "145",
          align: "center",
          signIndex: 13,
          sortable:false
        },
        {
          id: 15,
          label: "扣失业保险金",
          prop: "unemployment_insurance",
          width: "145",
          align: "center",
          signIndex: 14,
          sortable:false
        },
        {
          id: 16,
          label: "工会费",
          prop: "union_fee",
          width: "145",
          align: "center",
          signIndex: 15,
          sortable:false
        },
        {
          id: 17,
          label: "房租水电费",
          prop: "rent_hydropower",
          width: "145",
          align: "center",
          signIndex: 16,
          sortable:false
        },
        {
          id: 18,
          label: "考勤扣款",
          prop: "attendance_deductions",
          width: "145",
          align: "center",
          signIndex: 17,
          sortable:false
        },
        {
          id: 19,
          label: "应扣合计",
          prop: "should_deduct",
          width: "145",
          align: "center",
          signIndex: 18,
          sortable:false
        },
        {
          id: 20,
          label: "补扣20%工资",
          prop: "fill_deduct",
          width: "145",
          align: "center",
          signIndex: 19,
          sortable:false
        },
        {
          id: 21,
          label: "计税工资",
          prop: "plan_duty_salary",
          width: "145",
          align: "center",
          signIndex: 20,
          sortable:false
        },
        {
          id: 22,
          label: "扣个税",
          prop: "income_tax",
          width: "145",
          align: "center",
          signIndex: 21,
          sortable:false
        },
        {
          id: 23,
          label: "实发工资",
          prop: "real_wages",
          width: "145",
          align: "center",
          signIndex: 22,
          sortable:false
        },
        {
          id: 24,
          label: "操作",
          prop: "operation",
          width: "145",
          align: "center",
          signIndex: 23,
          sortable:false
        },
      ],
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/工资条导入模板.xlsx`,
      },
      filedialogVisible:false,//导入弹窗
      canRendererTableHeader: null,
      isShowIssuePop: false 
    }
  },
  methods: {
    // 查询
    onSubmit(form) {
      this.queryform = form;
      this.loadData();
    },
    // 加载数据
    loadData() {
      this.loading = true
      let params = {};
      params = Object.assign({},this.queryform);
      params.page_index = 1;
      params.page_size = 100;
      this.$client.GetRecentOaWage(params).then(req => {
        this.loading = false
        if (req.head.result == "200") {
            this.data = req.context.list
            this.count = req.context.summary.count
            this.money = req.context.summary.money,
            this.time = req.context.summary.time
          } else {
            this.$message({
              showClose: true,
              message: req.head.describle,
              type: "error",
            });
          }
      })
    },
    // 打开导入弹窗
    openImportFilePop() {
      this.filedialogVisible = true;
    },
    // 导入信息Excel
    importInfoExcel(val){
      // alert(JSON.stringify(val))
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.type);
      formData.append("month", val.month);
      let params = formData;
      // console.log(params)
      this.$client.ImportOaWage(params)
      .then(res => {
        this.filedialogVisible = false;
        if(res.head.result == "200") {
          this.queryform = {};
          this.loadData();
          this.$message({ message: res.head.describle, type: "success" });
        }else{
          if(res.context.length !== 0) {
            let errorData = [];
            const h = this.$createElement;
            res.context.forEach(item => {
              errorData.push(h('p',null,item));
            })
            this.$msgbox({
              title: '提示',
              message: h('div',null, errorData),
              confirmButtonText: '确定',
            })
          }else {
            let errorData = [];
            const h = this.$createElement;
            errorData.push(h('p',null,res.head.describle));
            this.$msgbox({
              title: '提示',
              message: h('div',null, errorData),
              confirmButtonText: '确定',
            })
          }
          // this.$message({ message: res.head.describle, type: "error" });
        }
      })
    },
    // 删除
    deleteRowInfo(val) {
      let params = {}
      params = {
        context: [val.id]
      }
      this.$client.DeleteOaWage(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loadData();
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData()
    },
    // 打开下发指令
    openIssuePop() {
      this.isShowIssuePop = true
    },
    //  保存下发工资条
    saveIssue(form) {

      let params = JSON.parse(JSON.stringify(form)) 
      this.$client.SendOaWage(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loadData();
          this.isShowIssuePop = false
          this.$message({
            showClose: true,
            message: `${!params.cover?'下发工资条成功':'再次下发工资条成功'}`,
            type: "success",
          });
        }else if(res.head.result == "202") {
          this.isShowIssuePop = false
          params.cover = 1
          this.secondSaveIssue(params)
        }else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    secondSaveIssue(params) {
      this.$confirm('是否确认覆盖上次已发工资条?', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.saveIssue(params)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$refs.importWages.offsetHeight;
        let th = this.$refs.wagesHead.$el.offsetHeight;
        this.TableHeight = maxh - th- 30;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.import-wages {
  height: 100%;
  width: 100%;
}
</style>
