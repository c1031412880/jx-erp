<template>
    <div class="coin-input" ref="coinInput">
      <el-card class="box-card left-box" >
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
        ></sub-req>
        <tr-table
          ref="trTable"
          :selectionShow="true"
          :data="data"
          :tableHeaderList="canRendererTableHeader"
          :isShowBottomOptions="false"
          :isShowSummary="true"
          :TableHeight="TableHeight"
          :loading="loading || headerLoading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          :sumTotal="sumTotal"
          :sumColumnIndex="sumColumnIndex"
          @on-select-change-row="selectedUpkeepPlanList"
          :isFixedEmptyPlaceholder="false"
        >
          <template slot-scope="scope" slot="operation">
            <!-- <el-button type="primary" size="mini" @click="checkStatus(scope.data)"
              >审核</el-button
            > -->
            <el-button
              type="primary"
              size="mini"
              @click="editRowInfo(scope.data, 'edit')"
              :disabled="scope.data.state === 1"
               v-if="$isPowerShow('edit')"
              >编辑</el-button
            >
            <el-button
              type="primary"
              size="mini"
              @click="editRowInfo(scope.data, 'detail')"
              >查看</el-button
            >
            <el-popconfirm
              @confirm="deleteRowInfo(scope.data)"
              title="确定删除此条记录吗？"
              v-if="$isPowerShow('del')"
            >
              <el-button
                slot="reference"
                type="danger"
                size="mini"
                style="margin-left: 10px"
                >删除</el-button
              >
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
      </el-card>
  
      <div class="coin-input-dialog">
        <information-dialog
          ref="informationDialog"
          :dialogBool.sync="informationDialogShow"
          :curSelecedType="curSelecedType"
          :curCanSelectVehicleOptions="curCanSelectVehicleOptions"
          :title="informationDialogTitle"
          @save-add-edit="saveAddEdit"
        ></information-dialog>
        <!-- 上传文件 导出文件弹窗组件 -->
        <file-dialog
          :dialogBool.sync="filedialogVisible"
          :fileData="FileData"
          :typeMessage="'相同日期点钞录入记录'"
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
  import tableData from "./component/table";
  import informationDialog from "./component/information-dialog";
  import lineTree from "./component/line-tree";
  import fileDialog from "@/components/fileDialog/file-dialog";
  export default {
    name: "coin-input",
    components: {
      subReq,
      tableData,
      informationDialog,
      lineTree,
      fileDialog,
    },
    data() {
      return {
        treeBoxHeight:500,
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
        curSelecedType: "add",
        informationDialogTitle: "添加",
        drawerdialogVisible: false,
        filedialogVisible: false,
        FileData: {
          url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/点钞录入模板.xlsx`,
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
            label: "自编号",
            prop: "vehicle_num",
            width: "130",
            align: "center",
            signIndex: 1,
            sortable: true,
          },
          {
            id: 3,
            label: "车牌号",
            prop: "vehicle_lp_num",
            width: "130",
            align: "center",
            signIndex: 2,
            sortable: false,
          },
          {
            id: 4,
            label: "驾驶员",
            prop: "driver_name",
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
            label: "1元硬币金额",
            prop: "one_coins",
            width: "130",
            align: "center",
            signIndex: 5,
            sortable: false,
          },
          {
            id: 7,
            label: "0.5元硬币金额",
            prop: "half_coins",
            width: "130",
            align: "center",
            signIndex: 6,
            sortable: false,
          },
          {
            id: 8,
            label: "0.1元纸币金额",
            prop: "half_notes",
            width: "130",
            align: "center",
            signIndex: 7,
            sortable: false,
          },
          {
            id: 9,
            label: "0.5元纸币金额",
            prop: "half_notes",
            width: "130",
            align: "center",
            signIndex: 8,
            sortable: false,
          },
          {
            id: 10,
            label: "1元纸币金额",
            prop: "one_notes",
            width: "130",
            align: "center",
            signIndex: 9,
            sortable: false,
          },
          {
            id: 11,
            label: "5元纸币金额",
            prop: "five",
            width: "180",
            align: "center",
            signIndex: 10,
            sortable: false,
          },
          {
            id: 12,
            label: "10元纸币金额",
            prop: "five",
            width: "180",
            align: "center",
            signIndex: 11,
            sortable: false,
          },
          {
            id: 13,
            label: "20元纸币金额",
            prop: "five",
            width: "180",
            align: "center",
            signIndex: 12,
            sortable: false,
          },
          {
            id: 14,
            label: "50元纸币金额",
            prop: "five",
            width: "180",
            align: "center",
            signIndex: 13,
            sortable: false,
          },
          {
            id: 15,
            label: "100元纸币金额",
            prop: "five",
            width: "180",
            align: "center",
            signIndex: 14,
            sortable: false,
          },
          {
            id: 16,
            label: "总计金额",
            prop: "total",
            width: "130",
            align: "center",
            signIndex: 15,
            sortable: false,
          },
          {
            id: 17,
            label: "备注",
            prop: "remark",
            width: "130",
            align: "center",
            signIndex: 16,
            sortable: false,
          },
          {
            id: 18,
            label: "录入人",
            prop: "created_name",
            width: "130",
            align: "center",
            signIndex: 17,
            sortable: false,
          },
          {
            id: 19,
            label: "录入时间",
            prop: "created_date",
            width: "130",
            align: "center",
            signIndex: 18,
            sortable: true,
          },
          {
            id: 20,
            label: "审核状态",
            prop: "state_name",
            width: "130",
            align: "center",
            signIndex: 19,
            sortable: false,
          },
          {
            id: 21,
            label: "审核人",
            prop: "check_name",
            width: "130",
            align: "center",
            signIndex: 20,
            sortable: false,
          },
          {
            id: 22,
            label: "审核时间",
            prop: "check_time",
            width: "130",
            align: "center",
            signIndex: 21,
            sortable: true,
          },
          {
            id: 23,
            label: "操作",
            prop: "operation",
            width: "230",
            align: "center",
            signIndex: 22,
            sortable: false,
          },
        ],
        frontFixedNum: 0, //前几行固定
        backFixedNum: 0, //后几行固定
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
          6:'',
          7: '',
          8: '',
          9: '',
          10: '',
          11: '',
          12: '',
        },
        sumColumnIndex:[6,7,8,9,10,11,12], //要定义的列的索引
        totalColumnProps:['half_coins','one_coins','half_notes','one_notes','five','fraction','total'],
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
          this.canRendererTableHeader = null;
          this.customSettingShowList = null;
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
          this.bulidSumColumnTotalInfo();
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
      // 构建和合计的自动计算
      bulidSumColumnTotalInfo() {
        this.sumColumnIndex = [];
        this.sumTotal = {};
        if(!!this.canRendererTableHeader && this.canRendererTableHeader.length > 0) {
          this.canRendererTableHeader.forEach(element => {
            this.totalColumnProps.forEach(item => {
              if(element.prop == item) {
                this.sumTotal[element.signIndex+1] = ''
                this.sumColumnIndex.push(element.signIndex+1)
              }
            });
          });
        }
        this.bulidTotalData()
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
        this.$client.importRecKon(params).then((res) => {
          if (res.head.result == "200") {
            this.form = {};
            // 重置信息
            this.pageInfo.pageIndex = 1;
            this.pageInfo.pageCount = 0;
            this.$refs.head.resetForm();
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
  
            // this.$message({ message: res.head.describle, type: "error" });
          }
        });
      },
      // 选择中的线路
      selectLineInfo(lineInfo) {
        console.log("type",lineInfo[0].type,"info",lineInfo,"form",this.form);
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
        let params = {};
        this.curNodeType = type;
        if(type == 1) {
          params.dept_id = this.curDeptId
        }
        if(type == 2) {
          params.line_id = this.curLineId
        }
        this.$client.getVehiclesRecKon(params).then(res => {
          console.log("res",res)
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
        this.pageInfo.pageIndex = 1;
        this.pageInfo.pageCount = 0;
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
        params.page_index = this.pageInfo.pageIndex;
        params.page_size = this.pageInfo.pageSize;
        this.$client
          .getByPageRecKon(params)
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
              this.pageInfo.pageCount = res.context.total;
              
              this.pageInfoData = res.context;
              this.bulidTotalData();
              // this.sumTotal = {
              //   6 : res.context.total_half_coin,
              //   7 : res.context.total_one_coin,
              //   8 : res.context.total_half_notes,
              //   9 : res.context.total_one_notes,
              //   10 : res.context.total_five,
              //   11 : res.context.total_fraction,
              //   12 : res.context.total_cash,
              // }
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
      //构建底部合计展示数据 
      bulidTotalData() {
        if(this.sumColumnIndex.length > 0 && !!this.pageInfoData) {
          this.sumColumnIndex.forEach(item => {
            this.canRendererTableHeader.forEach(element =>{
              if(item == element.signIndex+1) {
                switch (element.prop) {
                  case 'half_coins':
                    this.sumTotal[item] = this.pageInfoData.total_half_coin
                    break;
                  case 'one_coins':
                    this.sumTotal[item] = this.pageInfoData.total_one_coin
                    break;
                  case 'half_notes':
                    this.sumTotal[item] = this.pageInfoData.total_half_notes
                    break;
                  case 'one_notes':
                    this.sumTotal[item] = this.pageInfoData.total_one_notes
                    break;
                  case 'five':
                    this.sumTotal[item] = this.pageInfoData.total_five
                    break;
                  case 'fraction':
                    this.sumTotal[item] = this.pageInfoData.total_fraction
                    break;
                  case 'total':
                    this.sumTotal[item] = this.pageInfoData.total_cash
                    break;
                }
              }
            })
          })
        }
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
        this.$client.setRecordRecKon(parmas)
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
            message: "请勾选要删除的选项",
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
        this.$client.exportRecKon(params).then((res) => {
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
            message: "请先勾选表格记录",
            type: "warning",
          });
          return
        }
        let isCanGo = true;
        this.selectedCountingRecordList.forEach(item => {
          if(type == 'sure') {
            console.log(item)
            if(item.state === 1) {
              isCanGo = false
            }
          }
          if(type == 'cancle') {
            console.log(item)
            if(item.state === 0 || item.state === 2) {
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
          this.$client.reviewCancelRecordRecKon(params)
          .then((res) => {
            if (res.head.result == "200") {
              this.loadData();
              this.selectedIds = [];
              this.selectedCountingRecordList = [];
              this.$refs.trTable.handleSelectionChange([]);
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
            this.$message({
              showClose: true,
              message: err.body.message,
              type: "error",
            });
          });
        }
  
        if(type == 'sure') {
          this.$client.reviewRecordRecKon(params)
          .then((res) => {
            if (res.head.result == "200") {
              this.loadData();
              this.selectedIds = [];
              this.selectedCountingRecordList = [];
              this.$refs.trTable.handleSelectionChange([]);
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
        this.informationDialogTitle = "投币录入";
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
        this.selectedCountingRecordList = list;
        this.selectedIds = [];
        list.forEach(item => {
          this.selectedIds.push(item.id);
        });
        console.log(JSON.stringify(this.selectedIds));
      },
  
      // 编辑
      editRowInfo(form, type) {
        // console.log(form);
        // return
        // this.curCanSelectVehicleOptions.forEach(item => {
        //   if(item.vehicle_id_erp != form.vehicle_id) {
        //     let obj = {
        //       lp_num: `${form.vehicle_lp_num}(非此线路下车辆)`,
        //       vehicle_id_erp: form.vehicle_id
        //     }
        //     this.curCanSelectVehicleOptions.push(obj)
        //   }
        // });
        this.curSelecedType = type;
        let newForm = {...form};
        this.$refs.informationDialog.vehicle_lp_num = newForm.vehicle_lp_num
        this.$refs.informationDialog.allMoneynumber = newForm.total || 0;
        setTimeout(() => {
          for (const key in this.$refs.informationDialog.form) {
            if (Object.hasOwnProperty.call(newForm, key)) {
              this.$refs.informationDialog.form[key] = newForm[key]
            }
          }
          // this.$refs.informationDialog.vehicle_lp_num = newForm.vehicle_lp_num
        },100)
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
        this.$client.deleteRecordRecKon(params)
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
      // 审核
      checkStatus(form) {},
      // 计算表格高度 和初始化表头
      setHead(type) {
        this.treeBoxHeight = this.$refs.coinInput.offsetHeight - 110;
        if(type == 'initialize') {
          this.canRendererTableHeader = this.customSettingList;
        }
        setTimeout(() => {
          let maxh = this.$el.offsetHeight;
          let th = this.$refs.head.$el.offsetHeight;
          let paginationH = this.$refs.paginationH.$el.offsetHeight;
          this.TableHeight = maxh - th - paginationH - 53;
        }, 60);
      },
    },
  };
  </script>
  
  <style lang="stylus" rel="stylesheet/stylus" scoped>
  .coin-input {
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
    }
  
    .center-box {
      flex: 1;
      height: 100%;
    }
  }
  
  .department-detail {
  }
  
  .department-detail /deep/ .el-input {
    // width: 250px;
  }
  
  .coin-input /deep/ .el-card__header {
    background-color: #F5F5F5;
    padding: 12px 20px;
  }
  
  .superior-department-content {
    margin-bottom: 30px;
  }
  </style>
  