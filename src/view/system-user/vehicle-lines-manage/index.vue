
<template>
  <vehicle-lines-manage-data-center/>
</template>
<script type="text/ecmascript-6">
  export default {
    name: "vehicle-lines-manage",
  }
</script>
<!--
<template>
  <div class="vehicle-lines-manage">
    <sub-req
      ref="head"
      @on-add="openAddVemodelPage"
      @on-ok="onSubmit"
    ></sub-req>
    <tr-table
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectedVehLinesList"
    >
      <!-- <template slot-scope="scope" slot="confirm_state">
        <span>{{!!scope.data.confirm_state? '未确认':'已确认'}}</span>
      </template>
      <template slot-scope="scope" slot="type">
        <span>{{scope.data.type == 1? '城市线路':scope.data.type == 2?'城乡线路':'--'}}</span>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="primary" size="mini" @click="editRowInfo(scope.data)" v-if="$isPowerShow('edit')">编辑</el-button>
        <el-popconfirm
          @confirm="stopRowInfo(scope.data)"
          title="确定停用此条线路吗？"
          v-if="$isPowerShow('del')">
          <el-button slot="reference" style="width: 70px;" :type="!!scope.data.usable?'danger':'info'" size="mini" :disabled="!scope.data.usable">{{!!scope.data.usable?'停用':'已停用'}}</el-button>
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
      :typeMessage="'同名线路'"
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
import informationDialog from "./component/information-dialog";
import drawerDialog from "./component/drawer-dialog";
import fileDialog from "@/components/fileDialog/file-dialog.vue";

