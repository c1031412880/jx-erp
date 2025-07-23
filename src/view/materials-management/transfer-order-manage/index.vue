<template>
  <div class="transfer-order-manage">
    <sub-req
      ref="head"
      @on-add="openAddJobPage"
      @on-ok="onSubmit"
      @is-check="isCheck"
      @delete-select="deleteSelect"
      @on-btn-export="exportFile"
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
      @on-select-change-row="selectedUpkeepPlanList"
    >
      <template slot-scope="scope" slot="relate_num">
        <el-button type="text" @click="openServerInfo(scope.data)">
          {{ scope.data.relate_num }}
        </el-button>
      </template>
      <template slot-scope="scope" slot="state_name">
        <span :style="{'color': setColor(scope.data.state)}">{{scope.data.state_name}}</span>
      </template>
      <template slot-scope="scope" slot="leave_type">
      <span>{{scope.data.leave_type === 'YBCK' ? '一般出库' : scope.data.leave_type === 'WXCK' ? '维修出库'
        : scope.data.leave_type === 'DBCK' ? '调拨出库' : scope.data.leave_type === 'PKCK' ? '盘亏出库'
          : scope.data.leave_type === 'HCCK' ? '红冲出库' : ''}}</span>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini"  v-if="$isPowerShow('details')" @click="editRowInfo(scope.data,'detail')">查看</el-button>
        <el-button type="text" size="mini" v-if="scope.data.state!=2&&$isPowerShow('edit')"  @click="editRowInfo(scope.data,'edit')">编辑</el-button>
        <el-button type="text" size="mini" v-if="$isPowerShow('add')" @click="copyRowInfo(scope.data)">复制</el-button>
        <el-button type="text" size="mini" v-if="scope.data.state != 2" @click="showCheckStatus(scope.data,'2')">审核</el-button>
        <el-button type="text" size="mini" v-if="scope.data.state == 2" @click="showCheckStatus(scope.data,'3')">反审核</el-button>
        <el-popconfirm
          v-if="$isPowerShow('del') && scope.data.state!=2"
          @confirm="deleteRowInfo(scope.data)"
          title="确定删除此条记录吗？">
          <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;" >删除</el-button>
        </el-popconfirm>
        <!-- <el-button type="text" size="mini" @click="printRowInfo(scope.data)" v-if="$isPowerShow('print')">打印</el-button> -->
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
      @save-audit-add-edit="saveAuditAddEdit"
      @on-audit="setAudit"
    ></information-dialog>
    <drawer-dialog
      :drawer.sync="drawerdialogVisible"
      @on-ok="onSubmit"
    ></drawer-dialog>
    <!-- 表格自定义组件 -->
    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
    <el-dialog
      width="360px"
      title="选泽打印模板"
      :visible.sync="printShow">
      <el-form ref="printForm" size="mini" :model="printForm" :rules="printRules" label-suffix=":">
        <el-form-item label="打印模板" prop="print_name">
          <el-select v-model="printForm.print_name" placeholder="请选择打印模板">
            <el-option
              v-for="item in printList"
              :key="item.file_name"
              :label="item.temp_name"
              :value="item.file_name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="selectPrintForm">确 定</el-button>
      </span>
    </el-dialog>
    <add-staff-dialog
      ref="addStaffDialog"
      :dialogBool.sync="addStaffDialogShow"
      :showCollapse="showCollapse"
      :curChangeType="curChangeType"
    ></add-staff-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
