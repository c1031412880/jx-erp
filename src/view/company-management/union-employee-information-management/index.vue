<template>
  <div class="union-employee-information-management">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-import="filedialogVisible = true"
      @on-export="onExport"
      @on-add="addStaffInfo"
      @open-setting-page="customSettingVialogVisible = true"
    ></sub-req>

    <tr-table
      :data="data"
      :loading="loading"
      :TableHeight="TableHeight"
      :isShowBottomOptions="false"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :tableHeaderList="canRendererTableHeader"
      @on-select-change-row="selectedUpkeepPlanList">
      <template slot-scope="scope" slot="user_name">
        <span>{{scope.data.user_name ? scope.data.user_name : scope.data.person_info ? scope.data.person_info.c_name : ''}}</span>
      </template>
      <template slot-scope="scope" slot="department_name">
        <span>{{scope.data.dept_name ? scope.data.dept_name : scope.data.person_info ? scope.data.person_info.department_name : ''}}</span>
      </template>
      <template slot-scope="scope" slot="c_worker_id">
        <span>{{scope.data.c_worker_id ? scope.data.c_worker_id : scope.data.person_info ? scope.data.person_info.c_worker_id : ''}}</span>
      </template>
      <template slot-scope="scope" slot="position_name">
        <span>{{scope.data.person_info ? scope.data.person_info.position_name : ''}}</span>
      </template>
      <template slot-scope="scope" slot="job_level">
        <span>{{scope.data.person_info ? scope.data.person_info.job_level : ''}}</span>
      </template>
      <template slot-scope="scope" slot="c_phone">
        <span>{{scope.data.c_phone ? scope.data.c_phone : scope.data.person_info ? scope.data.person_info.c_phone : ''}}</span>
      </template>
      <template slot-scope="scope" slot="c_gender">
        <span>{{scope.data.c_gender ? scope.data.c_gender : scope.data.person_info ? scope.data.person_info.c_gender : ''}}</span>
      </template>
      <template slot-scope="scope" slot="c_idcord">
        <span>{{scope.data.person_info ? scope.data.person_info.c_idcord : ''}}</span>
      </template>
      <template slot-scope="scope" slot="d_birthday">
        <span>{{scope.data.person_info ? scope.data.person_info.d_birthday : ''}}</span>
      </template>
      <template slot-scope="scope" slot="age">
        <span>{{scope.data.person_info ? scope.data.person_info.age : ''}}</span>
      </template>
      <template slot-scope="scope" slot="job_state">
        <span>{{scope.data.person_info ? scope.data.person_info.job_state : ''}}</span>
      </template>
      <template slot-scope="scope" slot="employee_type_name">
        <span>{{scope.data.person_info ? scope.data.person_info.employee_type_name : ''}}</span>
      </template>
      <template slot-scope="scope" slot="d_join_company">
        <span>{{scope.data.d_join_company ? scope.data.d_join_company : scope.data.person_info ? scope.data.person_info.d_join_company : '' | setDateTime()}}</span>
      </template>
      <template slot-scope="scope" slot="join_company_age">
        <span>{{scope.data.join_company_age ? scope.data.join_company_age : scope.data.person_info ? scope.data.person_info.join_company_age : ''}}</span>
      </template>
      <template slot-scope="scope" slot="d_labor_contract_time">
        <span>{{scope.data.person_info ? scope.data.person_info.d_labor_contract_time : ''}}</span>
      </template>    
      <template slot-scope="scope" slot="c_political">
        <span>{{scope.data.c_political ? scope.data.c_political : scope.data.person_info ? scope.data.person_info.c_political : ''}}</span>
      </template>
      <template slot-scope="scope" slot="d_join_party">
        <span>{{scope.data.d_join_party ? scope.data.d_join_party : scope.data.person_info ? scope.data.person_info.d_join_party : '' | setDateTime()}}</span>
      </template>
      <template slot-scope="scope" slot="highest_education_name">
        <span>{{scope.data.highest_education_name ? scope.data.highest_education_name : scope.data.person_info ? scope.data.person_info.highest_education_name : ''}}</span>
      </template>
      <template slot-scope="scope" slot="c_hometown">
        <span>{{scope.data.c_hometown ? scope.data.c_hometown : scope.data.person_info ? scope.data.person_info.c_hometown : ''}}</span>
      </template>
      <template slot-scope="scope" slot="c_live_temp_adrress">
        <span>{{scope.data.c_live_temp_adrress ? scope.data.c_live_temp_adrress : scope.data.person_info ? scope.data.person_info.c_live_temp_adrress : ''}}</span>
      </template>
      <template slot-scope="scope" slot="i_socialpay">
        <span>{{scope.data.person_info ? scope.data.person_info.i_socialpay : ''}}</span>
      </template>  
      
      <!-- <template slot-scope="scope" slot="d_join_party">
        <span>{{scope.data.d_join_party | setDateTime()}}</span>
      </template> -->
      <template slot-scope="scope" slot="join_trade">
        <span>{{scope.data.join_trade | setDateTime()}}</span>
      </template>
      <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" @click="editRowInfo(scope.data, 'detail')">查看</el-button>
          <el-button style="margin-right: 10px" type="primary" size="mini" @click="editRowInfo(scope.data, 'edit')" v-if="$isPowerShow('edit')">编辑</el-button>
          <el-popconfirm
            @confirm="deleteRowInfo(scope.data)"
            title="确定删除此条记录吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
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
      :total="pageInfo.pageCount">
    </el-pagination>

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

    <add-staff-dialog
      ref="addStaffDialog"
      :dialogBool.sync="addStaffDialogShow"
      :curChangeType="curChangeType"
      :showCollapse="showCollapse"
      @sure-save-staff-info="sureSaveStaffInfo"
    ></add-staff-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import fileDialog from "@/components/fileDialog/file-dialog.vue";
