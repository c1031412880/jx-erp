<template>
  <div class="vehicle-gas-entry">
    <sub-req
      ref="head"
      @on-add="openAddPage"
      @on-batch="openBatchPage"
      @on-ok="onSubmit"
      @on-delete-batch="batchDelete"
      @on-export="exportExcel"
      @on-import="openImportPage"
      paneType="entry"
    ></sub-req>

    <tr-table
      ref="table"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :isShowSummary="true"
      @on-select-change-row="selectedTableList"
      :sumTotal="sumTotal"
      :sumColumnIndex="sumColumnIndex"
    >
      <template slot-scope="scope" slot="operation">
        <el-button
          type="primary"
          size="mini"
          @click="editRowInfo(scope.data, 'detail')"
          v-if="$isPowerShow('edit')"
          >查看</el-button
        >
        <el-button
          type="primary"
          size="mini"
          @click="editRowInfo(scope.data, 'edit')"
          v-if="$isPowerShow('edit')"
          >编辑</el-button
        >
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
    >
    </el-pagination>

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      @save-add-edit="saveAddEdit"
      @verify-data-exists="verifyDataExists"
    ></information-dialog>

    <batch-dialog
      ref="batchDialog"
      :dialogBool.sync="batchDialogShow"
      @save-add="saveBatch"
    ></batch-dialog>
    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :typeMessage="'相同车牌号的车'"
      @on-submit-excel="onSubmitExcel"
    ></file-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="20%"
      top="35vh"
    >
      <span>当前车辆在该天已经存在录入记录,是否覆盖？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmCoverage()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
  
  <script type="text/ecmascript-6">
