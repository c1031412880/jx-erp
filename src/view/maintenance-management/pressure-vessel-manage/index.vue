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
        @on-scrap="batchScrap"
        @on-checkout="onCheckout"
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
        <template slot-scope="scope" slot="labor_contract_time">
          <span v-if="scope.data.labor_contract_time.length > 1">
            {{ scope.data.labor_contract_time[0] }}-{{ scope.data.labor_contract_time[1] }}
          </span>
          <span v-else>--</span>
        </template>

        <template slot-scope="scope" slot="department_name">
          <span v-if="scope.data.department_info && scope.data.department_info.length > 0">
            {{ scope.data.department_info[0].c_name }}
          </span>
        </template>
        <template slot-scope="scope" slot="vehicle_code">
          <span v-if="scope.data.vehicle_info && scope.data.vehicle_info.length > 0">
            {{ scope.data.vehicle_info[0].c_name }}
          </span>
        </template>

        <!-- <template slot-scope="scope" slot="c_state">
            <span v-if="scope.data.c_state">{{scope.data.c_state == '1'? '永久': scope.data.c_state == '2'?'临时': '停用'}}</span>
          </template> -->

        <template slot-scope="scope" slot="operation">
          <el-button
            type="primary"
            size="mini"
            @click="editInfo(scope.data, 'edit')"
            v-if="$isPowerShow('编辑')"
          >
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="editInfo(scope.data, 'detail')">
            查看
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="onCheck(scope.data)"
            v-if="$isPowerShow('bath-checkout') && false"
          >
            检验
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="onScrap(scope.data)"
            :disabled="scope.data.state != 'container_2'"
            v-if="$isPowerShow('bath-scrap')"
          >
            {{ scope.data.state == 'container_3' ? '已废' : '报废' }}
          </el-button>
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
        :containerLifeData="containerLifeData"
      ></add-dialog>
      <!-- 报废弹窗 -->
      <scrap-dialog
        ref="scrapDialog"
        :dialogBool.sync="scrapDialogShow"
        :showScrapTitle="showScrapTitle"
        @sure-submit-scrap="sureSubmitScrap"
      ></scrap-dialog>
      <!-- 批量检验 -->
      <batch-checkout-dialog
        ref="batchCheckout"
        :dialogBool.sync="isShowBatchCheckout"
        @sure-submit-batch-check="sureSubmitBatchCheck"
      ></batch-checkout-dialog>
      <!-- 批量检验 -->
      <checkout-dialog
        ref="checkout"
        :dialogBool.sync="isShowCheckout"
        @sure-submit-check="sureSubmitCheck"
      ></checkout-dialog>
      <!-- 高级筛选 -->
      <drawer-dialog
        ref="drawerDialog"
        :drawer.sync="isShowDrawerDialog"
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
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from './component/sub-req'
import AddDialog from './component/dialog/add-dialog'
import scrapDialog from './component/dialog/scrap-dialog'
import drawerDialog from './component/dialog/drawer-dialog'
import batchCheckoutDialog from './component/dialog/batch-checkout-dialog'
import checkoutDialog from './component/dialog/checkout-dialog'

