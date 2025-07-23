<template>
  <div class="unconfirmed-separation">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-add="openAddJobPage"
      @on-leave="sureLeave"
      @on-export="exportFile"
      @on-import="importFile"
      @open-setting-page="customSettingVialogVisible = true"
    ></sub-req>
    <tr-table
      :data="data"
      :loading="loading"
      :selectionShow="true"
      :TableHeight="TableHeight"
      :backFixedNum="backFixedNum"
      :isShowBottomOptions="false"
      :frontFixedNum="frontFixedNum"
      :tableHeaderList="canRendererTableHeader"
      @on-select-row="openSelectRowPage"
      @on-select-change-row="selectedList">
      <template slot-scope="scope" slot="ex_source">
        <span>{{scope.data.ex_source}}</span>
        <el-button type="text" size="mini" @click.stop="checkInfo(scope.data)">查看</el-button>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="primary" size="mini" @click.stop="sureLeave(scope.data.id)">确认离职</el-button>
        <el-button type="danger" size="mini" @click.stop="cancleLeaveApply(scope.data)">撤销</el-button>
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
      :total="pageInfo.pageCount">
    </el-pagination>
    
    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      @save-add-edit="saveAddEdit"
    ></information-dialog>

    <!-- 个人主页 -->
    <personal-homepage-dialog
      ref="personalHomepageDialog"
      :homePageType="'quitted'"
      :dialogBool.sync="personalHomepageDialogShow"
    ></personal-homepage-dialog>

    <!-- 离职审批单 -->
    <leave-approve-form-dialog
      ref="leaveApproveFormDialog"
      :dialogBool.sync="leaveApproveFormDialogShow"
    ></leave-approve-form-dialog>

    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>

    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :typeMessage="'同名人员'"
      @on-submit-excel="onSubmitExcel"
    ></file-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import fileDialog from "@/components/fileDialog/file-dialog.vue";
import informationDialog from "./component/information-dialog";
import personalHomepageDialog from "./component/personal-homepage-dialog";
import leaveApproveFormDialog from "./component/leave-approve-form-dialog";
export default {
  name: 'unconfirmed-separation',
  components: {
    subReq,
    fileDialog,
    informationDialog,
    personalHomepageDialog,
    leaveApproveFormDialog
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
      selectedIds: [],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      customSettingVialogVisible: false,
      curSelecedType: "",
      informationDialogShow: false,
      informationDialogTitle: "添加",
      personalHomepageDialogShow: false,
      leaveApproveFormDialogShow: false,
      filedialogVisible:false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/离职导入模板.xlsx`,
      },
      customSettingList: [
        {
          id: 1,
          label: "姓名",
          prop: "ex_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "部门",
          prop: "ex_department_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "岗位",
          prop: "ex_position_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "状态",
          prop: "ex_state",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "预计离职日期",
          prop: "hope_date",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "交接人",
          prop: "ex_handover_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "离职原因",
          prop: "ex_reason",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "来源",
          prop: "ex_source",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "操作",
          prop: "operation",
          width: "210",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
      ],
    }
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
    // 设置表格列
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
    // 查询
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
      this.$client.listDimission(params)
        .then(res => {
          console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
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
    // 管理员办理离职
    openAddJobPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "确认离职并删除";
      this.informationDialogShow = true;
    },
    // 提交离职
    saveAddEdit(form) {
      let successrMessage = "提交离职成功";
      let parmas = {
        context: form
      };
      this.$client
        .dimissionDimission(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
            this.$message({
              showClose: true,
              message: successrMessage,
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
        .catch((err) => {});
    },
    // 导出
    exportFile() {
      let params = Object.assign({}, this.form);
      let ids = [ ...this.selectedIds ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      this.$client.exportDimission(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 导入
    importFile() {
      this.filedialogVisible = true;
    },
    // 导入
    onSubmitExcel(val) {
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      let params = formData;
      this.$client.ImportDimission(params)
      .then(res => {
        if(res.head.result == "200") {
          this.form = {};
          this.pageInfo.pageIndex = 1;
          this.pageInfo.pageCount = 0;
          this.loadData();
          this.filedialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        }else{
          this.filedialogVisible = false;
          let errorData = [];
          const h = this.$createElement;
          errorData.push(h('p',null,res.head.describle));
          this.$msgbox({
            title: '提示',
            message: h('div',null, errorData),
            confirmButtonText: '确定',
          })
        }
      })
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
    // 打开个人主页
    openSelectRowPage(row) {
      return
      this.personalHomepageDialogShow = true
      // console.log(row);
      let parmas = {
        id: row.person_id
      }
      this.$client
        .GetDriverEmployeeManageDetail(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            // console.log(res)
            this.$refs.personalHomepageDialog.personalInfo = {...res.context};
            this.$refs.personalHomepageDialog.personalInfo.d_dimission_date = row.hope_date;
            this.$refs.personalHomepageDialog.personalInfo.c_dimission_reason = row.ex_reason;
            this.$refs.personalHomepageDialog.personalInfo.c_dimission_remark = row.remark;
            this.$refs.personalHomepageDialog.personalInfo.ex_handover_name = row.ex_handover_name || '暂无';
            this.$refs.personalHomepageDialog.personalInfo.source = row.source;
            this.$refs.personalHomepageDialog.personalInfo.leave_id = row.leave_id;
            // this.personalHomepageDialogShow = true
            this.$message({
              showClose: true,
              message: successrMessage,
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
        .catch((err) => {});
    },
    // 查看离职信息
    checkInfo(info) {
      // 来源source（0个人提交1管理员办理）
      if(info.source === 1) {
        this.curSelecedType = 'detail';
        this.informationDialogTitle = "离职信息";
        this.informationDialogShow = true;
        let newForm = {...info}
        for (const key in this.$refs.informationDialog.form) {
          if (Object.hasOwnProperty.call(newForm, key)) {
            this.$refs.informationDialog.form[key] = newForm[key];
          }
        }
      }else{
        // 打开审批单
        this.leaveApproveFormDialogShow = true;
      }
    },
    // 确认离职
    sureLeave(id) {
      if(!id && !this.selectedIds.length) {
        this.$message({
          showClose: true,
          message: '请勾选要离职的数据',
          type: "warning",
        });
        return
      }
      this.$confirm('是否确认员工离职并删除员工所有权限，确认后将不可撤回', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let parmas = {
            context:  (id && id !=='leave') ? [id] : this.selectedIds
          }
          this.$client
            .confirmDimission(parmas)
            .then((res) => {
              if (res.head.result == "200") {
                this.loadData();
                this.$message({
                  showClose: true,
                  message: "离职成功",
                  type: "success",
                });
              } else {
                this.$message({
                  showClose: true,
                  message: res.head.describle,
                  type: "error",
                });
              }
            }).catch((err) => {});
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
    },
    // 撤销离职
    cancleLeaveApply(form) {
      this.$confirm('是否确认撤销离职，确认后将不可撤回', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let parmas = {
            context: [form.id]
          }
          this.$client.cancelDimission(parmas).then((res) => {
            if (res.head.result == "200") {
              this.loadData();
              this.$message({
                showClose: true,
                message: "撤销成功",
                type: "success",
              });
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
          }).catch((err) => {});
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
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
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
        this.customSettingShowList = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let ph = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - ph - 14;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.unconfirmed-separation
  height: 100%
  width: 100%
</style>