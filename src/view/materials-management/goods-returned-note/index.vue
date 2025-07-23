<template>
  <div class="goods-returned-note">
    <sub-req
      ref="head"
      @on-add="openAddJobPage"
      @on-ok="onSubmit"
      @on-check="isCheckData"
      @on-recheck="isCheckData"
      @on-del="deleteSelect"
      @on-export="exportFile"
      @on-import="openImportPop"
    ></sub-req>
    <c-table
      :selectionShow="true"
      :data="data"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectedUpkeepPlanList"
    >
    <template slot-scope="scope" slot="status_name">
      <span :style="{'color': setColor(scope.data.status)}">{{scope.data.status_name}}</span>
    </template>
    <template slot-scope="scope" slot="operation">
      <el-button type="text" size="mini" @click="editRowInfo(scope.data,'detail')">查看</el-button>
      <el-button type="text" size="mini" v-if="scope.data.status != 2&&$isPowerShow('edit')"  @click="editRowInfo(scope.data,'edit')">编辑</el-button>
      <el-popconfirm
        @confirm="checkStatus(scope.data,'2')"
        v-if="scope.data.status != 2&&$isPowerShow('check')" 
        title="确定审核这条记录吗？">
        <el-button slot="reference" type="text" size="mini">审核</el-button>
      </el-popconfirm>
      <el-button type="text" size="mini" v-if="scope.data.status == 2&&$isPowerShow('recheck')" @click="checkStatus(scope.data,'1')">反审核</el-button>

      <el-popconfirm
        v-if="$isPowerShow('del') && scope.data.status!=2"
        @confirm="deleteRowInfo(scope.data)"
        title="确定删除此条记录吗？">
        <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;" >删除</el-button>
      </el-popconfirm>
      <el-button type="text" size="mini" @click="printRowInfo(scope.data)" v-if="$isPowerShow('print')">打印</el-button>
    </template>
    </c-table>

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

    <!-- <el-dialog
      :visible="warehouseLeaveShow"
      fullscreen
      :before-close="handleClose"
      >
    <warehouse-leave
    ref="warehouseLeave"
    ></warehouse-leave>
    <span slot="footer" class="dialog-footer">
      <el-button @click="warehouseLeaveShow = false">取 消</el-button>
    </span>
    </el-dialog> -->
    <drawer-dialog
      :drawer.sync="drawerdialogVisible"
      @on-ok="onSubmit"
    ></drawer-dialog>

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

    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :typeMessage="'退货单'"
      @on-submit-excel="onSubmitExcel"
    ></file-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import { getUser } from '@/utils/auth';
import { formatTime } from '@/utils/index'
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
import cTable from "./component/c-table";
import drawerDialog from "./component/drawer-dialog";
import fileDialog from "@/components/fileDialog/file-dialog.vue";
export default {
  name: "goods-returned-note",
  components: {
    subReq,
    informationDialog,
    cTable,
    drawerDialog,
    fileDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
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
          label: "退货出库单号",
          prop: "return_order",
          width: "150",
          align: "center",
          signIndex: "",
          sortable: false,
        },
        {
          id: 2,
          label: "审核状态",
          prop: "status_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "退货日期",
          prop: "return_date",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "退货仓库",
          prop: "return_ware_house",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "供应商",
          prop: "supplier_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "关联入库单",
          prop: "enter_order",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "物料编号",
          prop: "material_code",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "物料名称",
          prop: "material_name",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "规格型号",
          prop: "specification",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "单位",
          prop: "measure_unit_name",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "数量",
          prop: "count",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
      {
          id: 12,
          label: "单价",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
      {
          id: 13,
          label: "金额",
          prop: "total_price",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "批次",
          prop: "batch_no",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "经办人",
          prop: "agent_person_name",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "退料原因",
          prop: "return_reason",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "仓保员",
          prop: "warehouse_person_name",
          width: "130",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
        {
          id: 18,
          label: "审核人",
          prop: "audit_person_name",
          width: "130",
          align: "center",
          signIndex: 17,
          sortable: false,
        },
        {
          id: 19,
          label: "审核日期",
          prop: "audit_date",
          width: "130",
          align: "center",
          signIndex: 18,
          sortable: false,
        },
        {
          id: 25,
          label: "操作",
          prop: "operation",
          width: "200",
          align: "center",
          signIndex: 24,
          sortable: false,
        },
      ],
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
      FileData: {
        url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/退货单导入模板.xlsx",
      },
      filedialogVisible: false
    };
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
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetPageListReturnsOrder(params)
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
    // 选择
    selectedUpkeepPlanList(tyreFailList) {
      this.tyreFailIds = [];
      this.tyreFail = [];
      tyreFailList.forEach((item,index) => {
        this.tyreFailIds.push(item.id)
        this.tyreFail.push(item)
      });
      console.log(JSON.stringify(this.tyreFailIds))
    },
    // 添加
    openAddJobPage() {
      this.curSelecedType = 'add';
      this.informationDialogTitle = "退货单";
      this.informationDialogShow = true;
    },
    // 编辑、查看
    editRowInfo(form,type) {
      this.$client.GetDetailReturnsOrder({id:form.id})
      .then(res => {
        if(res.head.result == '200') {
          this.curSelecedType = type;
          if(type == 'edit') {
            this.informationDialogTitle = "编辑退货单";
          }else{
            this.informationDialogTitle = "查看退货单";
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
    // 编辑、添加
    saveAddEdit(form) {
      let successrMessage = this.curSelecedType == "add" ? "添加成功" : "编辑成功";
      let parmas = [ form ];
      let objHttp = {
        'add': 'InsertReturnsOrder',
        'edit': 'UpdateReturnsOrder',
      }
      this.$client[objHttp[this.curSelecedType]](parmas)
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
    // 删除
    deleteRowInfo(info) {
      let params = {
        context: []
      };
      if(!!info) {
        params.context[0] = info.id
      }else{
        params.context = this.tyreFailIds
      }
      this.$client.DeleteReturnsOrder(params)
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
    //批量审核
    isCheckData(type){
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
        this.$message({
          showClose: true,
          message: '勾选项中有已审核的选项，无法重新审核',
          type: "warning",
        });
        return
      }
        this.$confirm('审核后，将立刻更新库存，请仔细核对物料明细，确保库存信息无误”。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.checkStatus('',type);
        })
    },
     // 审核
    checkStatus(info,type) {
      let params = { context: {}};
      let userInfo = JSON.parse(getUser());
      params.context.audit_person_id =Number(userInfo.user_id);
      params.context.audit_date = formatTime(new Date())
      if(!!info) {
        params.context.ids = [info.id]
        params.context.status = type
        
      }else{
        params.context.ids = this.tyreFailIds
        params.context.status = type
      }
      this.$client.AuditReturnsOrder(params)
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
    // 导出Excel
    exportFile(){
      let params = Object.assign({}, this.form);
      this.$client.ExportReturnsOrder(params)
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
      this.$client.ImportReturnOrder(params)
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
    // 打开高级筛选  
    openAdvancedFilterPage() {
      this.drawerdialogVisible = true
    },
    // 打印退货单
    printRowInfo(row) {
      this.print_id = row.id
      let params = {
        context: {
          object_id: 1760,
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
    setColor(state) {
      switch (state) {
        case 1:
          return 'rgb(255, 153, 0)'
        case 2:
          return '#0CB780'
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
.goods-returned-note {
  width: 100%;
  height: 100%;
}
</style>
