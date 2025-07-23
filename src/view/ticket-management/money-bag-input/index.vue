<template>
  <div class="money-bag-input" ref="moneyBagInput">
    <el-card class="box-card left-box">
      <div
        slot="header"
        class="clearfix show-flex-box-r"
        style="height: 37px; flex-wrap: nowrap; align-items: center"
      >
        <span style="white-space: nowrap">线路选择</span>
      </div>
      <div class="show-flex-box-c" :style="`height: ${treeBoxHeight}px`">
        <line-tree
          ref="lineTree"
          :isShowCheckbox="false"
          :isNodeExpanded="false"
          :placeholder="'请输入关键词'"
          @on-check="selectLineInfo"
          @refresh-tree="refreshTreeList"
        ></line-tree>
      </div>
    </el-card>

    <el-card class="box-card center-box" ref="centerBox">
      <sub-req
        ref="head"
        @on-add="openAddPage"
        @on-ok="onSubmit"
        @is-check="isCheck"
        @delete-select="deleteSelect"
        @on-btn-export="exportFile"
        @on-btn-import="openBtnImportPop"
        @open-setting-page="openSettingPageEvent"
        @on-btn-batch="openBatchAddPage"
      ></sub-req>
      <tr-vxe-table
        ref="trVxeTable"
        :selectionShow="true"
        :footerShow="true"
        :data="data"
        :footerMethod="footerMethod"
        :tableHeaderList="canRendererTableHeader"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading || headerLoading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        @on-select-row="selectedUpkeepPlanList"
      >
        <!-- :isShowSummary="true"
        :sumTotal="sumTotal"
        :sumColumnIndex="sumColumnIndex" -->
        <template slot-scope="scope" slot="lp_num">
          <span :style="`color: ${scope.data.vehicle_id === -1 ? '#D9001B' : ''}`">
            {{ scope.data.vehicle_id === -1 ? '破币' : scope.data.lp_num }}
          </span>
        </template>
        <template slot-scope="scope" slot="state_name">
          <span :style="`color: ${scope.data.state != 2 ? '#D9001B' : ''}`">
            {{ scope.data.state_name }}
          </span>
        </template>
        <template slot-scope="scope" slot="operation" v-if="scope.data.line_name !== '合计'">
          <el-button
            type="text"
            size="mini"
            @click="editRowInfo(scope.data, 'edit')"
            :disabled="scope.data.state === 2"
            v-if="$isPowerShow('edit')"
          >
            编辑
          </el-button>
          <el-button type="text" size="mini" @click="editRowInfo(scope.data, 'detail')">
            查看
          </el-button>
          <el-popconfirm
            @confirm="deleteRowInfo(scope.data)"
            title="确定删除此条记录吗？"
            v-if="$isPowerShow('del')"
          >
            <el-button slot="reference" type="text" size="mini" style="margin-left: 10px">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </tr-vxe-table>

      <!-- <el-pagination
        style="margin: 5px 0; display: flex; justify-content: flex-end"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        ref="paginationH"
        :current-page="pageInfo.pageIndex"
        :page-sizes="[200, 500, 1000, 2000, 5000]"
        :page-size="pageInfo.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="pageInfo.pageCount"
      >
      </el-pagination> -->
    </el-card>

    <div class="money-bag-input-dialog">
      <information-dialog
        ref="informationDialog"
        :dialogBool.sync="informationDialogShow"
        :curSelecedType="curSelecedType"
        :curCanSelectVehicleOptions="curCanSelectVehicleOptions"
        :title="informationDialogTitle"
        @save-add-edit="saveAddEdit"
      ></information-dialog>
      <batch-add-dialog
        ref="batchAddDialog"
        :dialogBool.sync="isShowBatchAddPage"
        @save-batch-add-edit="saveBatchAddEdit"
      ></batch-add-dialog>
      <!-- 上传文件 导出文件弹窗组件 -->
      <file-dialog
        :dialogBool.sync="filedialogVisible"
        :fileData="FileData"
        :typeMessage="'相同日期日钱袋录入记录'"
        @on-submit-excel="importExcel"
      ></file-dialog>
      <custom-setting
        :dialogBool.sync="customSettingVialogVisible"
        :customSettingList="customSettingList"
        :canRendererTableHeader="canRendererTableHeader"
        :customSettingShowList="customSettingShowList"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        :isParentUse="isParentUse"
        @update-table-header="updateTableHeader"
      ></custom-setting>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
