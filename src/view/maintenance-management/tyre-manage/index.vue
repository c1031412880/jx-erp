<template>
  <div class="pressure-vessel-manage">
    <div class="pressure-vessel-manage-content">
      <sub-req
        ref="head"
        @on-add="addInfo"
        @on-ok="onSubmit"
        @on-export="exportFile"
        @on-screen="onScreen"
        @on-delete="onDelete"
        @on-import="openFiledialog"
      ></sub-req>

      <tr-table
        ref="table"
        :selectionShow="true"
        :data="pressureVesselData"
        :tableHeaderList="canRendererTableHeader"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        @on-select-change-row="selectedList"
      >
        <template slot-scope="scope" slot="brand">
          <span v-if="scope.data.tyre_mode == null" ></span>
          <span v-else>{{scope.data.tyre_mode.brand}}</span>
        </template>
        <template slot-scope="scope" slot="firm">
          <span v-if="scope.data.tyre_mode == null" ></span>
          <span v-else>{{scope.data.tyre_mode.firm}}</span>
        </template>
        <template slot-scope="scope" slot="name">
            <span v-if="scope.data.tyre_mode == null" ></span>
            <span v-else>{{scope.data.tyre_mode.name}}</span>
        </template>
        <!-- <template slot-scope="scope" slot="department_name">
          <span>{{scope.data.tyre_vehicle_info ? scope.data.tyre_vehicle_info.dept_name : ''}}</span>
        </template> -->

        <template slot-scope="scope" slot="vehicle_code">
           <el-button type="text" size="mini" @click="jumpVehInfoPage(scope.data)">{{scope.data.vehicle_code}}</el-button>
        </template>
        <template slot-scope="scope" slot="state_name">
          <el-link :type="showStateColor(scope.data)" :underline="false">{{scope.data.state_name?scope.data.state_name:''}}</el-link>
        </template>

        <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" @click="editInfo(scope.data,'edit')" v-if="$isPowerShow('edit')" :disabled="scope.data.state == 3">编辑</el-button>
          <el-button type="primary" size="mini" @click="editInfo(scope.data,'detail')">查看</el-button>
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
      ></el-pagination>
    </div>

    <div class="dialog-box">
      <!-- 添加信息 -->
      <add-dialog
        ref="addDialog"
        :dialogBool.sync="addDialogShow"
        :curChangeType="curChangeType"
        @sure-save-info="sureSaveInfo"
        :detailLoading="detailLoading"
        :containerVehicleRecode="containerVehicleRecode"
      ></add-dialog>

      <!-- 高级筛选 -->
     <drawer-dialog ref="drawerDialog" :drawer.sync="isShowDrawerDialog" @on-ok="onSubmit"></drawer-dialog>
      <!-- 表格自定义组件 -->
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
        :typeMessage="'同编号轮胎'"
        @on-submit-excel="onSubmitExcel"
      ></file-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import addDialog from "./component/dialog/add-dialog";
// import scrapDialog from "./component/dialog/scrap-dialog";
import drawerDialog from "./component/dialog/drawer-dialog";
import fileDialog from "@/components/fileDialog/file-dialog.vue";

