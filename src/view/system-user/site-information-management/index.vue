<template>
  <station-manage-data-center/>
</template>
<script type="text/ecmascript-6">
  export default {
    name: "site-information-management",
  }
</script>
<!-- <template>
  <div class="site-information-management">
    <sub-req
      ref="head"
      @on-add="openAddJobPage"
      @on-import="importFilePage"
      @on-export="exportFile"
      @on-ok="onSubmit"
    ></sub-req>
    <tr-table
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectedUpkeepPlanList"
    >
      <template slot-scope="scope" slot="Kind">
        <span>{{checkShowtext(scope.data.Kind)}}</span>
      </template>

      <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" @click="editRowInfo(scope.data)" v-if="$isPowerShow('edit')">编辑</el-button>
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

    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :typeMessage="'同名站点'"
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
  name: "site-information-management",
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
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      customSettingVialogVisible: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      customSettingList: [
        {
          id: 1,
          label: "站点简称",
          prop: "SimpleName",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "站点全称",
          prop: "Name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "站点类型",
          prop: "Kind",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "经度",
          prop: "Latitude",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "纬度",
          prop: "Latitude",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "半径",
          prop: "Radius",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "方位角",
          prop: "Reserve",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "备注",
          prop: "Remark",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "关联线路",
          prop: "associated_line",
          width: "250",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      FileData: {
        url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/工会会员信息.xlsx",
      },
      filedialogVisible: false,
      selectedIds:[],
    };
  },
  mounted() {
    this.loadData();
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
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
      console.log(JSON.stringify(this.canRendererTableHeader));
    },
    checkShowtext(type) {
      let showText = '';
      switch (type) {
        case '100':
          showText = '普通';
          break;
        case '200':
          showText = '主站';
          break;
        case '300':
          showText = '副站';
          break;
        case '400':
          showText = '预警点';
          break;
        case '500':
          showText = '停车场';
          break;
        default:
          showText = '--';
          break;
      }
      return showText
    },
    // 导出Excel
    exportFile(){
      let params = Object.assign({},this.form);
      let ids = [ ...this.selectedIds ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      this.$client.ExportStationManage(params)
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
    importFilePage() {
      this.filedialogVisible = true;
    },
    // 导入
    onSubmitExcel(exportInfo) {

      this.$message({
        showClose: true,
        message: '如需导入站点信息请到调度系统中导入，该系统暂未开放导入站点功能',
        type: "warning",
      });
      return

      
      let formData = new FormData();
      formData.append("file", exportInfo.file);
      formData.append("type", exportInfo.radio);

      let params = formData;
      // console.log(params)
      this.$client.ImportUpKeepPlan(params)
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

          // this.$message({ message: res.head.describle, type: "error" });
        }
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
      this.$client.GetStationsStationManage(params)
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

    checkrefOrgShow(refOrgList) {
      let showText = '';
      refOrgList.forEach(item => {
        showText = `${showText}${item},`
      });
      return showText
    },
    // 编辑、添加站点
    saveAddEdit(form) {
      this.$message({
        showClose: true,
        message: '如需修改站点信息请到调度系统中修改，该系统暂未开放修改站点功能',
        type: "warning",
      });
      return



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
        .addSysPositionInfo(parmas)
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
    // 批量删除站点
    deleteJob() {
      if(this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要删除的站点',
          type: "warning",
        });
        return
      }
      this.deleteRowInfo(null);
    },
    restTableList() {
      this.form = {};
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    openAddJobPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "添加站点";
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
    selectedUpkeepPlanList(jobList) {
      this.selectedIds = [];
      jobList.forEach((item,index) => {
        this.selectedIds.push(item.id)
      });
      console.log(JSON.stringify(this.selectedIds))
    },
    
    // 编辑
    editRowInfo(form) {
      // console.log(form);
      this.curSelecedType = "edit";
      setTimeout(() => {
        for (const key in this.$refs.informationDialog.form) {
          if (Object.hasOwnProperty.call(form, key)) {
            this.$refs.informationDialog.form[key] = form[key];
            if(form.Kind == '0') {
              this.$refs.informationDialog.form.Kind = ''
            }
          }
        }
      }, 200);
      this.informationDialogTitle = "编辑站点";
      this.informationDialogShow = true;
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

      this.$message({
        showClose: true,
        message: '如需删除站点信息请到调度系统中删除，该系统暂未开放删除站点功能',
        type: "warning",
      });
      return
      
      this.$client.deleteSysPositionInfo(params)
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
        this.customSettingShowList = this.customSettingList;
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
.site-information-management {
  width: 100%;
  height: 100%;
}
</style> -->
