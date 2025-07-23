<template>
  <vehicle-model-management-data-center vehicleArchivesName="vehinfo-manage" />
</template>
<script type="text/ecmascript-6">
export default {
  name: "vehmodel-manage",
}
</script>
<!--
<template>
  <div class="basic-material-information">
    <sub-req
      ref="head"
      @on-add="openAddVemodelPage"
      @on-ok="onSubmit"
      @open-settingpage-event="openSettingPageEvent"
    ></sub-req>

    <tr-table
      ref="table"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading || headerLoading"
      @on-select-change-row="selectedCurList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    >
      <template slot-scope="scope" slot="car_num">
        <el-button type="text" size="mini" @click="jumpVehInfoPage(scope.data)">{{scope.data.car_num}}</el-button>
      </template>
      <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" @click="tableSetShow(scope.data)" v-if="$isPowerShow('edit')">编辑</el-button>
          <el-popconfirm
            @confirm="tableDel(scope.data)"
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
      :typeMessage="'同名车辆类型'"
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

    <drawer-dialog
      :drawer.sync="drawerdialogVisible"
      @on-ok="onSubmit"
    ></drawer-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import tableData from "./component/table";
import informationDialog from "./component/information-dialog";
import drawerDialog from "./component/drawer-dialog";
import fileDialog from "@/components/fileDialog/file-dialog.vue";
export default {
  name: "vehmodel-manage",
  components: {
    subReq,
    tableData,
    informationDialog,
    drawerDialog,
    fileDialog,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      filedialogVisible: false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/wwwroot/excel/model/车型信息.xls`,
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      customSettingVialogVisible: false,
      curSelecedType: "",
      informationDialogTitle: "添加车型信息",
      drawerdialogVisible: false,
      curVehModelList: [], //当前勾选中车辆信息
      customSettingList: [
        {
          id: 1,
          label: "车辆型号",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "车辆数量",
          prop: "car_num",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "车辆类型",
          prop: "kind_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "生产厂家",
          prop: "factory",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "座位数",
          prop: "seats_num",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "核载数",
          prop: "permit_num",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "排量（ML）",
          prop: "displacement",
          width: "140",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "排放标准",
          prop: "standard_name",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "车辆长度（mm）",
          prop: "length",
          width: "170",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "车身颜色",
          prop: "color",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "燃料类别",
          prop: "fuel_name",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "前轮距（mm）",
          prop: "wheel_space",
          width: "180",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
        {
          id: 13,
          label: "后轮距（mm）",
          prop: "rear_track",
          width: "180",
          align: "center",
          signIndex: 12,
          sortable: true,
        },
        {
          id: 14,
          label: "车型价格（元）",
          prop: "price",
          width: "180",
          align: "center",
          signIndex: 13,
          sortable: true,
        },
        {
          id: 15,
          label: "操作",
          prop: "operation",
          width: "180",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
      ],
      frontFixedNum: 2, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      titlesId:'', //当前表头的id
      menu_code:'',
      headerLoading: false
    };
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize')
      this.loadData();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
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

    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let content = this.form;
      content.page_index = this.pageInfo.pageIndex;
      content.page_size = this.pageInfo.pageSize;
      this.$client.GetCarModelVehicleManager(content).then(req => {
        if (req.head.result === "200") {
          this.loading = false;
          this.data = req.context.list;
          this.pageInfo.pageCount = req.context.total;
        } else {
          this.loading = false;
          this.data = [];
          this.pageInfo.pageCount = 0;
          this.$message({
            showClose: true,
            message: req.head.describle,
            type: "error",
          });
        }
      })
    },
    // 编辑初始化
    tableSetShow(form) {
      // console.log(form);
      this.curSelecedType = "edit";
      for (const key in this.$refs.informationDialog.form) {
        if (Object.hasOwnProperty.call(form, key)) {
          this.$refs.informationDialog.form[key] = form[key]
        }
      }
      this.informationDialogTitle = "车型信息维护";
      this.informationDialogShow = true;
    },
    // 添加、编辑
    saveAddEdit(form) {
      let successrMessage = "";
      let parmas = {
        context: form
      };
      if (this.curSelecedType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
        this.$client
          .SetCarModelVehicleManager(parmas)
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
      } else {
        successrMessage = "编辑成功";
        this.$client
          .UpdateCarModelVehicleManager(parmas)
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
      }
    },
    // 数据删除
    tableDel(info) {
      let params = {
        context: []
      };
      if(!!info) {
        params.context.push(info.id)
      }
      this.$client.deleteCarModelVehicleManager(params)
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
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    openAddVemodelPage(type) {
      this.curSelecedType = type;
      switch (type) {
        case "add":
          this.informationDialogTitle = "添加车型信息";
          this.informationDialogShow = true;
          break;
        case "edit":
          this.informationDialogTitle = "车型信息维护";
          this.informationDialogShow = true;
          break;
        case "import":
          // this.informationDialogTitle = '车辆信息维护'
          this.filedialogVisible = true;
          break;
        case "export":
          this.exportExcel();
          break;
        case "AdvancedSet":
          this.openAdvancedFilterPage();
          break;
      }
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData();
      // this.tabledata = this.tabledataAll.slice((idx-1)*this.pageInfo.pageSize,idx*this.pageInfo.pageSize)
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 打开高级筛选弹窗
    openAdvancedFilterPage() {
      this.drawerdialogVisible = true;
    },

    onSubmitExcel(exportInfo) {
      let formData = new FormData();
      formData.append("file", exportInfo.file);
      formData.append("type", exportInfo.radio);

      let params = formData;
      // console.log(params)
      this.$client.ImportCardModelVehicleManager(params)
      .then(res => {
        if(res.head.result == "200") {
          this.form = {};
          this.pageInfo.pageIndex = 1;
          this.pageInfo.pageCount = 0;
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
    // 导出车型数据
    exportExcel() {
      let params = Object.assign({}, this.form);
      let ids = []
      this.curVehModelList.forEach(item => {
        ids.push(item.id)
      })
      if (ids.length) {
        params.ids = ids.toString()
      }
      this.$client.ExportCarModelVehicleManager(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 跳转车辆信息页面
    jumpVehInfoPage(info){
      this.$router.push({
        name:'vehinfo-manage',
        params:{
          vehmodelId: info.id
        }
      })
    },
    // 勾选中当前的车辆信息
    selectedCurList(val) {
      console.log(val)
      this.curVehModelList = val;
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.basic-material-information {
  width: 100%;
  height: 100%;
}
</style>

-->
