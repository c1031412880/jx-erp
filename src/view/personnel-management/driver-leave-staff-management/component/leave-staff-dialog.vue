<template>
  <el-dialog
    :visible="dialogBool"
    fullscreen
    :before-close="dialogClose"
    center
  >
    <!-- <el-page-header slot="title" @back="dialogClose" :content="showTitle" class="show-flex-box-r show-flex-center"></el-page-header> -->
    <tr-page-header ref="trPageHeader" slot="title" :content="showTitle" @back="dialogClose"></tr-page-header>
    <div class="leave-staff-dialog">
      <div class="search-content">
        <sub-req
          ref="head"
          @on-ok="onSubmit"
          @on-export="exportFile"
         ></sub-req>
      </div>
      <div class="table-content">
        <tr-table
          ref="table"
          :selectionShow="true"
          :data="leaveStaffData"
          :tableHeaderList="canRendererTableHeader"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          @on-select-change-row="selectedUpkeepPlanList"
          @on-select-row="openSelectRowPage"
        >
          <template slot-scope="scope" slot="operation">
            <el-button
              type="primary"
              size="mini"
              @click.stop="openLeaveRecordPop(scope.data)"
              >修改离职信息</el-button
            >
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
      </div>
      <div class="dialog-content">
        <!-- 修改离职信息弹窗 -->
        <change-leave-info-dialog
          ref="changeLeaveInfoDialog"
          :dialogBool.sync="changeLeaveInfoDialogShow"
          @submit-update-info="submitUpdateInfo"
        >
        </change-leave-info-dialog>
        <!-- 个人主页弹窗 -->
        <personal-homepage-dialog
          ref="personalHomepageDialog"
          :homePageType="'haveQuitted'"
          :dialogBool.sync="personalHomepageDialogShow"
        ></personal-homepage-dialog>
      </div>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import subReq from "./dialog/sub-req";
import changeLeaveInfoDialog from "./dialog/change-leave-info-dialog.vue";
import personalHomepageDialog from "./dialog/personal-homepage-dialog.vue";
export default {
  components: {
    subReq,
    changeLeaveInfoDialog,
    personalHomepageDialog
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      showTitle: "已离职员工",
      TableHeight: 500,
      loading: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        pageCount: 0,
      },
      frontFixedNum: 1,
      backFixedNum: 1,
      leaveStaffData: [],
      canRendererTableHeader: null,
      customSettingList: [
        {
          id: 1,
          label: "姓名",
          prop: "c_name",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "部门",
          prop: "department_name",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "离职日期",
          prop: "d_dimission_date",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "离职原因",
          prop: "ex_dimission_reason",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "操作",
          prop: "operation",
          width: "180",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
      ],
      changeLeaveInfoDialogShow: false,
      personalHomepageDialogShow: false
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.loadData();
        this.$nextTick(() => {
          this.setHead('initialize');
          window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
            this.setHead()
          })
        });
      }
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 初始化信息
    configCircuitfInfo() {
      this.showTitle = `已离职员工(${this.pageInfo.pageCount }人)`;
    },
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    // 加载数据
    loadData() {
      this.loading = true
      let params = {
        i_emp_state : 0
      };
      params = Object.assign(params,this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getEmployeeManageList(params)
        .then(res => {
          if (res.head.result == "200") {
            // console.log(res)
            this.loading = false;
            this.leaveStaffData = res.context.list;
            this.pageInfo.pageCount = res.context.total
            this.configCircuitfInfo();
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    selectedUpkeepPlanList(selectedId) {},
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
    // 打开修改离职员工记录弹窗
    openLeaveRecordPop(leaveInfo) {
      // console.log(leaveInfo)
      // return
      this.$refs.changeLeaveInfoDialog.personInfo.c_name = leaveInfo.c_name;
      this.$refs.changeLeaveInfoDialog.personInfo.c_photo = leaveInfo.c_photo;
      setTimeout(() => {
        for (const key in this.$refs.changeLeaveInfoDialog.ruleForm) {
          if (Object.hasOwnProperty.call(leaveInfo, key)) {
            this.$refs.changeLeaveInfoDialog.ruleForm[key] = leaveInfo[key]
          }
        }
      },50)

      this.changeLeaveInfoDialogShow = true
    },
    // 更新保存离职信息
    submitUpdateInfo(info) {
      let params = {
        context: info
      };
      this.$client.editMployeeDimission(params)
          .then(res => {
            if (res.head.result == "200") {
              this.loadData();
              this.changeLeaveInfoDialogShow = false;
              this.$message({
                showClose: true,
                message: "修改离职信息成功",
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
    // 导出Excel 文件
    exportFile(){
     let params = {
        i_emp_state : 0
      };
      params = Object.assign(params,this.form);

      this.$client.exportStaffInfo(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 打开个人主页
    openSelectRowPage(row) {
      // console.log(row)
      this.$refs.personalHomepageDialog.personalInfo = row;
      this.personalHomepageDialogShow = true;
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
        let trPageHeader = this.$refs.trPageHeader.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH - 100 - trPageHeader;
        // console.log(this.TableHeight);
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