import subReq from "./sub-req";
import informationDialog from "./information-dialog";
import fileDialog from "@/components/fileDialog/file-dialog.vue";
import batchDialog from "./batch-dialog";
export default {
  name: "vehicle-gas-entry",
  components: {
    subReq,
    informationDialog,
    batchDialog,
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
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "lincense_plate_number",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "线路",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "车辆类型",
          prop: "vehicle_type",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "车辆型号",
          prop: "vehicle_models",
          width: "150",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "日期",
          prop: "month",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "气耗(kg)",
          prop: "val",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "金额",
          prop: "amount",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "签字司机",
          prop: "sign_driver",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "加气员",
          prop: "addgas_person",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "录入人",
          prop: "created_name",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "录入时间",
          prop: "created_date",
          width: "160",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "操作",
          prop: "operation",
          width: "220",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      selectedIds: [],
      FileData: {
        url:
          window.newHttpConfig.URL_EASYMOCK +
          "/Files/TempFiles/车辆气耗录入模板.xlsx",
      },
      filedialogVisible: false,
      batchDialogShow: false,
      sumColumnIndex: [],
      sumTotal: {},
      isExits: false,
      dialogVisible: false,
      successrMessage: "",
      staging: {},
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead("initialize");
      window.eventOn.$on("view-resize" + this.$route.fullPath, () => {
        this.setHead();
      });
    });
  },
  methods: {
    updateTableHeader(newestTableHeaderList) {
      this.canRendererTableHeader = null;
      this.canRendererTableHeader = newestTableHeaderList;
      this.$forceUpdate();
      this.loadData();
    },
    // 打开导入弹窗
    openImportPage() {
      this.filedialogVisible = true;
    },
    // 导入
    onSubmitExcel(exportInfo) {
      let formData = new FormData();
      formData.append("file", exportInfo.file);
      formData.append("type", exportInfo.radio);
      let params = formData;
      this.$client.ImportVehicleGasRecord(params).then((res) => {
        if (res.head.result == "200") {
          this.loadData();
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
        }
      });
    },
    // 导出Excel 文件
    exportExcel() {
      let params = {
        context: {},
      };
      params.context = Object.assign({}, this.form);
      this.$client.ExportVehicleGasRecord(params).then((res) => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    onSubmit(form) {
      this.form = form;
      this.form.vehicle_ids = form.vehicle_ids.join();
      this.form.line_ids = form.line_ids.join();
      this.form.created_ids = form.created_ids.join();
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
      this.$client
        .ListVehicleGasRecord(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total;
            const index = this.canRendererTableHeader.findIndex(
              (item) => item.label === "气耗(kg)"
            );
            this.sumColumnIndex = [index + 1, index + 2];
            this.sumTotal = {
              [index + 1]: res.context.summary["val_total"],
              [index + 2]: res.context.summary["amount_total"],
            };
            this.$refs.table.configTableHeaderList();
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    confirmCoverage() {
      //将暂存数据提取出来 执行添加覆盖
      let { parmas, type } = this.staging;
      this.saveAddEdit(parmas, type);
      this.dialogVisible = false;
    },
    //校验录入数据是否已经存在
    verifyDataExists(form, type) {
      let parmas = {
        context: form,
      };
      if (this.curSelecedType == "add") {
        delete parmas.context.id;
        this.successrMessage = "添加成功";
        //如果是添加则校验数据是否存在
        this.$client
          .VerifyVehicleGasRecordExist(parmas)
          .then((res) => {
            if (res.head.result == "200") {
              //true说明当天存在该车记录，则弹出确认框
              if (res.context) {
                //参数parmas和type暂存起来
                this.staging = {
                  parmas,
                  type,
                };
                this.dialogVisible = true;
              } else {
                //false说明不存在已有记录 之间添加
                this.saveAddEdit(parmas, type);
              }
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
        this.successrMessage = "编辑成功";
        this.saveAddEdit(parmas, type);
      }
    },
    // 编辑、添加q气耗录入
    saveAddEdit(parmas, type) {
      if (this.curSelecedType == "add"){
        this.successrMessage = "添加成功"
      }else{
        this.successrMessage = "编辑成功"
      }
      this.$client
        .AddOrEditVehicleGasRecord(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            if (type === 1) {
              this.$refs.informationDialog.clear();
              this.$refs.informationDialog.resetData();
            } else {
              this.informationDialogShow = false;
            }
            this.$message({
              showClose: true,
              message: this.successrMessage,
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
    // 批量删除气耗录入
    batchDelete() {
      if (this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: "请勾选要删除的气耗录入记录",
          type: "warning",
        });
        return;
      }
      this.deleteRowInfo(null);
    },
    restTableList() {
      this.loadData();
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    openBatchPage() {
      this.batchDialogShow = true;
    },
    openAddPage() {
      this.curSelecedType = "add";
      this.informationDialogTitle = "气耗录入";
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
    selectedTableList(list) {
      this.selectedIds = [];
      list.forEach((item, index) => {
        this.selectedIds.push(item.id);
      });
    },

    // 编辑
    editRowInfo(form, type) {
      this.curSelecedType = type;
      setTimeout(() => {
        for (const key in this.$refs.informationDialog.form) {
          if (Object.hasOwnProperty.call(form, key)) {
            this.$refs.informationDialog.form[key] = form[key];
          }
        }
      }, 100);
      this.informationDialogTitle = `${
        type == "edit" ? "编辑气耗录入" : "气耗录入详情"
      }`;
      this.informationDialogShow = true;
    },
    // 删除
    deleteRowInfo(info) {
      let params = {
        context: [],
      };
      if (!!info) {
        params.context[0] = info.id;
      } else {
        params.context = this.selectedIds;
      }

      this.$client
        .BatchDeleteVehicleGasRecord(params)
        .then((res) => {
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
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 批量添加
    saveBatch(list) {
      this.$client
        .VehicleGasBatchInsert({ context: list })
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.batchDialogShow = false;
            this.$message({
              showClose: true,
              message: "添加成功",
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
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },

    // 计算表格高度 和初始化表头
    setHead(type) {
      if (type == "initialize") {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th - 35;
      }, 60);
    },
  },
};
</script>
  
  <style lang="stylus" rel="stylesheet/stylus" scoped>
  .vehicle-gas-entry {
    width: 100%;
    height: 100%;
  }
</style>
  