import AddStaffDialog from './component/dialog/add-staff-dialog'
export default {
  name: 'union-employee-information-management',
  components: {
    subReq,
    fileDialog,
    AddStaffDialog,
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
      frontFixedNum: 2, //前几行固定
      backFixedNum: 1, //后几行固定
      customSettingVialogVisible: false,
      canRendererTableHeader: null,
      customSettingShowList: null,
      FileData: {
        url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/工会会员导入模板.xlsx",
      },
      filedialogVisible: false,
      selectedIds:[],  //表格选中
      addStaffDialogShow: false,
      curChangeType: 'add', //add添加  edit编辑  detail详情
      showCollapse: 'first',
      customSettingList: [
        {
          id: 1,
          label: "姓名",
          prop: "user_name",
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
          prop: "job_level",
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
          prop: "job_state",
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
          width: "160",
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
          label: "最高学历",
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
        // {
        //   id: 21,
        //   label: "户口性质",
        //   prop: "c_account_type",
        //   width: "130",
        //   align: "center",
        //   signIndex: 20,
        //   sortable: false,
        // },
        {
          id: 21,
          label: "现住址",
          prop: "c_live_temp_adrress",
          width: "130",
          align: "center",
          signIndex: 20,
          sortable: false,
        },
        {
          id: 22,
          label: "职称",
          prop: "c_title",
          width: "130",
          align: "center",
          signIndex: 21,
          sortable: false,
        },
        {
          id: 23,
          label: "社保缴纳",
          prop: "i_socialpay",
          width: "130",
          align: "center",
          signIndex: 22,
          sortable: false,
        },
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
          width: "220",
          align: "center",
          signIndex: 25,
          sortable: false,
        },
      ],  
    }
  },
  mounted() {
    this.$nextTick(() => {
        window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
          this.setHead()
        })
        this.setHead('initialize')
      })
  },
  methods: {
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
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 加载数据
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetByPageErpTradeMainManage(params)
        .then(res => {
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
    // 导入
    onSubmitExcel(exportInfo) {
      let formData = new FormData();
      formData.append("file", exportInfo.file);
      formData.append("type", exportInfo.radio);
      let params = formData;
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
          this.$message({ message: res.head.describle, type: "error" });
        }
      })
    },
    selectedUpkeepPlanList(jobList) {
      this.selectedIds = [];
      jobList.forEach((item,index) => {
        this.selectedIds.push(item.id)
      });
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
    // 编辑
    editRowInfo(form, type) {
      this.curChangeType = type;
      let info = {}
      if(form.person_info) {
        info = Object.assign({}, form.person_info)
      }
      info.affiliated_trade = form.affiliated_trade
      info.trade_post = form.trade_post
      info.join_trade = form.join_trade
      info.trade_code = form.trade_code
      info.is_difficulty = form.is_difficulty
      info.house_number = form.house_number
      info.user_id = form.user_id
      info.id = form.id
      info.difficulty_count = form.difficulty_count
      info.join_difficulty = form.join_difficulty
      // console.log(info);
      setTimeout(() => {
        this.$refs.addStaffDialog.setData(info);
      },60)
      this.addStaffDialogShow = true;
    },
    // 编辑、添加
    sureSaveStaffInfo(context){
      let successrMessage = "";
      let params = {
        context: context
      };
      if (this.curChangeType == "add") {
        delete params.context.id;
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }
      this.$client
        .CreateOrUpdateErpTradeMainManage(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.addStaffDialogShow = false;
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
    // 添加工会员工信息
    addStaffInfo(){
      this.addStaffDialogShow = true
      this.curChangeType = 'add'
      this.$refs['addStaffDialog'].resetData()
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
    // 计算表格高度
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let ph = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = maxh - th - ph
      }, 60)
    }
  },
  filters: {
    setDateTime(val) {
      return val ? val.slice(0, 10) : ''
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.union-employee-information-management
  height: 100%
  width: 100%
</style>