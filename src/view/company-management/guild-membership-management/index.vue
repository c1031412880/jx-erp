<template>
  <div class="guild-membership-management">
    <sub-req
      ref="head"
      @on-add="openAddPage"
      @on-ok="onSubmit"
      @on-export="onExport"
      @on-import="openFiledialog"
      @open-sure-Page="openSurePage"
    ></sub-req>
    <!-- <div>
      <get-quarter-select @on-change="funcQuarter"></get-quarter-select>
    </div> -->
    <tr-table
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectedUpkeepPlanList">
      <template slot-scope="scope" slot="department_name">
        <span>{{scope[data.person_info] ? scope.data.person_info.department_name : ''}}</span>
      </template>
      <template slot-scope="scope" slot="position_name">
        <span>{{scope[data.person_info] ? scope.data.person_info.position_name : ''}}</span>
      </template>
      <template slot-scope="scope" slot="rank_name">
        <span>{{scope[data.person_info] ? scope.data.person_info.rank_name : ''}}</span>
      </template>
      <template slot-scope="scope" slot="c_idcord">
        <span>{{scope[data.person_info] ? scope.data.person_info.c_idcord : ''}}</span>
      </template>
      <template slot-scope="scope" slot="d_birthday">
        <span>{{scope[data.person_info] ? scope.data.person_info.d_birthday : ''}}</span>
      </template>
      <template slot-scope="scope" slot="age">
        <span>{{scope[data.person_info] ? scope.data.person_info.age : ''}}</span>
      </template>
      <template slot-scope="scope" slot="emp_state">
        <span>{{scope[data.person_info] ? scope.data.person_info.emp_state : ''}}</span>
      </template>
      <template slot-scope="scope" slot="employee_type_name">
        <span>{{scope[data.person_info] ? scope.data.person_info.employee_type_name : ''}}</span>
      </template>
      <template slot-scope="scope" slot="c_live_temp_adrress">
        <span>{{scope[data.person_info] ? scope.data.person_info.c_live_temp_adrress : ''}}</span>
      </template>
      <template slot-scope="scope" slot="join_company_age">
        <span>{{scope[data.person_info] ? scope.data.person_info.join_company_age : ''}}</span>
      </template>
      <template slot-scope="scope" slot="c_title">
        <span>{{scope[data.person_info] ? scope.data.person_info.c_title : ''}}</span>
      </template>
      <template slot-scope="scope" slot="d_join_company">
        <span>{{scope.data.d_join_company | setDateTime()}}</span>
      </template>
      <template slot-scope="scope" slot="d_join_party">
        <span>{{scope.data.d_join_party | setDateTime()}}</span>
      </template>
      <template slot-scope="scope" slot="join_trade">
        <span>{{scope.data.join_trade | setDateTime()}}</span>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" @click="editRowInfo(scope.data, 'detail')">详情</el-button>
        <el-button style="margin-right: 10px" type="text" size="mini" @click="editRowInfo(scope.data, 'edit')" v-if="$isPowerShow('edit')">编辑</el-button>
        <el-popconfirm
          @confirm="deleteRowInfo(scope.data)"
          title="确定删除此条记录吗？"
          v-if="$isPowerShow('del')">
          <el-button slot="reference" type="text" size="mini">删除</el-button>
        </el-popconfirm>
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
      @save-add-edit="saveAddEdit"
    ></information-dialog>

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
      :typeMessage="'同会员姓名'"
      @on-submit-excel="onSubmitExcel"
    ></file-dialog>
    <confirm-membership-dialog
      :dialogBool.sync="isShowConfirmMembership"
    ></confirm-membership-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
