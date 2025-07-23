<template>
  <tr-dialog
    :visible="dialogBool"
    :title="title"
    @before-close="dialogClose"
    :appendToBody="true"
    ref="trDialog"
    width="1050px"
    top="10px"
  >
    <div class="el-dialog-div-content">
      <sub-req-first
        ref="head"
        @on-add="addStaffInfo"
        @on-ok="onSubmit"
        @on-import="openfiledialog"
        @on-export="exportFile"
        @func="getMsgFormSon"
      ></sub-req-first>
      <c-table
        ref="table"
        :selectionShow="true"
        :data="generalStaffData"
        :tableHeaderList="canRendererTableHeader"
        :TableHeight="TableHeight"
        :loading="loading || headerLoading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        @on-select-change-row="selectedList"
        @dbSelected="tableDbSelect"
      >
        <template slot-scope="scope" slot="count">
          <el-button @click="staffRowInfo(scope.data)" type="text" size="mini">
            {{ scope.data.count }}
          </el-button>
        </template>
      </c-table>
      <el-pagination
        style="margin: 15px 0; display: flex; justify-content: flex-end"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        ref="paginationH"
        :current-page="pageInfoFirst.pageIndex"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageInfoFirst.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="pageInfoFirst.pageCount"
      ></el-pagination>
      <add-staff-dialog
        ref="addStaffDialog"
        :dialogBool.sync="addStaffDialogShow"
        showCollapse="first"
        :appendToBody="true"
        :curChangeType="curChangeType"
        @sure-save-staff-info="sureSaveStaffInfo"
      ></add-staff-dialog>
      <!-- 上传文件 导出文件弹窗组件 -->
      <file-dialog
        :dialogBool.sync="filedialogVisible"
        :fileData="FileData"
        :appendToBody="true"
        :typeMessage="typeMessage"
        @on-submit-excel="importStaffInfoExcel"
      ></file-dialog>
    </div>
  </tr-dialog>
</template>

