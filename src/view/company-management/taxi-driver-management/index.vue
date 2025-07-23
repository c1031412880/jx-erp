<template>
  <div class="taxi-driver-management">
    <sub-req
      ref="head"
      :taxiList="taxiList"
      @on-export="exportExcel"
      @on-import="openImportPop"
      @on-ok="onSubmit"
      @on-add="openAddPop"
      @open-setting-Page="openSettingPageEvent"
      @on-delete="batchDelete"
    ></sub-req>
    <tr-table
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading || headerLoading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectedTableList"
      @sort-table-change="sortTableChange"
    >
      <template slot-scope="scope" slot="state_name">
        <span :style="`color:${scope.data.state == 1 ? '#409EFF' : '#F56C6C'}`">
          {{ scope.data.state_name }}
        </span>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button
          type="primary"
          size="mini"
          @click="editRowInfo(scope.data, 'edit')"
          v-if="$isPowerShow('edit')"
        >
          编辑
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="editRowInfo(scope.data, 'detail')"
          v-if="$isPowerShow('search')"
          style="margin-right: 10px"
        >
          查看
        </el-button>
        <el-popconfirm
          @confirm="deleteRowInfo(scope.data)"
          title="确定删除此条记录吗？"
          v-if="$isPowerShow('del')"
        >
          <el-button slot="reference" type="danger" size="mini">删除</el-button>
        </el-popconfirm>
      </template>
    </tr-table>

    <el-pagination
      style="margin: 5px 0; display: flex; justify-content: flex-end"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    ></el-pagination>

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      :taxiList="taxiList"
      @save-add-edit="saveAddEdit"
    ></information-dialog>
    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :typeMessage="'相同驾驶员姓名'"
      @on-submit-excel="onSubmitExcel"
    ></file-dialog>
    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
import fileDialog from "@/components/fileDialog/file-dialog.vue";
export default {
  name: "taxi-driver-management",
  components: {
    subReq,
    informationDialog,
    fileDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      FileData: {
        url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/出租车司机信息模板.xlsx",
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
          label: "车牌号",
          prop: "lincense_plate_number",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "姓名",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "电话",
          prop: "phone",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "性别",
          prop: "gender_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "身份证号",
          prop: "id_number",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "籍贯",
          prop: "address",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "驾驶证到期日",
          prop: "driver_end_date",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "发证机关",
          prop: "auth_license",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "服务证到期日",
          prop: "service_end_date",
          width: "150",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "服务证号",
          prop: "service_number",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "从业资格证日期",
          prop: "qulification_date",
          width: "160",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
        {
          id: 13,
          label: "聘用开始日期",
          prop: "hire_start",
          width: "160",
          align: "center",
          signIndex: 12,
          sortable: true,
        },
        {
          id: 14,
          label: "聘用到期日期",
          prop: "hire_end",
          width: "160",
          align: "center",
          signIndex: 13,
          sortable: true,
        },
        {
          id: 15,
          label: "备案卡",
          prop: "record_number",
          width: "150",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "中介所",
          prop: "agency",
          width: "160",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "备注",
          prop: "remark",
          width: "190",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
        {
          id: 18,
          label: "操作",
          prop: "operation",
          width: "240",
          align: "center",
          signIndex: 17,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      filedialogVisible: false,
      selectedIds:[],
      titlesId:'', //当前表头的id
      menu_code:'',
      headerLoading: false,
      taxiList:[]
    };
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  mounted() {
    this.reqTaxiDriverList()
    this.loadData();
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 打开自定义表头
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 更新表格表头
    updateTableHeader(newestTableHeaderList) {
      this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {

        this.reqTitleTable()
      }).catch(err => {

      })
    },
    // 获取表头
    reqTitleTable() {
      this.headerLoading = true;
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
        this.$forceUpdate();
        setTimeout(() =>{
          this.headerLoading = false;
        },600)
      }).catch(err => {
        setTimeout(() =>{
          this.headerLoading = false;
        },600)
      })
    },

    // 表头排序
    sortTableChange(sortFrom) {
      // console.log(sortFrom)
      if(!!sortFrom) {
        this.form = Object.assign(this.form, sortFrom)
      }else{
        delete this.form.sort
        delete this.form.ase
      }
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      // console.log(this.form,111111111111111)
      this.loadData()
    },


     // 导出Excel
    exportExcel(){
      let params = Object.assign({}, this.form);
      let ids = [ ...this.selectedIds ]
      if(ids.length) {
        params.ids = ids
      }
      this.$client.ExportTaxiDriver(params)
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
    openImportPop() {
      this.filedialogVisible = true;
    },
     // 导入
    onSubmitExcel(exportInfo) {
      let formData = new FormData();
      formData.append("file", exportInfo.file);
      formData.append("type", exportInfo.radio);
      let params = formData;
      this.$client.ImportTaxiDriver(params)
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

    // 获取出租车列表
    reqTaxiDriverList(){
      this.$client.GetDataTaxi()
        .then(res => {
          if (res.head.result == "200") {
            if(!!res.context.list&&res.context.list.length) {

              this.taxiList =  res.context.list
            }
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

    onSubmit(form) {
      this.form = form
      console.log(this.form);
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
      this.$client.GetDataTaxiDriver(params)
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


    // 编辑、添加
    saveAddEdit(form) {
       let successrMessage = "";
      let parmas = {
        context: form
      };
      if (this.curSelecedType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
        this.$client.AddTaxiDriver(parmas).then((res) => {
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
      } else {
        successrMessage = "编辑成功";
        this.$client.EditTaxiDriver(parmas).then((res) => {
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
      }
    },
    // 刷新
    restTableList() {
      this.form = {};
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    openAddPop() {
      this.curSelecedType = 'add';
      this.informationDialogTitle = "添加出租车驾驶员档案";
      this.informationDialogShow = true;
    },

    openAdvancedFilterPage() {
      this.drawerdialogVisible = true;
    },

    selectedTableList(lsit) {
      this.selectedIds = [];
      lsit.forEach((item,index) => {
        this.selectedIds.push(item.id)
      });
      // console.log(JSON.stringify(this.selectedIds))
    },

    // 编辑
    editRowInfo(form,type) {
      this.curSelecedType = type;
      this.$refs.informationDialog.setData(form)
      this.informationDialogTitle = type == 'edit'?"编辑出租车驾驶员档案":"出租车驾驶员档案详情";
      this.informationDialogShow = true;
    },
    batchDelete() {
       if(this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要删除的记录',
          type: "warning",
        });
        return
      }
      this.deleteRowInfo(null);
    },
    // 删除
    deleteRowInfo(info) {
      let params = {
        context: []
      };

      if(!!info) {
        params.context[0] = info.id
      }else{
        params.context = this.selectedIds
      }

      this.$client.DeleteTaxiDriver(params)
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
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
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
.taxi-driver-management {
  width: 100%;
  height: 100%;
}
</style>
