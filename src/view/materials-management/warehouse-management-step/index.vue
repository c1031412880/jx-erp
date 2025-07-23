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
    <template slot-scope="scope" slot="leave_type">
      <span v-if="scope.data.leave_type=='YBCK'">一般出库</span>
      <span v-else-if="scope.data.leave_type=='WXCK'">维修出库</span>
      <span v-else-if="scope.data.leave_type=='DBCK'">调拨出库</span>
      <span v-else-if="scope.data.leave_type=='PYCK'">盘盈出库</span>
      <span v-else-if="scope.data.leave_type=='HCCK'">红冲出库</span>
      <span v-else-if="scope.data.leave_type=='PKCK'">盘亏出库</span>
      <span v-else></span>
    </template>
     <template slot-scope="scope" slot="state_name">
      <span style="color:#409EFF;" v-if="scope.data.state== 2">{{scope.data.state_name}}</span>
      <span style="color:#999999;" v-else-if="scope.data.state == 4">{{scope.data.state_name}}</span>
      <span style="color:red;" v-else>{{scope.data.state_name}}</span>
    </template>
    <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" v-if="$isPowerShow('details')" @click="checkDetail(scope.data.id)">查看</el-button>
        <el-button type="text" size="mini" v-if="scope.data.user_ids.indexOf(user_id) !== -1 && scope.data.state == 1" @click="checkDetail(scope.data.id)">审核</el-button>
        <!-- <el-button type="text" size="mini"  v-if="$isPowerShow('details')" @click="goEdit(scope.data)">查看</el-button> -->
        <el-button type="text" size="mini" v-if="$isPowerShow('edit')"  @click="editRowInfo(scope.data,'edit')">编辑</el-button>
        <!-- <el-popconfirm
          @confirm="checkStatus(scope.data,'2')"
          title="确定审核这条记录吗？">
        <el-button type="text" size="mini"  v-if="scope.data.state!=2" >审核</el-button>
        </el-popconfirm> -->
        <!-- <el-button type="text" size="mini" v-else @click="checkStatus(scope.data,'3')">反审核</el-button> -->

          <!-- <el-button  @click="open(scope.data,'2')" slot="reference" v-if="scope.data.state!=2&&$isPowerShow('audit')" type="text" size="mini" style="margin-left: 10px;" >审核</el-button> -->
          <!-- <el-button  v-if="scope.data.state==2 && scope.data.leave_type !='PKCK' &&$isPowerShow('unaudit')" @click="open(scope.data,'3')" slot="reference" type="text" size="mini" style="margin-left: 10px;" >反审核</el-button> -->
        <!-- <el-popconfirm
          v-if="$isPowerShow('del')"
          @confirm="deleteRowInfo(scope.data)"
          title="确定删除此条记录吗？">
          <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;" >删除</el-button>
        </el-popconfirm> -->
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
      @on-load="loadData"
      @on-save="saveAddEdit"
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
import warehouseLeave from "./component/warehouse-leave";
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog2";
import cTable from "./component/c-table";
import { getUser } from '@/utils/auth';
export default {
  name: "warehouse-management",
  components: {
    subReq,
    informationDialog,
    cTable,
    warehouseLeave,
    jurisdiction
  },
  data() {
    return {
      showprice:'3',
      warehouseLeaveShow:false,
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
      customSettingVialogVisible: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      drawerdialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "出库单号",
          prop: "leave_num",
          width: "150",
          align: "center",
          signIndex: "",
          sortable: true,
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
          label: "出库方式",
          prop: "leave_type",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "出库日期",
          prop: "leave_date",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
         {
          id: 5,
          label: "物料数量",
          prop: "material_num",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        }, {
          id: 6,
          label: "物料种类数",
          prop: "material_type_num",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "出库仓库",
          prop: "house_name",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "车牌号",
          prop: "lp_num",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "自编号",
          prop: "v_num",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "物料编号",
          prop: "material_code",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
         {
          id: 11,
          label: "物料名称",
          prop: "material_name",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
         {
          id: 12,
          label: "规格型号",
          prop: "specification",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
         {
          id: 13,
          label: "单位",
          prop: "measure_unit_name",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
         {
          id: 14,
          label: "数量",
          prop: "count",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: true,
        },
         {
          id: 15,
          label: "销售单价",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: true,
        },
         {
          id: 16,
          label: "销售金额",
          prop: "total_price",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: true,
        },
         {
          id: 17,
          label: "供应商",
          prop: "provider_names",
          width: "130",
          align: "center",
          signIndex: 16,
          sortable: true,
        },
         {
          id: 18,
          label: "批次",
          prop: "batch_no",
          width: "130",
          align: "center",
          signIndex: 17,
          sortable: true,
        },
        {
          id: 19,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 18,
          sortable: false,
        },
        {
          id:20,
          label: "线路名",
          prop: "line_name",
          width: "130",
          align: "center",
          signIndex: 19,
          sortable: true,
        },
        {
          id: 21,
          label: "关联工单",
          prop: "relate_num",
          width: "130",
          align: "center",
          signIndex: 20,
          sortable: false,
        },
        //  {
        //   id: 16,
        //   label: "采购员",
        //   prop: "buyer_name",
        //   width: "130",
        //   align: "center",
        //   signIndex: 15,
        //   sortable: false,
        // },
         {
          id: 22,
          label: "用料组织",
          prop: "pick_depatment_name",
          width: "130",
          align: "center",
          signIndex: 21,
          sortable: true,
        },
         {
          id: 23,
          label: "领料人",
          prop: "pick_name",
          width: "130",
          align: "center",
          signIndex: 22,
          sortable: true,
        },
         {
          id: 24,
          label: "领料用途",
          prop: "use_way_name",
          width: "130",
          align: "center",
          signIndex: 23,
          sortable: true,
        },
         {
          id: 25,
          label: "仓保员",
          prop: "storage_name",
          width: "130",
          align: "center",
          signIndex: 24,
          sortable: true,
        },
        //  {
        //   id: 26,
        //   label: "审核时间",
        //   prop: "review_date",
        //   width: "130",
        //   align: "center",
        //   signIndex: 25,
        //   sortable: false,
        // },
         {
          id: 26,
          label: "总金额",
          prop: "total_fee",
          width: "130",
          align: "center",
          signIndex: 25,
          sortable: false,
        },
        {
          id: 28,
          label: "操作",
          prop: "operation",
          width: "200",
          align: "center",
          signIndex: 27,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      filedialogVisible: false,
      tyreFailIds:[],
      menu_code:'',
      titlesId:'', //当前表头的id
      
      user_id: 0,
    };
  },
  created() {
      this.menu_code = this.$route.meta.code
      this.user_id = Number(JSON.parse(getUser()).user_id)
      this.reqTitleTable()
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
    reqTitleTable() {
      this.loading = true;
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
        this.$forceUpdate();
        setTimeout(() =>{
          this.loading = false;
        },600)
      }).catch(err => {
        setTimeout(() =>{
          this.loading = false;
        },600)
      })
    },
  //  //关闭弹窗
  //   handleClose() {
  //     this.warehouseLeaveShow=false
  //   },
    // //查看
    // goEdit(data) {
    //   // this.$router.push({
    //   //   path:'/warehouse-leave',
    //   //    query: {
    //   //       id: data
    //   //     }
    //   // })
    //   // this.warehouseLeaveShow = true
    //   // setTimeout(() => {
    //   //   this.$refs.warehouseLeave.getdataTable(data.id)
    //   // }, 60);
    // },
      // 查看 /审核
    checkDetail(id) {
      this.$router.push({
        path: `/news-details/${id}/${'物资出库单'}/${1460}`
      })
    },
    // updateTableHeader(newestTableHeaderList) {
    //   this.canRendererTableHeader = null;
    //   this.canRendererTableHeader = newestTableHeaderList;
    //   this.$forceUpdate();
    // },
    updateTableHeader(newestTableHeaderList) {
    this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {
      this.canRendererTableHeader = null;
      this.customSettingShowList = null;
      this.reqTitleTable()
    }).catch(err => {

    })
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
      this.$client.getByPageLeaveHouse(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
             this.data.forEach(element => {
            if(element.price){
              element.price=element.price.toFixed(2)
              element.total_price=element.total_price.toFixed(2)
              }
            });
          } else if(res.head.result == "206") {

          }else {
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
      let parmas = {
        context: form
      };
      this.$client
        .setRecordLeaveHouse(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
            this.$message({
              showClose: true,
              message: "编辑成功",
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
    // 审核
    open(info,type){
        this.$confirm('审核后，将立刻更新库存，请仔细核对物料明细，确保出库信息无误', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         this.checkStatus(info,type)
        })
    },
    // 批量审核
    checkStatusAii(type) {
      let i =''
      this.checkStatus(i,type);
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
    // 导出Excel
    exportFile(){
      let params = Object.assign({}, this.form);
      let ids = [ ...this.tyreFailIds ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      this.$client.exportLeaveHouseLiShui(params)
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
      // this.form = {};
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    openAddJobPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "出库单";
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
      this.curSelecedType = type;
      this.$refs.informationDialog.state_name = form.state_name
      console.log(form);
      this.$client.getDataLeaveHouse({id:form.id})
      .then(res => {
        if(res.head.result == '200') {
        this.$refs.informationDialog.tableData = res.context.details
        this.$refs.informationDialog.form.leave_type = res.context.leave_type
        this.$refs.informationDialog.form.leave_date = res.context.leave_date
        this.$refs.informationDialog.form.house_id = res.context.house_id
        this.$refs.informationDialog.form.relate_num = res.context.relate_num
        this.$refs.informationDialog.form.lp_num = res.context.lp_num
        this.$refs.informationDialog.form.use_way = res.context.use_way
        this.$refs.informationDialog.form.storage_id = res.context.storage_id
        this.$refs.informationDialog.form.line_name = res.context.line_name
        this.$refs.informationDialog.form.line_id = res.context.line_id
        if(res.context.out_vehicle!=null){
          this.$refs.informationDialog.form.out_vehicle = res.context.out_vehicle
        }
        this.$refs.informationDialog.form.pick_id = res.context.pick_id
        this.$refs.informationDialog.form.pick_depatment_id = res.context.pick_depatment_id
        this.$refs.informationDialog.form.remark = res.context.remark
        this.$refs.informationDialog.form.img_list = res.context.img_list
        this.$refs.informationDialog.form.file_list = res.context.file_list
        this.$refs.informationDialog.form.total_fee = res.context.total_fee
        this.$refs.informationDialog.form.id = form.id
        this.$refs['informationDialog'].getWarehouseperson1(res.context.house_id)
        this.$refs['informationDialog'].countHeight()
        this.$refs['informationDialog'].getAllfee()
          // this.$message({type: 'success', message: '成功'})
        }else{
          this.$message({type: 'error', message: '失败'})
        }
      })

      this.informationDialogTitle = "编辑出库单";
      this.informationDialogShow = true;
    },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: []
      };

      // if(info.state=='2'){
      //   this.$message({type:'error',message:'请先审核后再进行删除'})
      //   return
      // }
      if(!!info) {
        params.context[0] = info.id
      }else{
        params.context = this.tyreFailIds
      }
      this.$client.deleteRecordLeaveHouse(params)
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
       this.$client.reviewRecordLeaveHouse(params)
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