<script type="text/ecmascript-6">
import cTable from "./c-table";
import subReqFirst from "./sub-req-first";
import fileDialog from "@/components/fileDialog/file-dialog";
import jurisdiction from "@/view/401";
import AddStaffDialog from "./dialog/add-staff-dialog";
import circuitAllocationDialog from "./dialog/circuit-allocation-dialog";
import leaveStaffDialog from "./dialog/leave-staff-dialog";
export default {
  name: '',
  components: {
    cTable,
    subReqFirst,
    fileDialog,
    jurisdiction,
    AddStaffDialog,
    circuitAllocationDialog,
    leaveStaffDialog,
  },
  data() {
    return {
      title: '即时库存',
      generalStaffData: [], //普通员工列表
      frontFixedNum: 0, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: null,
      loading: false,
      headerLoading: false,
      TableHeight: 500,
      showCollapse: 'first',
      pageInfoFirst: {
        //普通员工列表分页
        pageIndex: 1,
        pageSize: 50,
        pageCount: 0,
      },
      customSettingFirstList: [
        {
          id: 1,
          label: "仓库",
          prop: "house_name",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "物料编码",
          prop: "material_code",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "物料名称",
          prop: "material_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "规格型号",
          prop: "specification",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "单位",
          prop: "measure_unit_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "销售均价(元)",
          prop: "price",
          width: "140",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "库存数量",
          prop: "count",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "销售金额(元)",
          prop: "total_price",
          width: "140",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "成本单价(元)",
          prop: "cost_price",
          width: "140",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "成本金额(元)",
          prop: "cost_total_price",
          width: "140",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "供应商名称",
          prop: "provider_name",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "物料分类",
          prop: "group_name",
          width: "120",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
        // {
        //   id: 13,
        //   label: "适用车型",
        //   prop: "vehicle_kind_names",
        //   width: "120",
        //   align: "center",
        //   signIndex: 12,
        //   sortable: true,
        // },
        {
          id: 13,
          label: "仓位",
          prop: "position",
          width: "135",
          align: "center",
          signIndex: 12,
          sortable: true,
        },
        {
          id: 14,
          label: "库存量状态",
          prop: "state_name",
          width: "140",
          align: "center",
          signIndex: 13,
          sortable: true,
        },
        {
          id: 15,
          label: "品牌",
          prop: "brand",
          width: "150",
          align: "center",
          signIndex: 14,
          sortable: true,
        },
      ],
      addStaffDialogShow: false, //添加员工信息
      curChangeType: "add", //add添加  edit编辑  detail详情
      filedialogVisible: false,
      FileData: {
        url:
          window.newHttpConfig.URL_EASYMOCK +
          "/Files/TempFiles/人员记录模板.xlsx",
      },
      typeMessage: "人员",
      menu_code:'10030300',
      firstQueryform: {}
    }
  },
  props: {
    dialogBool: Boolean,
    remoteWuzi: [String]
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        console.log('remoteWuzi', this.remoteWuzi)
        let info = {}
       this.$nextTick(() => {
         if (this.remoteWuzi) {
           info.material_code = this.remoteWuzi
           info.material_name = this.remoteWuzi
           info.mnemonic_code = this.remoteWuzi
           this.$refs.head.form.material_code = this.remoteWuzi
         }
         this.onSubmit(info)
       })
        this.reqTitleTable()
        this.$refs.trDialog.fullscreen = true
      }
    },
  },
  mounted() {
    this.$refs.trDialog.fullscreen = true
    this.$nextTick(() => {
      this.loadDataGeneralStaff();
    });
  },
  methods: {
    // 加载按批次号
    loadDataGeneralStaff() {
      this.loading = true;
      let params = {};
      params = Object.assign({}, this.firstQueryform);
      params.page_index = this.pageInfoFirst.pageIndex;
      params.page_size = this.pageInfoFirst.pageSize;
      this.$client.getByPage1TimerHouse(params).then((res) => {
        if (res.head.result == "200") {
          this.generalStaffData = res.context.list;
          this.generalStaffData.forEach(element => {
            if(element.price){
              element.price=element.price.toFixed(2)
              element.total_price=element.total_price.toFixed(2)
              if(element.cost_price){
                element.cost_price=element.cost_price.toFixed(2)
                if(element.cost_total_price){
                  element.cost_total_price=element.cost_total_price.toFixed(2)
                }
              }
            }
          });
          this.pageInfoFirst.pageCount = res.context.total;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
        this.loading = false;
      });
    },
    // 获取表头
    reqTitleTable() {
      this.headerLoading = true;
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingFirstList).then(res => {
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingFirstList = res.customSettingList;
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
    // 取消
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 添加信息
    addStaffInfo() {
      this.addStaffDialogShow = true;
      this.curChangeType = "add";
      this.$refs["addStaffDialog"].resetData();
    },
    // 查询
    onSubmit(form) {
      this.firstQueryform = form;
      this.pageInfoFirst.pageIndex = 1;
      this.pageInfoFirst.pageCount = 0;
      this.loadDataGeneralStaff();
    },
    // 打开导入文件弹窗
    openfiledialog() {
      this.filedialogVisible = true;
    },
    // 导出
    exportFile() {
      let params = Object.assign({}, this.firstQueryform);
      let ids = [ ...this.selectedIds ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      // params.i_is_driver = this.showCollapse == 'first'? 0 : 1;
      console.log(this.showCollapse);
      if (this.showCollapse == "first") {
        this.$client.export1TimerHouse(params).then((res) => {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        });
      } else {
        this.$client.exportTimerHouse(params).then((res) => {
          if (res.head.result == "200") {
            console.log(this.showCollapse);
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        });
      }
    },
    getMsgFormSon(data) {
      this.showCollapse = data;
      // console.log(this.msgFormSon)
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
    // 员工详情
    staffRowInfo(val) {
      this.addStaffDialogShow = true;
      this.curChangeType = "detail";
      this.$refs["addStaffDialog"].setData(val);
    },
    tableDbSelect(val) {
      this.$emit('table-db-select',val)
      this.dialogClose()
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfoFirst.pageIndex = idx;
      this.loadDataGeneralStaff();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfoFirst.pageIndex = 1;
      this.pageInfoFirst.pageSize = sizes;
      this.pageInfoFirst.pageCount = 0;
      this.loadDataGeneralStaff();
    },
    // 编辑、保存
    sureSaveStaffInfo(context) {
      context.i_is_driver = this.showCollapse == "first" ? 0 : 1;
      let params = {
        context: context,
      };
      this.$client.addMployeeInfo(params).then((res) => {
        if (res.head.result == "200") {
          // this.form = {};
          if (this.showCollapse == "first") {
            if (this.curChangeType == "add") {
              this.firstQueryform = {};
              this.pageInfoFirst.pageCount = 0;
              this.pageInfoFirst.pageIndex = 1;
            }
            this.loadDataGeneralStaff();
          } else {
            if (this.curChangeType == "add") {
              this.secondQueryform = {};
              this.pageInfoSecond.pageCount = 0;
              this.pageInfoSecond.pageIndex = 1;
            }
            this.loadDataDriver();
          }
          this.addStaffDialogShow = false;
          this.$message({
            showClose: true,
            type: "success",
            message: "保存成功",
          });
        } else {
          this.$message({
            showClose: true,
            type: "error",
            message: res.head.describle,
          });
        }
      });
    },
    // 导入员工信息Excel
    importStaffInfoExcel(val) {
      // alert(JSON.stringify(val))
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      formData.append("i_is_driver", this.showCollapse == "first" ? 0 : 1);
      let params = formData;
      // console.log(params)
      this.$client.importStaffInfo(params).then((res) => {
        if (res.head.result == "200") {
          // this.form = {};
          this.firstQueryform = {};
          this.pageInfoFirst.pageIndex = 1;
          this.pageInfoFirst.pageCount = 0;
          this.loadDataGeneralStaff();
          this.filedialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        } else {
          this.filedialogVisible = false;
          let errorData = [];
          const h = this.$createElement;
          errorData.push(h("p", null, res.head.describle));
          this.$msgbox({
            title: "提示",
            message: h("div", null, errorData),
            confirmButtonText: "确定",
          });

          // this.$message({ message: res.head.describle, type: "error" });
        }
      });
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