import fileDialog from "@/components/fileDialog/file-dialog.vue";
import confirmMembershipDialog from './component/confirm-membership-dialog.vue'
// import getQuarterSelect from 'components/base/formModel/select/get-quarter-select'
export default {
  name: "guild-membership-management",
  components: {
    subReq,
    informationDialog,
    fileDialog,
    confirmMembershipDialog
    // getQuarterSelect
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
      informationDialogShow: false,
      customSettingVialogVisible: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      drawerdialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "姓名",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "部门",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "工号",
          prop: "c_worker_id",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "职位",
          prop: "position_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "工会职务",
          prop: "trade_post_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "职级",
          prop: "rank_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "联系方式",
          prop: "c_phone",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "性别",
          prop: "c_gender",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "身份证号",
          prop: "c_idcord",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "出生年月",
          prop: "d_birthday",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "年龄",
          prop: "age",
          width: "145",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "状态",
          prop: "emp_state",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "用工形式",
          prop: "employee_type_name",
          width: "260",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "进单位时间",
          prop: "d_join_company",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "司龄",
          prop: "join_company_age",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "劳动合同期限",
          prop: "d_labor_contract_time",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "政治面貌",
          prop: "c_political",
          width: "130",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
        {
          id: 18,
          label: "入党/入团时间",
          prop: "d_join_party",
          width: "130",
          align: "center",
          signIndex: 17,
          sortable: false,
        },
        {
          id: 19,
          label: "学历",
          prop: "highest_education_name",
          width: "130",
          align: "center",
          signIndex: 18,
          sortable: false,
        },
        {
          id: 20,
          label: "籍贯",
          prop: "c_hometown",
          width: "130",
          align: "center",
          signIndex: 19,
          sortable: false,
        },
        {
          id: 21,
          label: "户口性质",
          prop: "c_account_type",
          width: "130",
          align: "center",
          signIndex: 20,
          sortable: false,
        },
        {
          id: 22,
          label: "现住址",
          prop: "c_live_temp_adrress",
          width: "130",
          align: "center",
          signIndex: 21,
          sortable: false,
        },
        {
          id: 23,
          label: "职称",
          prop: "c_title",
          width: "130",
          align: "center",
          signIndex: 22,
          sortable: false,
        },
        // {
        //   id: 24,
        //   label: "社保缴纳",
        //   prop: "remark",
        //   width: "130",
        //   align: "center",
        //   signIndex: 23,
        //   sortable: false,
        // },
        {
          id: 24,
          label: "入会时间",
          prop: "join_trade",
          width: "130",
          align: "center",
          signIndex: 23,
          sortable: false,
        },
        {
          id: 25,
          label: "会员证号",
          prop: "trade_code",
          width: "130",
          align: "center",
          signIndex: 24,
          sortable: false,
        },
        {
          id: 26,
          label: "操作",
          prop: "operation",
          width: "200",
          align: "center",
          signIndex: 25,
          sortable: false,
        },
      ],
      frontFixedNum: 2, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      filedialogVisible: false,
      selectedIds:[],
      FileData: {
        url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/工会会员导入模板.xlsx",
      },
      filedialogVisible: false,
      isShowConfirmMembership: false, // 打开确认入会
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize')
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // funcQuarter(value){
    //   console.log(value)
    // },
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
    onExport() {
      let params = Object.assign({},this.form);
      let ids = [ ...this.selectedIds ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      this.$client.ExportErpTradeMainManage(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },

     // 打开导入弹窗
    openFiledialog() {
      this.filedialogVisible = true;
    },
    // 导入
    onSubmitExcel(exportInfo) {
      let formData = new FormData();
      formData.append("file", exportInfo.file);
      formData.append("type", exportInfo.radio);

      let params = formData;
      // console.log(params)
      this.$client.ImportErpTradeMainManage(params)
      .then(res => {
        if(res.head.result == "200") {
          this.form = {};
          this.pageInfo.pageIndex = 1;
          this.pageInfo.pageCount = 0;
          this.loadData();
          this.filedialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        }else if(res.head.result == "205") {
          this.filedialogVisible = false;
          if(!!res.context && res.context.length > 0) {
            let errorData = [];
            let list = [];
            if(res.context.length > 20) {
              list = res.context.slice(0, 20);
            }else{
              list = res.context
            }
            let h = this.$createElement;
            list.forEach(element => {
              errorData.push(h('p',null,element));
            });
            this.$msgbox({
              title: `导入错误提示(共${list.length}条)`,
              message: h('div',null, errorData),
              confirmButtonText: '确定',
            })
          }
        } else{
          this.filedialogVisible = false;
          // let errorData = [];
          // const h = this.$createElement;
          // errorData.push(h('p',null,res.head.describle));
          // this.$msgbox({
          //   title: '提示',
          //   message: h('div',null, errorData),
          //   confirmButtonText: '确定',
          // })

          this.$message({ message: res.head.describle, type: "error" });
        }
      })
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
      this.$client.GetByPageErpTradeMainManage(params)
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
    // 编辑、添加
    saveAddEdit(form) {
      let successrMessage = "";
      let parmas = {
        context: form
      };
      if (this.curSelecedType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }
      this.$client
        .CreateOrUpdateErpTradeMainManage(parmas)
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
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    openAddPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "添加会员";
      this.informationDialogShow = true;
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

    openAdvancedFilterPage() {
      this.drawerdialogVisible = true;
    },

    selectedUpkeepPlanList(jobList) {
      this.selectedIds = [];
      jobList.forEach((item,index) => {
        this.selectedIds.push(item.id)
      });
      // console.log(JSON.stringify(this.selectedIds))
    },

    // 编辑
    editRowInfo(form, type) {
      this.curSelecedType = type;
      setTimeout(() => {
        this.$refs.informationDialog.setData(form);
      },60)
      // this.$refs.informationDialog.form.c_name = form.c_name;
      // this.$refs.informationDialog.form.c_remark = form.c_remark;
      this.informationDialogTitle = type == 'edit' ?  "编辑工会人员信息" : "查看工会人员信息";
      this.informationDialogShow = true;
    },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: [info.id]
      };

      this.$client.DeleteErpTradeMainManage(params)
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
      }).catch(err => {
        this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
      })
    },
    //打开确认入会
    openSurePage() {
      this.isShowConfirmMembership = true;
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
        this.TableHeight = maxh - th - 30;
      }, 60);
    },
  },
  filters: {
    setDateTime(val) {
      return val ? val.slice(0, 10) : ''
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.guild-membership-management {
  width: 100%;
  height: 100%;
}
</style>