export default {
  name: "vehicle-lines-manage",
  components: {
    subReq,
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
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/线路记录模板.xlsx`,
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
          label: "线路编号",
          prop: "area",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "线路名称",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "线路归属",
          prop: "type",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "上行里程(km)",
          prop: "onmiles",
          width: "150",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "下行里程(km)",
          prop: "downmiles",
          width: "150",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "上行时长(分)",
          prop: "time_up",
          width: "150",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "下行时长(分)",
          prop: "time_down",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "上行站点数",
          prop: "count_up",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "下行站点数",
          prop: "count_down",
          width: "150",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "关联车辆数",
          prop: "count_car",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "上行起点站",
          prop: "first_station_up",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "上行终点站",
          prop: "end_station_up",
          width: "150",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "下行起点站",
          prop: "first_station_down",
          width: "150",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "下行终点站",
          prop: "end_station_down",
          width: "150",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "上行首班时间",
          prop: "first_time_up",
          width: "150",
          align: "center",
          signIndex: 15,
          sortable: true,
        },
        {
          id: 17,
          label: "上行末班时间",
          prop: "end_time_up",
          width: "150",
          align: "center",
          signIndex: 16,
          sortable: true,
        },
        {
          id: 18,
          label: "下行首班时间",
          prop: "first_time_down",
          width: "150",
          align: "center",
          signIndex: 17,
          sortable: true,
        },
        {
          id: 19,
          label: "下行末班时间",
          prop: "end_time_down",
          width: "150",
          align: "center",
          signIndex: 18,
          sortable: true,
        },
        {
          id: 20,
          label: "票价",
          prop: "price",
          width: "150",
          align: "center",
          signIndex: 19,
          sortable: true,
        },
        {
          id: 21,
          label: "早发标准",
          prop: "early_start",
          width: "150",
          align: "center",
          signIndex: 20,
          sortable: true,
        },
        {
          id: 22,
          label: "晚发标准",
          prop: "late_start",
          width: "150",
          align: "center",
          signIndex: 21,
          sortable: true,
        },
        {
          id: 23,
          label: "操作",
          prop: "operation",
          width: "180",
          align: "center",
          signIndex: 22,
          sortable: false,
        },
      ],
      frontFixedNum: 2, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      filedialogVisible: false,
      linesIds:[],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData();
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
    },

    onSubmit(form) {
      this.form = form;
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
      this.$client.getLineManage(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
          } else {
            this.loading = false;
            this.data = [];
            this.pageInfo.pageCount = 0;
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
    // 编辑初始化
    editRowInfo(form) {
      console.log(form);
      this.informationDialogShow = true;
      this.curSelecedType = "edit";
      this.$refs.informationDialog.form.id = form.id;
      // alert(this.$refs.informationDialog.form.id)
      setTimeout(() => {
        for (const key in this.$refs.informationDialog.form) {
          if (Object.hasOwnProperty.call(form, key)) {
            this.$refs.informationDialog.form[key] = form[key];
          }
        }
        this.$refs.informationDialog.form.type = String(form.type);
        this.$refs.informationDialog.department_id = form.group; // 回显组织树
      }, 200);
      // this.$refs.informationDialog.form.name = form.name;
      // this.$refs.informationDialog.form.area = form.area;
      // this.$refs.informationDialog.form.orgs = form.orgs;
      // this.$refs.informationDialog.form.type = String(form.type);
      // this.$refs.informationDialog.form.onmiles = form.onmiles;
      // this.$refs.informationDialog.form.downmiles = form.downmiles;
      // this.$refs.informationDialog.form.time_up = form.time_up;
      // this.$refs.informationDialog.form.time_down = form.time_down;
      // this.$refs.informationDialog.form.first_time_up = form.first_time_up;
      // this.$refs.informationDialog.form.end_time_up = form.end_time_up;
      // this.$refs.informationDialog.form.first_time_down = form.first_time_down;
      // this.$refs.informationDialog.form.end_time_down = form.end_time_down;
      // this.$refs.informationDialog.form.price = form.price;
      // this.$refs.informationDialog.form.early_start = form.early_start;
      // this.$refs.informationDialog.form.late_start = form.late_start;
      if(!!form.vehicles && form.vehicles.length > 0) {
        this.$refs.informationDialog.data = [...form.vehicles]; //车辆信息
        setTimeout(() => {
          this.$refs.informationDialog.vehiclesEcho([...form.vehicles]) 
        }, 60);
      }
      // 获取本线路下的所有站点信息
      this.$refs.informationDialog.reqLineStations(form.id)
      
      this.informationDialogTitle = "编辑线路信息";
      this.informationDialogShow = true;
    },
    // 勾选线路列表
    selectedVehLinesList(linesList) {
      this.linesIds = [];
      linesList.forEach((item,index) => {
        this.linesIds.push(item.id)
      });
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
        .addLineInfo(parmas)
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
    restTableList() {
      this.form = {};
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = 20;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    openAddVemodelPage(type) {
      this.curSelecedType = type;
      switch (type) {
        case "add":
          this.informationDialogTitle = "添加线路信息";
          this.informationDialogShow = true;
          break;
        case "edit":
          this.informationDialogTitle = "编辑线路信息";
          this.informationDialogShow = true;
          break;
        case "import":
          this.filedialogVisible = true;
          break;
        case "export":
          this.exportExcel();
          break;
        case "stop": //停用线路
          this.batchStopLineInfo()
          break;
        case "delete": //删除线路
          this.deleteLineInfo()
      }
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
    // 导入
    onSubmitExcel(val) {
        let formData = new FormData();
        formData.append("file", val.file);
        formData.append("type", val.radio);
        let params = formData;
        this.$client.importLineInfo(params)
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

    exportExcel() {
      let params = Object.assign({}, this.form);
      let ids = [ ...this.linesIds ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      this.$client.exportLineInfo(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 批量删除
    deleteLineInfo() {
      if(this.linesIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要删除的线路',
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
        params.context = this.linesIds
      }
      this.$client.deleteLineInfo(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loadData();
          this.linesIds = [];
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success",
          });
        } else {
          this.linesIds = [];
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
    // 批量停用
    batchStopLineInfo() {
      if(this.linesIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要停用的线路',
          type: "warning",
        });
        return
      }
      this.stopRowInfo(null);
    },
    stopRowInfo(info) {
      let params = {
        context: []
      };
      if(!!info) {
        params.context[0] = info.id
      }else{
        params.context = this.linesIds
      }
      this.$client.stopLineInfo(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loadData();
          this.linesIds = [];
          this.$message({
            showClose: true,
            message: "停用成功",
            type: "success",
          });
        } else {
          this.linesIds = [];
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
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.vehicle-lines-manage {
  width: 100%;
  height: 100%;
}
</style>
 -->