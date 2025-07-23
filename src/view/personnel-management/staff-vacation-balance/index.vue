<template>
  <div class="staff-vacation-balance">
    <sub-req
      ref="head"
      @on-set="openOverTimeTransferRule"
      @on-ok="onSubmit"
      @on-export="onExport"
      @on-import="openfiledialog"
    ></sub-req>
    <tr-table
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :frontFixedNum="1"
      :backFixedNum="0"
      :loading="loading"
    >
      <template slot-scope="scope" slot="join_in">
        <span style="color: #409eff; cursor: pointer">{{ scope.data.join_in }}</span>
      </template>
      <template slot-scope="scope" slot="word_year">
        <span style="color: #409eff; cursor: pointer">{{ scope.data.word_year }}</span>
      </template>
      <template slot-scope="scope" slot="year_balance">
        <span
          style="color: #409eff; cursor: pointer"
          @click="openStaffBalanceDetail(scope.data, 5)"
        >
          {{ scope.data.year_balance }}
        </span>
      </template>
      <template slot-scope="scope" slot="only_child_banlance">
        <span
          style="color: #409eff; cursor: pointer"
          @click="openStaffBalanceDetail(scope.data, 12)"
        >
          {{ scope.data.only_child_banlance }}
        </span>
      </template>
      <template slot-scope="scope" slot="parental_balance">
        <span
          style="color: #409eff; cursor: pointer"
          @click="openStaffBalanceDetail(scope.data, 11)"
        >
          {{ scope.data.parental_balance }}
        </span>
      </template>
      <template slot-scope="scope" slot="compensatory_balance">
        <span
          style="color: #409eff; cursor: pointer"
          @click="openStaffBalanceDetail(scope.data, 13)"
        >
          {{ scope.data.compensatory_balance }}
        </span>
      </template>
      <template slot-scope="scope" slot="marriage_balance">
        <span
          style="color: #409eff; cursor: pointer"
          @click="openStaffBalanceDetail(scope.data, 6)"
        >
          {{ scope.data.marriage_balance }}
        </span>
      </template>
      <template slot-scope="scope" slot="nursing_balance">
        <span
          style="color: #409eff; cursor: pointer"
          @click="openStaffBalanceDetail(scope.data, 14)"
        >
          {{ scope.data.nursing_balance }}
        </span>
      </template>
      <!-- <template slot-scope="scope" slot="operation">
          <el-popconfirm
            @confirm="deleteRowInfo(scope.data)"
            v-if="$isPowerShow('delete')"
            title="确定删除此条记录吗？">
            <el-button slot="reference" type="text" size="mini" style="margin-left: 10px; color: red;">删除</el-button>
          </el-popconfirm>
      </template> -->
    </tr-table>

    <el-pagination
      ref="paginationH"
      style="margin: 5px 0; display: flex; justify-content: flex-end"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    ></el-pagination>

    <!-- 添加普通员工、驾驶员信息 -->
    <!-- <add-staff-dialog
      ref="addStaffDialog"
      :dialogBool.sync="addStaffDialogShow"
      :showCollapse="showCollapse"
      :curChangeType="curChangeType"
      @sure-save-staff-info="sureSaveStaffInfo"
    ></add-staff-dialog> -->

    <balance-info-dilalog
      ref="balanceInfoDilalog"
      :dialogBool.sync="balanceInfoDilalogShow"
      :deptName="deptName"
      :EntryTime="EntryTime"
      :userName="userName"
      :userId="userId"
      :curChangeType="'add'"
    ></balance-info-dilalog>

    <!-- 上传文件 导出文件弹窗组件 -->
    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :typeMessage="typeMessage"
      :isShowImportState="false"
      @on-submit-excel="importStaffInfoExcel"
    ></file-dialog>

    <!-- 设置规则 -->
    <rule-dialog ref="validityRule" :dialogBool.sync="ruleDialogShow"></rule-dialog>
  </div>
</template>