import batchAddDialog from "./component/batch-add-dialog";
import lineTree from "./component/line-tree";
import fileDialog from "@/components/fileDialog/file-dialog";
export default {
  name: "money-bag-input",
  components: {
    subReq,
    informationDialog,
    batchAddDialog,
    lineTree,
    fileDialog,
  },
  data() {
    return {
      treeBoxHeight:500,
      pageInfo: {
        pageIndex: 1,
        pageSize: 200,
        pageCount: 0,
      },
      form: {},
      data: [],
      footerMethod: [],
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      customSettingVialogVisible: false,
      curSelecedType: "add",
      informationDialogTitle: "添加",
      drawerdialogVisible: false,
      filedialogVisible: false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/日钱袋录入模板.xlsx`,
      },
      customSettingList: [
        {
          id: 1,
          label: "线路",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "分公司",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "车牌号",
          prop: "lp_num",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "日期",
          prop: "date",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "总计金额",
          prop: "total_fee",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "录入人",
          prop: "created_name",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "录入时间",
          prop: "created_date",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "审核状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "审核人",
          prop: "check_name",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "审核时间",
          prop: "check_time",
          width: "160",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "操作",
          prop: "operation",
          width: "230",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
      ],
      frontFixedNum: 0, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      filedialogVisible: false,
      selectedCountingRecordList:[], //勾选中的记录
      selectedIds: [],
      curCanSelectVehicleOptions:[], //当前组织下或者线路下的车辆
      curNodeType: 1, //选中的当前节点类型
      curLineId:'',
      curDeptId:'',
      sumTotal:{ //约定某一列汇总合计自定义数据
        5: '',
      },
      isShowBatchAddPage: false,
      sumColumnIndex:[5], //要定义的列的索引
      totalColumnProps:['total_fee'],
      titlesId:'', //当前表头的id
      menu_code:'',
      isParentUse: false,
      pageInfoData: null, //当前页面所有数据
      headerLoading: false
    };
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  mounted() {
    // this.loadData();
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      this.setLineTreeFirstLoadSelect();
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
    // 第一次加载 显示总公司下面的现金录入记录
    setLineTreeFirstLoadSelect() {
      setTimeout(() => {
        if(this.$refs.lineTree.data.length > 0){
          this.$refs.lineTree.setCurrentKey([this.$refs.lineTree.data[0].i_id]);
          this.$refs.lineTree.handleNodeClick(this.$refs.lineTree.data[0]);
          return
        }else{
          this.setLineTreeFirstLoadSelect()
        }

      }, 100);
    },
    // 导入信息Excel
    importExcel(val) {
      // alert(JSON.stringify(val))
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      let params = formData;
      // console.log(params)
      this.$client.ImportDayPurse(params).then((res) => {
        if (res.head.result == "200") {
          this.form = {};
          // 重置信息
          // this.pageInfo.pageIndex = 1;
          // this.pageInfo.pageCount = 0;
          this.$refs.head.resetForm();
          this.$refs.head.onSubmit();
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
      });
    },
    // 刷新线路数
    refreshTreeList() {},
    // 选择中的线路
    selectLineInfo(lineInfo) {
      console.log(lineInfo);
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(this.form, key)) {
          delete this.form[key];
        }
      }

      if(lineInfo[0].type == 1) {
        this.$refs.head.resetForm(1);
        this.curDeptId = lineInfo[0].i_id;
        this.form.line_id = '';
        delete this.form.line_id;
        this.$refs.informationDialog.form.line_id = '';
        // this.$refs.informationDialog.$refs.lineTree.onClear();

      }
      if(lineInfo[0].type == 2) {
        this.$refs.head.resetForm(2);
        this.curLineId = lineInfo[0].i_id;
        this.$refs.informationDialog.form.line_id = lineInfo[0].i_id;
        // alert(this.$refs.informationDialog.form.line_id)

      }
      this.reqLineVehicles(lineInfo[0].type);
      // 查询
      this.$refs.head.onSubmit();
      // this.loadData();
    },
    // 获取线路下面的车辆
    reqLineVehicles(type) {
      let params = {
        // 1:点钞页 2：日钱袋页(默认破币虚拟车辆)
        type: 2
      };
      this.curNodeType = type;
      if(type == 1) {
        params.dept_id = this.curDeptId
      }
      if(type == 2) {
        params.line_id = this.curLineId
      }
      this.$client.getVehiclesRecKon(params).then(res => {
        console.log(res)
        if(res.head.result == "200") {
          this.curCanSelectVehicleOptions = res.context
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 查询
    onSubmit(form) {
      // this.form = {};
      this.form = Object.assign({}, form);
      console.log(this.form);
      // this.pageInfo.pageIndex = 1;
      // this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      if(this.curNodeType == 1) {
        params.dept_id = this.curDeptId
      }
      if(this.curNodeType == 2) {
        params.line_id = this.curLineId
      }
      params.page_index = 1;
      params.page_size = 10000;
      this.$client
        .GetByPageDayPurse(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loading = false;
            let list = res.context.list;
            list.forEach(item => {
              if(!item.check_time) {
                item.check_time = undefined
              }
              if(!item.check_name) {
                item.check_name = undefined
              }
            });
            this.data = list;
            this.footerMethod = [{checkbox: '合计', total_fee: res.context.total_total_fee,}]
            this.pageInfo.pageCount = res.context.total;
            this.pageInfoData = res.context;
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
    // 编辑、添加
    saveAddEdit(form,type) {
      let successrMessage = "";
      let parmas = {
        context: form,
      };
      if (this.curSelecedType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }
      this.$client.SetRecordDayPurse(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            if(type == 'save') {
              this.$refs.informationDialog.$refs.lineTree.onClear();
              setTimeout(() => {
                this.informationDialogShow = false;
              },300)
            }
            if(type == 'saveAdd') {
              this.$refs.informationDialog.reastFrom();
            }
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
    // 批量删除
    deleteSelect() {
      if (this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: "请勾选要删除的有效数据",
          type: "warning",
        });
        return;
      }
      this.deleteRowInfo(null);
    },
    // 打开导入文件弹窗
    openBtnImportPop() {
      this.filedialogVisible = true;
    },
    // 导出Excel
    exportFile() {
      let params = Object.assign({}, this.form);
      if(this.curNodeType == 1) {
        params.dept_id = this.curDeptId
      }
      if(this.curNodeType == 2) {
        params.line_id = this.curLineId
      }
      let ids = [ ...this.selectedIds ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      this.$client.ExportDayPurse(params).then((res) => {
        if(res.head) {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        }else{
          this.$message({ type: "warning", message: "暂无可导出内容" });
        }

      });
    },
    // 审核 、取消审核
    isCheck(type) {
      // state 状态（0未审核 1通过 2拒绝/取消审核）
      if(this.selectedCountingRecordList.length == 0) {
        this.$message({
          showClose: true,
          message: "请先勾选表格有效数据",
          type: "warning",
        });
        return
      }
      let isCanGo = true;
      this.selectedCountingRecordList.forEach(item => {
        if(type == 'sure') {
          console.log(item)
          if(item.state === 2) {
            isCanGo = false
          }
        }
        if(type == 'cancle') {
          console.log(item)
          if(item.state === 1 || item.state === 3) {
             isCanGo = false
          }
        }

      })
      switch (type) {
        case "sure":
          if(!isCanGo) {
            this.$message({
              showClose: true,
              message: "只允许勾选未审核和取消审核状态下的记录",
              type: "warning",
            });
            return
          }
          this.goReviewAndCancelRecordRecKon(type)

          break;
        case "cancle":
          if(!isCanGo) {
            this.$message({
              showClose: true,
              message: "只允许勾审核通过状态下的记录",
              type: "warning",
            });
            return
          }
          this.goReviewAndCancelRecordRecKon(type)
          break;
      }
    },
    // 取消审核或者审核
    goReviewAndCancelRecordRecKon(type) {
      let params = {
        context: this.selectedIds
      };
      if(type == 'cancle') {
        this.$client.ReviewCancelRecordDayPurse(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.selectedIds = [];
            this.selectedCountingRecordList = [];
            this.$refs.trVxeTable.handleSelectionChange();
            this.$message({
              showClose: true,
              message: "取消审核成功",
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
          console.log(err);

          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
      }

      if(type == 'sure') {
        this.$client.ReviewRecordDayPurse(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.selectedIds = [];
            this.selectedCountingRecordList = [];
            this.$refs.trVxeTable.handleSelectionChange([]);
            this.$message({
              showClose: true,
              message: "审核成功",
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
          console.log(err);
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
      }

    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    openAddPage(type) {
      this.$refs.informationDialog.form.line_id = this.curLineId;
      this.curSelecedType = type;
      this.informationDialogTitle = "现金录入";
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
    selectedUpkeepPlanList(list) {
      console.log(list);

      this.selectedCountingRecordList = list && list.length ? list.filter(item => item.line_name !== '合计') : [];
      this.selectedIds = [];
      list.forEach(item => {
        if(item.line_name !== '合计') {
          this.selectedIds.push(item.id);
        }
      });
    },
    // 编辑
    editRowInfo(form, type) {
      this.curSelecedType = type;
      let newForm = {...form};
      this.$refs.informationDialog.vehicle_lp_num = newForm.lp_num
      for (const key in this.$refs.informationDialog.form) {
        if (Object.hasOwnProperty.call(newForm, key)) {
          this.$refs.informationDialog.form[key] = newForm[key]
          if (key === 'vehicle_id') {
            this.$refs.informationDialog.form[key] = String(newForm[key])
          }
        }
      }
      if (type == "edit") {
        this.informationDialogTitle = "编辑现金录入";
      } else {
        this.$refs.informationDialog.isShowAllVehicle = true
        this.informationDialogTitle = "现金录入详情";
      }

      this.informationDialogShow = true;
    },
    // 删除
    deleteRowInfo(info) {
      let params = {
        context: [],
      };
      if (!!info) {
        params.context.push(info.id);
      } else {
        params.context = this.selectedIds;
      }
      this.$client.DeleteRecordDayPurse(params)
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
    // 打开批量添加页面
    openBatchAddPage() {
      this.isShowBatchAddPage = true
      setTimeout(() => {
        this.$refs.batchAddDialog.fullSwitch()
      }, 30);
    },
    // 保存批量添加
    saveBatchAddEdit(data){
      this.$client.SaveSimpleDataDayPurse({context: data})
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            // 弹窗不关闭 重新更新弹窗数据
            this.$refs.batchAddDialog.reqLineVehicles();
            this.$message({
              showClose: true,
              message: '批量添加成功',
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
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        this.treeBoxHeight = maxh - 102;
        let th = this.$refs.head.$el.offsetHeight;
        // let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - 40;
        // console.log(maxh,th,this.TableHeight);
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.money-bag-input {
  width: 100%;
  height: 100%;
  display: flex;

  .box-card {
    height: 100%;
    overflow: auto;
  }

  .left-box {
    // flex: 0 0 23vw;
    margin: 0 5px 0 0;
    width: 240px;
    height: 100%;
    /deep/ .el-card__body {
      height: calc(100% - 62px);
    }
  }

  .center-box {
    flex: 1;
    height: 100%;
    /deep/ .el-card__body {
      height: 100%;
    }
  }
}

.department-detail {
}

.department-detail /deep/ .el-input {
  // width: 250px;
}

.money-bag-input /deep/ .el-card__header {
  background-color: #F5F5F5;
  padding: 12px 20px;
}

.superior-department-content {
  margin-bottom: 30px;
}
</style>
