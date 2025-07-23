<template>
  <div class="tyre-maintain">
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
      <template slot-scope="scope" slot="enter_type">
        <span>{{getEnterName(scope.data.enter_type)}}</span>
      </template>
      <template slot-scope="scope" slot="origin_code">
        <span>{{!!scope.data.details ? scope.data.details[0].origin_code : ''}}</span>
      </template>
      <template slot-scope="scope" slot="pay_state">
        <span :style="{'color': scope.data.pay_state == 1 ? '#D9001B' : '#95f204'}">{{scope.data.pay_state_name}}</span>
      </template>
      <template slot-scope="scope" slot="state_name">
        <span :style="{'color': setColor(scope.data.state)}">{{scope.data.state_name}}</span>
      </template>
      <template slot-scope="scope" slot="operation" >
          <el-button type="text" size="mini" v-if="$isPowerShow('details')"  @click="editRowInfo(scope.data,'detail')">查看</el-button>
          <el-button type="text" size="mini" v-if="$isPowerShow('edit') && scope.data.state != 2" @click="editRowInfo(scope.data,'edit')">编辑</el-button>
        <el-button type="text" size="mini" v-if="scope.data.state == 1 || scope.data.state == 3" @click="showCheckStatus(scope.data,'2')">审核</el-button>
          <el-button type="text" size="mini" v-if="scope.data.state == 2" @click="showCheckStatus(scope.data,'3')">反审核</el-button>
          <el-popconfirm
            v-if="$isPowerShow('del') && scope.data.state!=2"
            @confirm="deleteRowInfo(scope.data)"
            title="确定删除此条记录吗？">
            <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;">删除</el-button>
          </el-popconfirm>
          <el-button type="text" size="mini" @click="printRowInfo(scope.data)" v-if="$isPowerShow('print')">打印</el-button>
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
      @on-load="loadData"
      @save-add-edit="saveAddEdit"
      @save-audit-add-edit="saveAuditAddEdit"
      @on-audit="setAudit"
    ></information-dialog>
      <!-- <el-dialog
      :visible="warehouseWarrantShow"
      fullscreen
      :before-close="handleClose"
      >
     <wareouse-warrant
     ref="warehouseWarrant"
    ></wareouse-warrant>
    <span slot="footer" class="dialog-footer">
      <el-button @click="warehouseWarrantShow = false">取 消</el-button>
    </span>
    </el-dialog> -->
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
  </div>
</template>