export default {
  name: "tyre-manage",
  components: {
    subReq,
    addDialog,
    // scrapDialog,
    drawerDialog,
    fileDialog
  },
  data() {
    return {
      curChangeType: "add", //add添加  edit编辑  detail详情
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      state:'',
      formData:{},
      filedialogVisible: false,
      queryform: {}, //查询
      pressureVesselData: [], //列表
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      addDialogShow: false, //添加信息
      isShowDrawerDialog: false, //是否显示高级筛选
      customSettingVialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "轮胎编号",
          prop: "code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: "轮胎规格型号",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: "轮胎品牌",
          prop: "brand",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false
        },
        {
          id: 4,
          label: "轮胎厂牌",
          prop: "firm",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false
        },
        {
          id: 5,
          label: "轮胎类别",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false
        },
        {
          id: 6,
          label: "旧轮胎编号",
          prop: "old_code",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false
        },
        {
          id: 7,
          label: "所属组织",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false
        },
        {
          id: 8,
          label: "单价（元）",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false
        },
        {
          id: 9,
          label: "购买日期",
          prop: "buy_date",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false
        },
        {
          id: 10,
          label: "安装车辆",
          prop: "vehicle_code",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false
        },
        {
          id: 11,
          label: "安装位置",
          prop: "position_name",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false
        },
        {
          id: 12,
          label: "状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false
        },
        {
          id: 13,
          label: "操作",
          prop: "operation",
          width: "220",
          align: "center",
          signIndex: 12,
          sortable: false
        }
      ],
      frontFixedNum: 2, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      iState: "", //轮胎状态 1使用中 2闲置 3已报废 4 修理中
      detailLoading: false,
      containerVehicleRecode: [], //使用历史记录
      containerLifeData: [], //生命周期
      selectedIds: [], //勾选中的ID
      FileData: {
        url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/轮胎记录模板.xlsx",
      },
      filedialogVisible: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      this.loadData();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 跳转车辆信息页面
    jumpVehInfoPage(info){
      this.$router.push({
        name:'vehicle-archives-management',
        params:{
          name: info.vehicle_code
        }
      })
    },
    // 导出Excel
    exportFile() {
      let params = Object.assign({}, this.queryform);
      let ids = [ ...this.selectedIds ]
      if (ids.length) {
        params.ids = ids
      }
      this.$client.ExportTyreManage(params).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    // 打开导入弹窗
    openFiledialog() {
      this.filedialogVisible = true;
    },
    // 导入轮胎记录
    onSubmitExcel(exportInfo) {
      let formData = new FormData();
      formData.append("file", exportInfo.file);
      formData.append("type", exportInfo.radio);

      let params = formData;
      // console.log(params)
      this.$client.ImportTyreManage(params)
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
    // 打开高级筛选弹窗
    onScreen() {
      this.isShowDrawerDialog = true;
    },
    // 批量删除
    onDelete() {
      if (this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: "请勾选至少一条要移除的轮胎",
          type: "warning"
        });
        return;
      }

      let parmas = {
        context: this.selectedIds
      };
      this.$client.deleteTyreManage(parmas).then(res => {
        if (res.head.result == "200") {
          this.selectedIds = [];
          // // 清除勾选
          // this.$refs.table.handleSelectionChange([]);
          this.loadData();
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success"
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success"
          });
        }
      });
    },

    // 添加信息
    addInfo() {
      this.addDialogShow = true;
      this.curChangeType = "add";
      this.$refs["addDialog"].resetData();
    },
    // 更新表格头部
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
    // 打开自定义表格头部弹窗
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // <!-- 1使用中 2闲置 3已报废 4 修理中 -->
    showStateColor(val) {
      let colorType = '';
      switch (val.state) {
        case 1:
          colorType = 'primary'
          break;
        case 2:
          colorType = 'danger'
          break;
        case 3:
          colorType = 'info'
          break;
        case 4:
          colorType = 'warning'
        break;
      }
      return colorType
      },
    // 表格上点击编辑时
    editInfo(val, type) {
      console.log(val,type,'数据')
      this.iState = val.state;
      this.addDialogShow = true;
      this.curChangeType = type;
      this.detailLoading = true;
      this.$refs["addDialog"].setData(val);
      let params = {
        tyre_id: val.id
      };
      this.$client.getTyreVehicleTyreManage(params).then(res => {
        if (res.head.result == "200") {
           this.containerVehicleRecode = res.context.list;
          this.detailLoading = false;
        } else {
          this.$message({ type: "error", message: res.head.describle });
        }
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
    // 查询
    onSubmit(form) {
      // this.queryform = {};
      this.queryform = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 加载数据
    loadData() {
      this.loading = true;
      let params = {};
      params = Object.assign({}, this.queryform);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getByPageTyreManage(params).then(res => {
        if (res.head.result == "200") {
          this.pressureVesselData = res.context.list;
          this.pageInfo.pageCount = res.context.total;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
        this.loading = false;
      });
    },
    // 编辑、保存信息
    sureSaveInfo(context) {
      if (Object.hasOwnProperty.call(context, "tyre_vehicle")) {
        if (
          context.tyre_vehicle.type == 1 ||
          context.tyre_vehicle.type == 3
        ) {
          if (
            !Object.hasOwnProperty.call(
              context.tyre_vehicle,
              "install_date"
            )
          ) {
            delete context.tyre_vehicle;
          }
        }
      }
      if (Object.hasOwnProperty.call(context, "tyre_vehicle")) {
        if (context.tyre_vehicle && context.tyre_vehicle.type == 2) {
          if (
            !Object.hasOwnProperty.call(
              context.tyre_vehicle,
              "dismantle_date"
            )
          ) {
            delete context.tyre_vehicle;
          }
        }
      }
      let params = {
        context: context
      };
      this.$client.addTyreManage(params).then(res => {
        if (res.head.result == "200") {
          // this.form = {};
          if (this.curChangeType == "add") {
            this.queryform = {};
            this.pageInfo.pageCount = 0;
            this.pageInfo.pageIndex = 1;
          }
          this.loadData();
          this.addDialogShow = false;
          this.$message({
            showClose: true,
            type: "success",
            message: "保存成功"
          });
        } else {
          this.$message({
            showClose: true,
            type: "error",
            message: res.head.describle
          });
        }
      });
    },
    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      if (list && list.length > 0) {
        list.forEach((item, index) => {
          this.selectedIds.push(item.id);
        });
      }
      console.log(this.selectedIds);
    },
    // 计算表格高度
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
        this.customSettingShowList = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
        console.log(this.TableHeight);
      }, 60);
    }
  },
  watch: {
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.pressure-vessel-manage {
  width: 100%;
  height: 100%;
}
</style>