import drawerDialog from "./component/drawer-dialog";
import addStaffDialog from '../../maintenance-management/workorder-management/component/dialog/add-staff-dialog.vue'
export default {
  name: "transfer-order-manage",
  components: {
    subReq,
    informationDialog,
    drawerDialog,
    addStaffDialog
  },
  data() {
    return {
      customSettingVialogVisible: false,
      headerLoading: false,
      addStaffDialogShow: false,
      showCollapse: 'first',
      curChangeType: 'detail', //add添加  edit编辑  detail详情
      titlesId:'', //当前表头的id
      menu_code:'',
      pageInfo: {
        pageIndex: 1,
        pageSize: 50,
        pageCount: 0,
      },
      tyreFail:[],
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      customSettingList: [
        {
          id: 1,
          label: "调拨单号",
          prop: "trans_num",
          width: "150",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "审核状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "调拨日期",
          prop: "trans_date_string",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "物料编码",
          prop: "material_code",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "物料名称",
          prop: "material_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "规格型号",
          prop: "specification",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "调出数量",
          prop: "count",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "调出仓库",
          prop: "before_house_name",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "调出仓位",
          prop: "before_position_name",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "调入仓库",
          prop: "after_house_name",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "调入仓位",
          prop: "after_position_name",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "备注",
          prop: "remark_msg",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "操作人",
          prop: "operator_name",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "审核人",
          prop: "check_name",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "审核时间",
          prop: "check_time_string",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "操作",
          prop: "operation",
          width: "300",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
      ],
      canRendererTableHeader: null,
      customSettingShowList: null,
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      tyreFailIds:[],

      drawerdialogVisible: false,
      // 打印
      print_id: 0,
      printList: [],
      printShow: false,
      printForm: {
        print_name: '',
      },
      printRules: {
        print_name: [
          {
            required: true,
            message: "请选择打印模板",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 更新表头
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
    // 打开工单详情
    openServerInfo(data) {
      let params = {
        work_code: data.relate_num
      }
      params.page_index = 1;
      params.page_size = 1;
      this.$client.getrOrderList(params).then(res => {
        if (res.head.result === "200") {
          let data = res.context.list;
          this.addStaffDialogShow = true
          this.curChangeType = 'detail'
          this.$refs['addStaffDialog'].setData(data[0])
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
      });
    },
    // 打开自定义表格头部弹窗
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetByPageInventoryTrans(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
          }else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
        this.loading = false;
        this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        });
      })
    },
    // 编辑、添加 加审核
    saveAuditAddEdit(form) {
      let successrMessage = "";
      let parmas = {
        context: form
      };
      if (this.curSelecedType == "add") {
        delete parmas.context.main_id;
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }
      this.$client
        .SetRecordInventoryTrans(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            let id = parmas.context.main_id || res.context;
            this.checkStatus({ id},'2')
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
    // 编辑、添加
    saveAddEdit(form) {
      let successrMessage = "";
      let parmas = {
        context: form
      };
      if (this.curSelecedType == "add") {
        delete parmas.context.main_id;
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }
      this.$client
        .SetRecordInventoryTrans(parmas)
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
    // 批量删除
    deleteSelect() {
      if(this.tyreFailIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要删除选项',
          type: "warning",
        });
        return
      }
      this.deleteRowInfo(null);
    },
    // 批量审核
    checkStatusAii(type) {
      this.checkStatus('',type);
    },
    //批量审核
    open1(type){
      if(this.tyreFailIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要审核的选项',
          type: "warning",
        });
        return
      }
      let i = ''
      this.tyreFail.forEach(element => {
        if(element.state==2){
          i++
        }
      });
      if(i > 0) {
        if (type === '2') {
          this.$message({
            showClose: true,
            message: '勾选项中有已审核的选项，无法重新审核',
            type: "warning",
          });
          return
        }
      }
      this.$confirm('审核后，将立刻更新库存，请仔细核对物料明细，确保入库信息无误”。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.checkStatusAii(type)
      })
    },
    // 导出Excel
    exportFile(){
      let params = Object.assign({}, this.form);
      let ids = [ ...this.tyreFailIds ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      this.$client.ExportInventoryTrans(params)
        .then(res => {
          if(res.head.result == '200') {
            window.location.href = res.context
            this.$message({type: 'success', message: '导出成功'})
          }else{
            this.$message({type: 'error', message: '导出失败'})
          }
        })

    },

    // 审核 、取消审核
    isCheck(type) {
      switch (type) {
        case '2':
          this.open1(type)
          break;
        case '3':
          this.open1(type)
          break;
      }
    },
    openAddJobPage() {
      this.curSelecedType = 'add';
      this.informationDialogTitle = "调拨单";
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
    selectedUpkeepPlanList(tyreFailList) {
      this.tyreFailIds = [];
      this.tyreFail = [];
      tyreFailList.forEach((item,index) => {
        this.tyreFailIds.push(item.main_id)
        this.tyreFail.push(item)
      });
      console.log(JSON.stringify(this.tyreFailIds))
    },

    // 编辑
    editRowInfo(form,type) {
      this.$refs.informationDialog.state_name = form.state_name
      this.$client.GetRecordInventoryTrans({id:form.main_id})
        .then(res => {
          if(res.head.result == '200') {
            this.curSelecedType = type;
            if(type == 'edit') {
              this.informationDialogTitle = "编辑调拨单";
            }else{
              this.informationDialogTitle = "查看调拨单";
            }
            this.informationDialogShow = true;
            this.$nextTick(() => {
              this.$refs.informationDialog.setData(res.context)
            })
          }else{
            this.$message({type: 'error', message: '失败'})
          }
        })

    },
    // 复制
    copyRowInfo(form) {
      this.$client.GetRecordInventoryTrans({id:form.main_id})
        .then(res => {
          if(res.head.result == '200') {
            this.curSelecedType = 'add';
            this.informationDialogTitle = "复制调拨单";
            this.informationDialogShow = true;
            this.$nextTick(() => {
              // 复制数据但将主键ID设置为0，表示新增
              let copyData = JSON.parse(JSON.stringify(res.context));
              copyData.main_id = 0;
              // 清空一些不需要复制的字段
              copyData.trans_num = ''; // 清空调拨单号，让系统自动生成
              copyData.state = 1; // 设置为未审核状态
              copyData.state_name = '未审核';
              copyData.check_time = ''; // 清空审核时间
              copyData.check_name = ''; // 清空审核人
              copyData.trans_date_string = ''; // 清空调拨日期字符串
              copyData.check_time_string = ''; // 清空审核时间字符串
              // 清空明细的一些字段
              if (copyData.list && copyData.list.length > 0) {
                copyData.list.forEach(detail => {
                  detail.detail_id = 0; // 明细ID也设置为0
                  detail.main_id = 0; // 主表ID也设置为0
                });
              }
              this.$refs.informationDialog.setData(copyData)
            })
          }else{
            this.$message({type: 'error', message: '获取数据失败'})
          }
        }).catch(err => {
          this.$message({type: 'error', message: '获取数据失败'})
        })
    },
    // 删除
    deleteRowInfo(info) {
      let params = {
        context: []
      };
      if(!!info) {
        params.context[0] = info.main_id
      }else{
        params.context = this.tyreFailIds
      }
      this.$client.DeleteInventoryTrans(params)
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
    // 审核初始化
    showCheckStatus(form,type) {
      this.$refs.informationDialog.state_name = form.state_name
      this.$refs.informationDialog.AuditType = type
      this.$client.GetRecordInventoryTrans({id:form.main_id})
        .then(res => {
          if(res.head.result == '200') {
            this.curSelecedType = 'detail';
            this.informationDialogTitle = "调拨单审批";
            this.informationDialogShow = true;
            this.$nextTick(() => {
              this.$refs.informationDialog.setData(res.context)
            })
          }else{
            this.$message({type: 'error', message: '失败'})
          }
        })
    },
    setAudit(id,type) {
      this.informationDialogShow = false;
      this.checkStatus({ id},type)
    },
    // 审核
    checkStatus(info,type) {
      let params = { context: {}};
      if(!!info) {
        params.context.ids = [info.id]
        params.context.result =type
      }else{
        params.context.ids = this.tyreFailIds
        params.context.result = type
      }
      console.log(params)
      this.$client.GetReviewInventoryTrans(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loadData();
            this.$message({
              showClose: true,
              message: "操作成功",
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
    // 打印调拨单
    printRowInfo(row) {
      this.print_id = row.main_id
      let params = {
        context: {
          object_id: 1780,
          enable: 1
        }
      }
      this.$client.GetByPage(params).then((req) => {
        let data = req.context.list
        if(!data.length) {
          this.$message({
            showClose: true,
            message: '暂无该表单打印模板,请到打印模板管理确认.',
            type: "error",
          });
          return false
        }
        if(data.length > 1) {
          this.printList = JSON.parse(JSON.stringify(data))
          this.printShow = true
        }else {
          let url = window.newHttpConfig.printUrl + '/html/preview?appid=' + window.newHttpConfig.printUrl_appid +'&_u=' + data[0].file_name + '&flow_id=' + row.id
          window.open(url, '_blank')
        }
      }).catch(err => {
        console.log(err);
        this.$message({
          showClose: true,
          message: '服务出错,请联系开发人员.',
          type: "error",
        });
      })
    },
    selectPrintForm() {
      this.$refs.printForm.validate((valid) => {
        if (valid) {
          let url = window.newHttpConfig.printUrl + '/html/preview?appid=' + window.newHttpConfig.printUrl_appid +'&_u=' + this.printForm.print_name + '&flow_id=' + this.print_id
          window.open(url, '_blank')
        } else {
          return false;
        }
      });
    },
    // 打开高级筛选
    openAdvancedFilterPage() {
      this.drawerdialogVisible = true
    },
    setColor(state) {
      switch (state) {
        case 1:
          return 'rgb(255, 153, 0)'
        case 2:
          return '#0CB780'
        case 3:
          return '#999999'
        default:
          return '#999999'
      }
    },
    // 计算表格高度 和初始化表头
    setHead() {
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
.transfer-order-manage {
  width: 100%;
  height: 100%;
}
</style>