<script type="text/ecmascript-6">
import wareouseWarrant from "./component/warehouse-warrant";
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
import cTable from "./component/c-table";
import drawerDialog from "./component/drawer-dialog";
export default {
  name: "stock-management",
  components: {
    subReq,
    informationDialog,
    cTable,
    wareouseWarrant,
    drawerDialog
  },
  data() {
    return {
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
          label: "入库单号",
          prop: "enter_num",
          width: "150",
          align: "center",
          signIndex: "0",
        },
        {
          id: 2,
          label: "审核状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "付款状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "入库方式",
          prop: "enter_type",
          width: "130",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "入库日期",
          prop: "enter_date",
          width: "130",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "关联单号",
          prop: "relate_num",
          width: "150",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "入库仓库",
          prop: "house_name",
          width: "130",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "入库仓位",
          prop: "position",
          width: "130",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "供应商",
          prop: "provider_name",
          width: "150",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "原始物料编号",
          prop: "origin_code",
          width: "130",
          align: "center",
          signIndex: 9,
        },
        {
          id: 11,
          label: "物料编号",
          prop: "material_code",
          width: "130",
          align: "center",
          signIndex: 10,
        },
        {
          id: 12,
          label: "物料名称",
          prop: "material_name",
          width: "170",
          align: "center",
          signIndex: 11,
        },
        {
          id: 13,
          label: "规格型号",
          prop: "specification",
          width: "170",
          align: "center",
          signIndex: 12,
        },
        {
          id: 14,
          label: "数量",
          prop: "count",
          width: "90",
          align: "center",
          signIndex: 13,
        },
        {
          id: 15,
          label: "单位",
          prop: "measure_unit_name",
          width: "90",
          align: "center",
          signIndex: 14,
        },
         {
          id: 16,
          label: "含税单价",
          prop: "price",
          width: "90",
          align: "center",
          signIndex: 15,
        },
        {
          id: 17,
          label: "含税金额",
          prop: "total_price",
          width: "90",
          align: "center",
          signIndex: 16,
        },
        {
          id: 18,
          label: "批次",
          prop: "batch_no",
          width: "130",
          align: "center",
          signIndex: 17,
        },
         {
          id: 19,
          label: "采购员",
          prop: "buyer_name",
          width: "130",
          align: "center",
          signIndex: 18,
        },
        {
          id: 20,
          label: "制单人",
          prop: "storage_name",
          width: "130",
          align: "center",
          signIndex: 19,
        },
         {
          id: 21,
          label: "审核时间",
          prop: "review_date",
          width: "150",
          align: "center",
          signIndex: 20,
        },
         {
          id: 22,
          label: "审核人",
          prop: "review_name",
          width: "130",
          align: "center",
          signIndex: 21,
        },
         {
          id: 23,
          label: "摘要",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 22,
        },
        {
          id: 24,
          label: "备注",
          prop: "detail_remark",
          width: "130",
          align: "center",
          signIndex: 23,
        },
        {
          id: 25,
          label: "操作",
          prop: "operation",
          width: "260",
          align: "center",
          signIndex: 24,
        },
      ],
      canRendererTableHeader: null,
      customSettingShowList: null,
      customSettingVialogVisible: false,
      menu_code: '',
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      tyreFailIds:[],

      tableArr: [],
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
      headerLoading: false,
      titlesId: ''
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  methods: {
    goEdit(data) {

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
    // 打开自定义表格头部弹窗
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
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
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getByPageEnterHouse(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total


            // this.data.forEach((element,index) => {
            //   element.row_index = index
            // if(element.price){
            //    element.price=element.price.toFixed(2)
            //    element.total_price=element.total_price.toFixed(2)
            //     if(element.cost_price){
            //       element.cost_price=element.cost_price.toFixed(2)
            //       if(element.cost_total_price){
            //         element.cost_total_price=element.cost_total_price.toFixed(2)
            //       }
            //     }
            //   }
            // });
          // this.getSpanArr(this.data)
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
    // 合并单元格
    getSpanArr(data) {
      // 把需要合并行的归类, data是表格数据
      this.tableArr = []
      this.tablePos = 0
      for (var i = 0; i < data.length; i++) {
          if (i === 0) {
              // 第一行必须存在
              this.tableArr.push(1)
              this.tablePos = 0
          } else {
              if (data[i].id === data[i - 1].id) {
                  this.tableArr[this.tablePos] += 1
                  this.tableArr.push(0)
              } else {
                  this.tableArr.push(1)
                  this.tablePos = i
              }
          }
      }
      // 表格序号
      let Nosort = 0
      for(let n in this.tableArr){
          if(this.tableArr[n]>0){
              Nosort += 1
              this.$set(data[n],'Nosort',Nosort)
          }
      }
    },
    // 编辑、添加 加审核
    saveAuditAddEdit(form) {
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
        .setRecordEnterHouse(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            let id = parmas.context.id || res.context;
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
    // 编辑
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
        .setRecordEnterHouse(parmas)
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
      this.$client.deleteRecordEnterHouse(params)
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
        this.$message({
          showClose: true,
          message: '勾选项中有已审核的选项，无法重新审核',
          type: "warning",
        });
        return
      }
        this.$confirm('审核后，将立刻更新库存，请仔细核对物料明细，确保入库信息无误"。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         this.checkStatusAii(type)
        })
    },
    // 批量审核
    checkStatusAii(type) {
      this.checkStatus('',type);
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
       this.$client.reviewRecordEnterHouse(params)
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
      let ids = [ ...this.tyreFailIds ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      this.$client.exportEnterHouse(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    openAddJobPage() {
      this.curSelecedType = 'add';
      this.informationDialogTitle = "入库单";
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
        this.tyreFailIds.push(item.id)
        this.tyreFail.push(item)
      });
    },
    setAudit(id,type) {
      this.informationDialogShow = false;
      this.checkStatus({ id},type)
    },
    // 审核初始化
    showCheckStatus(form,type) {
      this.$refs.informationDialog.AuditType = type
      this.$client.getDataEnterHouse({id:form.id})
        .then(res => {
          if(res.head.result == '200') {
            this.curSelecedType = 'detail';
            if (res.context.enter_type == 'TLRK') {
              res.context.enter_type = '退料入库'
            }
            this.$nextTick(() => {
              this.$refs.informationDialog.setData(res.context)
            })
            this.informationDialogTitle = "入库单审批";

            this.informationDialogShow = true;
          }else{
            this.$message({type: 'error', message: '失败'})
          }
        })
    },
    // 编辑
    editRowInfo(form,type) {
      this.curSelecedType = type;
      this.$client.getDataEnterHouse({id:form.id})
      .then(res => {
        if(res.head.result == '200') {
          if (res.context.enter_type == 'TLRK') {
            res.context.enter_type = '退料入库'
          }
          this.$nextTick(() => {
            this.$refs.informationDialog.setData(res.context)
          })
          if(type == 'edit') {
            this.informationDialogTitle = "编辑入库单";
          }else{
            this.informationDialogTitle = "查看入库单";
          }

          this.informationDialogShow = true;
        }else{
          this.$message({type: 'error', message: '失败'})
        }
      })
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
    // 打印入库单
    printRowInfo(row) {
      this.print_id = row.id
      let params = {
        context: {
          object_id: 1770,
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
    // 获取入库方式
    getEnterName(val) {
      switch (val) {
        case 'YBRK':
          return '一般入库';
        case 'CGRK':
          return '采购单入库';
        case 'DBRK':
          return '调拨入库';
        case 'PYRK':
          return '盘盈入库';
        case 'HCRK':
          return '红冲入库';
        case 'TLRK':
          return '退料入库';
        default:
          return '';
      }
    },
    // 打开高级筛选
    openAdvancedFilterPage() {
      this.drawerdialogVisible = true
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
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
.tyre-maintain {
  width: 100%;
  height: 100%;
}
</style>