<script>
import subReq from './component/sub-req'
import ruleDialog from './component/dialog/rule-dialog'
import AddStaffDialog from '@/view/personnel-management/staff-manage/component/dialog/add-staff-dialog'
import balanceInfoDilalog from './component/dialog/balance-info-dilalog'
import fileDialog from '@/components/fileDialog/file-dialog.vue'
export default {
  name: 'staff-vacation-balance',
  components: {
    subReq,
    ruleDialog,
    AddStaffDialog,
    balanceInfoDilalog,
    fileDialog
  },
  mounted() {
    // this.loadData()
    this.$nextTick(() => {
      this.setHead('initialize')
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  data() {
    return {
      pageInfo: {
        //普通员工列表分页
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      data: [],
      form: {},
      loading: false,
      TableHeight: 500,
      canRendererTableHeader: null,
      customSettingList: [
        {
          id: 1,
          label: '姓名',
          prop: 'user_name',
          width: '130',
          align: 'center',
          signIndex: 0,
          sortable: false
        },
        // {
        //   id: 2,
        //   label: "身份证号码",
        //   prop: "id_card",
        //   width: "130",
        //   align: "center",
        //   signIndex: 1,
        //   sortable: false,
        // },
        {
          id: 3,
          label: '部门',
          prop: 'dept_name',
          width: '130',
          align: 'center',
          signIndex: 2,
          sortable: false
        },
        {
          id: 4,
          label: '入职时间',
          prop: 'join_in',
          width: '130',
          align: 'center',
          signIndex: 3,
          sortable: true
        },
        {
          id: 5,
          label: '积累工作年份(年)',
          prop: 'word_year',
          width: '160',
          align: 'center',
          signIndex: 4,
          sortable: true
        },
        {
          id: 6,
          label: '年假(天)',
          prop: 'year_balance',
          width: '130',
          align: 'center',
          signIndex: 5,
          sortable: true
        },
        {
          id: 9,
          label: '调休(天)',
          prop: 'compensatory_balance',
          width: '130',
          align: 'center',
          signIndex: 8,
          sortable: false
        },
        {
          id: 10,
          label: "婚假(天)",
          prop: "marriage_balance",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "育儿假",
          prop: "parental_balance",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "独生子女假",
          prop: "only_child_banlance",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
        {
          id: 13,
          label: "护理假",
          prop: "nursing_balance",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        // {
        //   id: 10,
        //   label: "陪产假(天)",
        //   prop: "operation",
        //   width: "130",
        //   align: "center",
        //   signIndex: 9,
        //   sortable: false,
        // },
        // {
        //   id: 12,
        //   label: "丧假(天)",
        //   prop: "operation",
        //   width: "130",
        //   align: "center",
        //   signIndex: 11,
        //   sortable: false,
        // },
      ],
      // showCollapse: 'first',
      curChangeType: 'edit',
      // addStaffDialogShow: false,
      balanceInfoDilalogShow: false,
      deptName: '',
      userName: '',
      EntryTime: '',
      userId: '',

      typeMessage: '年假余额',
      FileData: {
        url: window.newHttpConfig.URL_EASYMOCK + '/Files/TempFiles/年假余额导入模板.xlsx'
      },
      filedialogVisible: false,
      //  假期类型;1公出 2事假 3出差 4病假 5年假 6婚假 7产假 8哺乳假 9工伤假 10陪产假 11 育儿假 12独生子女陪护父母假 13调休 14疗休假
      typeList: [5, 6, 11, 12, 13, 14],
      ruleDialogShow: false
    }
  },
  methods: {
    // 导入
    importStaffInfoExcel(val) {
      let formData = new FormData()
      formData.append('file', val.file)
      formData.append('type', val.radio)
      let params = formData
      this.$client.ImportLeaveBalance(params).then(res => {
        if (res.head.result == '200') {
          this.form = {}
          this.pageInfo.pageIndex = 1
          this.pageInfo.pageCount = 0
          this.loadData()
          this.filedialogVisible = false
          this.$message({ message: res.head.describle, type: 'success' })
        } else {
          this.filedialogVisible = false
          let errorData = []
          const h = this.$createElement
          errorData.push(h('p', null, res.head.describle))
          this.$msgbox({
            title: '提示',
            message: h('div', null, errorData),
            confirmButtonText: '确定'
          })

          // this.$message({ message: res.head.describle, type: "error" });
        }
      })
    },
    // 打开导入文件弹窗
    openfiledialog() {
      this.filedialogVisible = true
    },
    // 导出
    onExport() {
      let params = { context: {} }
      params.context = Object.assign({}, this.form)
      // let ids = [ ...this.selectedIds ]
      // if(ids.length) {
      //   params.ids = ids.toString()
      // }
      //  if(this.selectedIds.length) {
      //   params.user_ids = this.selectedIds
      // }
      this.$client.ExportLeaveBalance(params).then(res => {
        if (res.head.result == '200') {
          window.location.href = res.context
          this.$message({ type: 'success', message: '导出成功' })
        } else {
          this.$message({ type: 'error', message: '导出失败' })
        }
      })
    },
    onSubmit(form) {
      this.form = form
      console.log(this.form)
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageCount = 0
      this.loadData()
    },
    loadData() {
      this.loading = true
      let params = { context: {} }
      params.context = Object.assign({}, this.form)
      params.context.page_index = this.pageInfo.pageIndex
      params.context.page_size = this.pageInfo.pageSize
      params.context.menu_code = this.$route.meta && this.$route.meta.code
      this.$client
        .GetByPageLeaveBalance(params)
        .then(res => {
          if (res.head.result == '200') {
            this.data = res.context.list
            this.pageInfo.pageCount = res.context.total
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageSize = sizes
      this.pageInfo.pageCount = 0
      this.loadData()
    },
    // 打开员工信息
    // openStaffDetail(user_id) {
    //   this.addStaffDialogShow = true
    //   let parmas = {
    //     id: user_id
    //   }
    //   this.$client.getEmployeeManageDetail(parmas).then((res) => {
    //     if (res.head.result == "200") {
    //       let staffInfo = res.context;
    //       this.curChangeType = 'edit'
    //       this.$refs['addStaffDialog'].setData(staffInfo)
    //     } else {
    //       this.$message({
    //         showClose: true,
    //         message: res.head.describle,
    //         type: "error",
    //       });
    //     }
    //   })
    // },
    // 编辑、保存 员工、驾驶员信息
    // sureSaveStaffInfo(context){
    //   context.i_is_driver = this.showCollapse == 'first'? 0 : 1;
    //   let params = {
    //     context: context
    //   };
    //   this.$client.addMployeeInfo(params)
    //   .then(res => {
    //     if(res.head.result == '200') {
    //       // this.form = {};
    //       if(this.showCollapse == 'first') {
    //         if(this.curChangeType == 'add') {
    //           this.form = {};
    //           this.pageInfo.pageCount = 0;
    //           this.pageInfo.pageIndex = 1;
    //         }
    //         this.loadData();
    //       }
    //       this.addStaffDialogShow = false;
    //       this.$message({
    //         showClose: true,
    //         type: 'success',
    //         message: '保存成功'
    //       })
    //     }else{
    //       this.$message({
    //         showClose: true,
    //         type: "error",
    //         message: res.head.describle
    //       })
    //     }
    //   })
    // },
    // 打开员工假期余额详情页
    openStaffBalanceDetail(row, type) {
      this.balanceInfoDilalogShow = true
      this.deptName = row.dept_name
      this.EntryTime = row.join_in
      this.userName = row.user_name
      this.userId = row.user_id
      //  假期类型;1公出 2事假 3出差 4病假 5年假 6婚假 7产假 8哺乳假 9工伤假 10陪产假 11 育儿假 12独生子女陪护父母假 13调休 14疗休假
      this.typeList.forEach(item => {
        this.$refs.balanceInfoDilalog.reqYearBalanceByUser(row.user_id, item)
        this.$refs.balanceInfoDilalog.reqYearBalanceDetail(row.user_id, item)
      })
      this.$refs.balanceInfoDilalog.reqOaLeaveDetailById(row.id)
    },
    // 打开加班转调休规则
    openOverTimeTransferRule() {
      this.ruleDialogShow = true
      this.$client
        .GetRuleRestManage()
        .then(res => {
          if (res.head.result == '200') {
            if (!!res.context) {
              this.$refs.validityRule.form = Object.assign({}, res.context)
              this.$refs.validityRule.date = res.context.month + '-' + res.context.day
            }
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: 'error'
          })
        })
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      if (type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let ph = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = maxh - th - ph
      }, 60)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.staff-vacation-balance
  width 100%
  height 100%
</style>
