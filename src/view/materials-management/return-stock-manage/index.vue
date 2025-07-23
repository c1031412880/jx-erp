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
    <c-table
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
    <template slot-scope="scope" slot="enter_type">
      <span v-if="scope.data.enter_type=='YBRK'">一般入库</span>
      <span v-else-if="scope.data.enter_type=='CGRK'">采购单入库</span>
      <span v-else-if="scope.data.enter_type=='DBRK'">调拨入库</span>
      <span v-else-if="scope.data.enter_type=='PYRK'">盘盈入库</span>
      <span v-else-if="scope.data.enter_type=='HCRK'">红冲入库</span>
      <span v-else>退料入库</span>
    </template>
     <template slot-scope="scope" slot="state_name">
      <span style="color:#409EFF;" v-if="scope.data.state=='2'">{{scope.data.state_name}}</span>
      <span style="color:red;" v-else-if="scope.data.state=='3'">{{scope.data.state_name}}</span>
      <span style="color:red;" v-else-if="scope.data.state=='1'">{{scope.data.state_name}}</span>
      <span v-else></span>
    </template>
    <template slot-scope="scope" slot="operation" >
        <el-button type="text" size="mini" @click="goEdit(scope.data.id)">查看</el-button>
        <el-button type="text" size="mini" v-if="scope.data.state!=2&&$isPowerShow('edit')" @click="editRowInfo(scope.data,'edit')">编辑</el-button>
        <!-- <el-popconfirm
          @confirm="checkStatus(scope.data,'2')"
          title="确定审核这条记录吗？">
        <el-button type="text" size="mini"  v-if="scope.data.state!=2" >审核</el-button>
        </el-popconfirm> -->
        <!-- <el-button type="text" size="mini" v-else @click="checkStatus(scope.data,'3')">反审核</el-button> -->

          <el-button v-if="scope.data.state!=2&&$isPowerShow('check')" @click="open(scope.data,'2')" slot="reference" type="text" size="mini" style="margin-left: 10px;" >审核</el-button>
          <el-button slot="reference" @click="open(scope.data,'3')" v-if="scope.data.state==2&&$isPowerShow('check')" type="text" size="mini" style="margin-left: 10px;" >反审核</el-button>
        <el-popconfirm
          v-if="$isPowerShow('del')"
          @confirm="deleteRowInfo(scope.data)"
          title="确定删除此条记录吗？">
          <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;" >删除</el-button>
        </el-popconfirm>
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
      <el-dialog
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
    </el-dialog>
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
import jurisdiction from "@/view/401";
import wareouseWarrant from "./component/warehouse-warrant";
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
import cTable from "./component/c-table";
export default {
  name: "return-stock-manage",
  components: {
    jurisdiction,
    subReq,
    informationDialog,
    cTable,
    wareouseWarrant
  },
  data() {
    return {
      showprice:'3',
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
      warehouseWarrantShow:false,
      customSettingVialogVisible: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      drawerdialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "入库单号",
          prop: "enter_num",
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
          label: "入库方式",
          prop: "enter_type",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "入库日期",
          prop: "enter_date",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "关联单号",
          prop: "relate_num",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        // {
        //   id: 5,
        //   label: "物料数量",
        //   prop: "material_num",
        //   width: "130",
        //   align: "center",
        //   signIndex: 4,
        //   sortable: false,
        // },
        // {
        //   id: 6,
        //   label: "物料种类数",
        //   prop: "material_type_num",
        //   width: "130",
        //   align: "center",
        //   signIndex: 5,
        //   sortable: false,
        // },
        {
          id: 6,
          label: "入库仓库",
          prop: "house_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "供应商",
          prop: "provider_name",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "物料编号",
          prop: "material_code",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
         {
          id: 9,
          label: "物料名称",
          prop: "material_name",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
         {
          id: 10,
          label: "规格型号",
          prop: "specification",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
         {
          id: 11,
          label: "单位",
          prop: "measure_unit_name",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
         {
          id: 12,
          label: "退料数量",
          prop: "count",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
         {
          id: 13,
          label: "单价",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
         {
          id: 14,
          label: "金额",
          prop: "total_price",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        // {
        //   id: 16,
        //   label: "成本单价",
        //   prop: "cost_price",
        //   width: "130",
        //   align: "center",
        //   signIndex: 15,
        //   sortable: false,
        // }, {
        //   id: 17,
        //   label: "成本总价",
        //   prop: "cost_total_price",
        //   width: "130",
        //   align: "center",
        //   signIndex: 16,
        //   sortable: false,
        // },
         {
          id: 15,
          label: "批次",
          prop: "batch_no",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "仓保员",
          prop: "storage_name",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id:17,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
        // {
        //   id: 20,
        //   label: "关联单号",
        //   prop: "relate_num",
        //   width: "130",
        //   align: "center",
        //   signIndex: 19,
        //   sortable: false,
        // },
        //  {
        //   id: 21,
        //   label: "采购员",
        //   prop: "buyer_name",
        //   width: "130",
        //   align: "center",
        //   signIndex: 20,
        //   sortable: false,
        // },
         {
          id: 18,
          label: "审核时间",
          prop: "review_date",
          width: "130",
          align: "center",
          signIndex: 17,
          sortable: false,
        },
         {
          id: 19,
          label: "审核人",
          prop: "review_name",
          width: "130",
          align: "center",
          signIndex: 18,
          sortable: false,
        },
        {
          id: 20,
          label: "操作",
          prop: "operation",
          width: "200",
          align: "center",
          signIndex: 19,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      filedialogVisible: false,
      tyreFailIds:[],
    };
  },
  mounted() {
    // this.loadData();
    this.showprice = JSON.parse(localStorage.getItem('showprice'));
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    //关闭弹窗
     handleClose() {
        this.warehouseWarrantShow=false
      },
    goEdit(data) {
      // this.$router.push({
      //   path:'/warehouse-warrant',
      //    query: {
      //       id: data
      //     }
      // })
      this.warehouseWarrantShow = true
      setTimeout(() => {
        this.$refs.warehouseWarrant.getdataTable(data)
      }, 200);
    },
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
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      console.log(this.form);
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
            this.data.forEach(element => {
            if(element.price){
               element.price=element.price.toFixed(2)
               element.total_price=element.total_price.toFixed(2)
                if(element.cost_price){
                  element.cost_price=element.cost_price.toFixed(2)
                  if(element.cost_total_price){
                    element.cost_total_price=element.cost_total_price.toFixed(2)
                  }
                }
              }
            });
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

    checkrefShow(state) {
      let showText = '';
      switch (state) {
        case 0:
          showText = '未审核';
          break;
        case 1:
          showText = '成功';
          break;
        case 2:
          showText = '失败';
          break;
      }
      return showText
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
        this.$confirm('审核后，将立刻更新库存，请仔细核对物料明细，确保入库信息无误”。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         this.checkStatusAii(type)
        })
    },
    // 批量审核
    checkStatusAii(type) {
      let i =''
      this.checkStatus(i,type);
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
    openAdvancedFilterPage() {
      this.drawerdialogVisible = true;
    },

    selectedUpkeepPlanList(tyreFailList) {
      this.tyreFailIds = [];
      this.tyreFail = [];
      tyreFailList.forEach((item,index) => {
        this.tyreFailIds.push(item.id)
        this.tyreFail.push(item)
      });
      console.log(JSON.stringify(this.tyreFailIds))
    },

    // 编辑
    editRowInfo(form,type) {
      console.log(form);
      this.$refs.informationDialog.state = form.state
      this.$client.getDataEnterHouse({id:form.id})
      .then(res => {
        if(res.head.result == '200') {
        this.$refs.informationDialog.tableData = res.context.details
        this.$refs.informationDialog.form.enter_type = res.context.enter_type
        this.$refs.informationDialog.form.enter_date = res.context.enter_date
        this.$refs.informationDialog.form.relate_num = res.context.relate_num
        this.$refs.informationDialog.form.storage_id = res.context.storage_id
        this.$refs.informationDialog.form.buyer_id = res.context.buyer_id
        this.$refs.informationDialog.form.remark = res.context.remark
        this.$refs.informationDialog.form.provider_id = res.context.provider_id
        this.$refs.informationDialog.form.house_id = res.context.house_id
        this.$refs.informationDialog.form.id = form.id
        this.$refs.informationDialog.form.state = form.state
          // this.$message({type: 'success', message: '成功'})
        }else{
          this.$message({type: 'error', message: '失败'})
        }
      })
      this.curSelecedType = type;


      if(type == 'edit') {
        this.informationDialogTitle = "添加入库单";
      }else{
        this.informationDialogTitle = "编辑入库单";
      }

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
      // 审核
    open(info,type){
        this.$confirm('审核后，将立刻更新库存，请仔细核对物料明细，确保入库信息无误”。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         this.checkStatus(info,type)
        })
    },
    // 审核
    checkStatus(info,type) {
      console.log(this.tyreFailIds,123)
        let params = { context: {}};
      if(!!info) {
        params.context.ids = [info.id]
        params.context.result =type
      }else{
        params.context.ids = this.tyreFailIds
        params.context.result = type
      }
      console.log(params)
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
.tyre-maintain {
  width: 100%;
  height: 100%;
}
</style>
