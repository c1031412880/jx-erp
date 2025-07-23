<template>
  <div class="accident-summary-statistics">
    <tr-table
      :selectionShow="false"
      :data="data"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="1"
      :backFixedNum="1"
    >
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" @click="editSalary(scope.data)">编辑</el-button>
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

    <add-setting-dialog
      :dialogBool.sync="settingnDialogShow"
    ></add-setting-dialog>

    <add-salary-dialog
      ref="salary"
      :dialogBool.sync="salarynDialogShow"
      @on-save="saveOrEdit"
      :salaryType="salaryType"
    ></add-salary-dialog>

    <!-- 上传文件 导出文件弹窗组件 -->
    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :isShowImportState="false"
      @on-submit-excel ="importStaffInfoExcel"
    ></file-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import addSettingDialog from './add-setting-dialog'
import addSalaryDialog from './add-salary-dialog'
import fileDialog from '@/components/fileDialog/file-dialog'
export default {
  name: "driver-induction-management",
  components: {
    addSettingDialog,
    addSalaryDialog,
    fileDialog
  },
  props : {
    TableHeight: {
      type: Number,
      default: 500
    }
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
      customSettingList: [
        {
          id: 1,
          label: "部门",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "驾驶员",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "驾照类别",
          prop: "driver_license_category",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "基本工资(元)",
          prop: "basic_salary",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "月度考核奖(元)",
          prop: "monthly_performance_bonus",
          width: "130",
          align: "center",
          signIndex: 4,
        },
        {
          id: 8,
          label: "医疗保险基数(元)",
          prop: "medical_insurance_base",
          width: "130",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "养老保险基数(元)",
          prop: "pension_insurance_base",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "失业保险基数(元)",
          prop: "unemployment_insurance_base",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "公积金(元)",
          prop: "accumulation_fund",
          width: "130",
          align: "center",
          signIndex: 10,
        },
        {
          id: 12,
          label: "工会费(元)",
          prop: "union_fee",
          width: "130",
          align: "center",
          signIndex: 11,
        },
        {
          id: 13,
          label: "房租水电(元)",
          prop: "union_fee",
          width: "130",
          align: "center",
          signIndex: 12,
        },
        {
          id: 14,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 13,
          sortable: false,
        }
      ],

      settingnDialogShow: false,
      salarynDialogShow: false,
      salaryType: 'add',
      filedialogVisible: false,
      FileData: {
        url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/驾驶员薪资管理导入模板.xlsx",
      },
    };
  },
  mounted() {
  },
  methods: {
    onSubmit(info) {
      this.form = info
      this.loadData()
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = {
        context: ''
      }
      params.context = Object.assign({}, this.form);
      params.context.type = 2
      params.context.page_index = this.pageInfo.pageIndex;
      params.context.page_size = this.pageInfo.pageSize;
      this.$client.GetByPageSalaryManage(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list || [];
            this.pageInfo.pageCount = res.context.total;

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

    showSettingDialog() {
      this.settingnDialogShow = true
    },
    showSalarynDialog() {
      this.salaryType = 'add'
      this.salarynDialogShow = true
    },
    showFileDialog() {
      this.filedialogVisible = true
    },
    editSalary(row) {
      this.salaryType = 'edit'
      this.salarynDialogShow = true

      this.$nextTick(() => {
        this.$refs['salary'].setData(row)
      })
    },
    saveOrEdit(form) {
      let params = {
        context: form
      }
      if (this.salaryType == 'add') {
        this.$client.AddSalaryManage(params).then(res => {
          if (res.head.result == "200") {
            this.$message({
              showClose: true,
              message: "保存成功",
              type: "success",
            });
            this.salarynDialogShow = false

            this.loadData()
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      } else {
        this.$client.EditSalaryManage(params).then(res => {
          if (res.head.result == "200") {
            this.$message({
              showClose: true,
              message: "编辑成功",
              type: "success",
            });
            this.salarynDialogShow = false
            this.loadData()
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      }
    },
    // 导入驾驶员薪资Excel
    importStaffInfoExcel(val){
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", 2);
      let params = formData;
      this.$client.ReadDriverFile(params)
      .then(res => {
        if(res.head.result == "200") {
          this.filedialogVisible = false;
          this.loadData()
          this.$message({ message: res.head.describle, type: "success" });
        }else{
          this.filedialogVisible = false;
          this.$message({
            showClose: true,
            message: res.head.detail,
            type: "error",
          });
        }
      })
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.accident-summary-statistics {
  width: 100%;
  height: 100%;
}

.accident-summary-statistics /deep/ .el-tabs__item {
  width: 160px;
  text-align: center;
}

.accident-summary-statistics /deep/ .el-tabs__nav-wrap::after {
  height: 0px;
}
</style>