export default {
  name: "pressure-vessel-manage",
  components: {
    subReq,
    AddDialog,
    scrapDialog,
    drawerDialog,
    batchCheckoutDialog,
    checkoutDialog
  },
  data() {
    return {
      curChangeType: 'add', //add添加  edit编辑  detail详情
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      filedialogVisible: false,
      queryform: {}, //查询表单
      pressureVesselData: [], //列表
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      addDialogShow: false, //添加信息
      scrapDialogShow: false, //报废弹窗
      isShowDrawerDialog: false, //是否显示高级筛选
      customSettingVialogVisible: false,
      isShowBatchCheckout: false, //批量检验
      isShowCheckout: false, //检验
      customSettingList:[
        {
          id: 1,
          label: "登记证编号",
          prop: "code",
          width: "130",
          align: "center",
          signIndex:0,
          sortable:true
        },
        {
          id: 2,
          label: "压力容器类型",
          prop: "type",
          width: "120",
          align: "center",
          signIndex:1,
          sortable:false
        },
        {
          id: 3,
          label: "所属组织",
          prop: "department_name",
          width: "160",
          align: "center",
          signIndex:2,
          sortable:false
        },
        {
          id: 4,
          label: "容积(L)",
          prop: "volume",
          width: "120",
          align: "center",
          signIndex:3,
          sortable:false
        },
        {
          id: 5,
          label: "质量(KG)",
          prop: "quality",
          width: "130",
          align: "center",
          signIndex:4,
          sortable:true
        },
        {
          id: 6,
          label: "单价(元)",
          prop: "price",
          width: "120",
          align: "center",
          signIndex:5,
          sortable:false
        },
        {
          id: 7,
          label: "生产厂家",
          prop: "made",
          width: "150",
          align: "center",
          signIndex:6,
          sortable:false
        },
        {
          id: 8,
          label: "生产日期",
          prop: "made_date",
          width: "100",
          align: "center",
          signIndex:7,
          sortable:false
        },
        {
          id: 9,
          label: "购买日期",
          prop: "buy_date",
          width: "150",
          align: "center",
          signIndex:8,
          sortable:true
        },
        {
          id: 10,
          label: "最近检验日期",
          prop: "",
          width: "140",
          align: "center",
          signIndex:9,
          sortable:false
        },
        {
          id: 11,
          label: "下次检验截止日期",
          prop: "",
          width: "160",
          align: "center",
          signIndex:10,
          sortable:false
        },
        {
          id: 12,
          label: "关联车辆",
          prop: "vehicle_code",
          width: "140",
          align: "center",
          signIndex:11,
          sortable:false
        },
        {
          id: 13,
          label: "状态",
          prop: "state_name",
          width: "140",
          align: "center",
          signIndex:12,
          sortable:false
        },
        {
          id: 14,
          label: "备注",
          prop: "remark",
          width: "140",
          align: "center",
          signIndex:13,
          sortable:false
        },
        {
          id: 15,
          label: "操作",
          prop: "operation",
          width: "180",
          align: "center",
          signIndex:14,
          sortable:false
        }
      ],
      frontFixedNum:2, //前几行固定
      backFixedNum:1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      iState: '', //压力容器状态 1使用中 2闲置 3已报废 4 修理中
      detailLoading: false,
      containerVehicleRecode: [], //容器使用历史记录
      containerLifeData: [],  //生命周期
      selectedIds:[], //勾选中的ID
      showScrapTitle:'', //批量报废头部
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize')
      this.loadData();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  methods: {
    // 导出Excel
    exportFile(){
      let params = Object.assign({},this.queryform);
      this.$client.exportContainerManage(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 打开高级筛选弹窗
    onScreen() {
      this.isShowDrawerDialog = true
    },
    // 批量删除
    onDelete() {
      if(this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选至少一条要移除的压力容器',
          type: "warning",
        });
        return
      }

      let parmas = {
        context: this.selectedIds,
      };
      this.$client.deleteContainerInfo(parmas)
      .then(res => {
        if(res.head.result == '200') {
          this.selectedIds = [];
          // // 清除勾选
          // this.$refs.table.handleSelectionChange([]);
          this.loadData();
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }

      })
    },
    // 批量报废
    batchScrap() {
      let isCanScrap = true; //是否可以报废
      if(this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选至少一条要报废的压力容器',
          type: "warning",
        });
        return
      }
      this.selectedIds.forEach(id => {
        this.pressureVesselData.forEach(item => {
          if(id == item.id) {
            if(item.state != "container_2") {
              isCanScrap = false;
              return
            }
          }
        });
      });
      if(!isCanScrap) {
        this.$message({
          showClose: true,
          message: '只要闲置状态下的压力容器才能报废',
          type: "warning",
        });
        return
      }
      this.scrapDialogShow = true;
      this.showScrapTitle = `批量报废(当前选中个数：${this.selectedIds.length})`
    },
    // 报废
    onScrap(row) {
      this.selectedIds = [];
      // 清除勾选
      this.$refs.table.handleSelectionChange([]);
      this.selectedIds.push(row.id);
      this.scrapDialogShow = true;
      this.showScrapTitle = `报废(编号：${row.code})`
    },
    // 批量检验
    onCheckout() {
      this.isShowBatchCheckout = true;
    },
    // 添加信息
    addInfo(){
      this.addDialogShow = true
      this.curChangeType = 'add'
      this.$refs['addDialog'].resetData()
    },
    // 更新表格头部
    updateTableHeader(newestTableHeaderList) {

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
    // 表格选中一行 sub-req 上点击编辑时
    editSatff(){
      // let val = this.$refs['table'].curSelectedRowInfo
      // if(val){
      //   this.addDialogShow = true
      //   this.$refs['addDialog'].setData(val)
      // }else{
      //   this.$message({type: 'warning', message: '请先选择一条数据'})
      // }
    },
    // 表格上点击编辑时
    editInfo(val,type){
      this.iState= val.state;
      this.addDialogShow = true;
      this.curChangeType = type;
      this.detailLoading = true;
      this.$refs['addDialog'].setData(val)
      let params ={
        id: val.id
      };
      this.$client.getContainerVehicle(params)
      .then(res => {
        if(res.head.result == '200') {
          this.containerVehicleRecode = res.context.list;
          // alert(JSON.stringify(this.containerVehicleRecode))
          this.detailLoading = false;
        }else{
          this.$message({type: 'error', message: res.head.describle})
        }
      })

      if(type == 'detail') {
        let params ={
          id: val.id
        };
        this.$client.getContainerLife(params)
        .then(res => {
          if(res.head.result == '200') {
            this.containerLifeData = res.context.list;
            this.detailLoading = false;
          }else{
            this.$message({type: 'error', message: res.head.describle})
          }
        })
      }
    },
    // 检验
    onCheck(val) {
      this.isShowCheckout = true;
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx
      this.loadData()
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
      this.loading = true
      let params = {};
      params = Object.assign({},this.queryform);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getContainerByPage(params)
      .then(res => {
        if (res.head.result == "200") {
          this.pressureVesselData = res.context.list;
          this.pageInfo.pageCount = res.context.total
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        };
        this.loading = false;
      })
    },
    // 确定报废
    sureSubmitScrap(info) {
      let parmas = {
        context: [],
      };
      this.selectedIds.forEach(id => {
        let obj = {
          id: id,
          scrap_date: info.scrap_date,
          scrap_reason: info.scrap_reason
        };
        // obj = this.$outFormData(obj)
        parmas.context.push(obj)
      });
      // console.log(parmas)
      // return
      this.$client.batchScrapeContainer(parmas)
      .then(res => {
        if(res.head.result == '200') {
          this.loadData();
          this.scrapDialogShow = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }

      })
    },
    // 确定批量检验
    sureSubmitBatchCheck(info) {

    },
    // 确定检验单个
    sureSubmitCheck(info) {

    },
    // 编辑、保存信息
    sureSaveInfo(context){

      if(Object.hasOwnProperty.call(context, 'container_vehicle')){
        if(context.container_vehicle.type == 1 || context.container_vehicle.type == 3) {
          if (!Object.hasOwnProperty.call(context.container_vehicle, 'install_date')) {
            delete context.container_vehicle
          }
        }
      }
      if(Object.hasOwnProperty.call(context, 'container_vehicle')){
        if(context.container_vehicle && context.container_vehicle.type == 2) {
          if (!Object.hasOwnProperty.call(context.container_vehicle, 'dismantle_date')) {
            delete context.container_vehicle
          }
        }
      }
      let params = {
        context: context
      };
      this.$client.addContainerInfo(params)
      .then(res => {
        if(res.head.result == '200') {
          // this.form = {};
          if(this.curChangeType == 'add') {
            this.queryform = {};
            this.pageInfo.pageCount = 0;
            this.pageInfo.pageIndex = 1;
          }
          this.loadData();
          this.addDialogShow = false;
          this.$message({
            showClose: true,
            type: 'success',
            message: '保存成功'
          })
        }else{
          this.$message({
            showClose: true,
            type: "error",
            message: res.head.describle
          })
        }
      })
    },
    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.id)
        });
      }
      console.log(this.selectedIds)
    },
    // 计算表格高度
    setHead(type) {
      if(type == 'initialize') {
      this.canRendererTableHeader = this.customSettingList;
    }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
        console.log(this.TableHeight)
      }, 60)
    }
  },
  watch:{
    scrapDialogShow() {
      if(!this.scrapDialogShow) {
        this.selectedIds = [];
        // 清除勾选
        this.$refs.table.handleSelectionChange([]);
      }
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.pressure-vessel-manage
  width 100%
  height 100%
</style>
