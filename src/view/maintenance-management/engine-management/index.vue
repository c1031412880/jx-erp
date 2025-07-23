<template>
  <div class="engine-management">
    <div class="engine-management-content">
      <sub-req
        ref="head"
        @on-add="addInfo"
        @on-ok="onSubmit"
        @on-export="exportFile"
        @on-screen="onScreen"
        @on-delete="onDelete"
        @on-scrap="batchScrap"
      ></sub-req>

      <tr-table
        ref="table"
        :selectionShow="true"
        :data="engineData"
        :tableHeaderList="canRendererTableHeader"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        @on-select-change-row="selectedList"
      >
        <template slot-scope="scope" slot="vehicle_plate_number">
          <el-button type="text" size="mini" @click="jumpVehInfoPage(scope.data)">
            {{ scope.data.vehicle_plate_number }}
          </el-button>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-button
            type="primary"
            size="mini"
            @click="editInfo(scope.data, 'edit')"
            v-if="$isPowerShow('edit')"
          >
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="editInfo(scope.data, 'detail')">
            查看
          </el-button>
          <el-button
            type="danger"
            size="mini"
            @click="onScrap(scope.data)"
            :disabled="scope.data.i_state != 2"
            v-if="$isPowerShow('scrap')"
          >
            {{ scope.data.i_state == 3 ? '已废' : '报废' }}
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
        :iState="iState"
        :detailLoading="detailLoading"
        @sure-save-info="sureSaveInfo"
      ></add-dialog>
      <!-- 报废弹窗 -->
      <scrap-dialog
        ref="scrapDialog"
        :showScrapTitle="showScrapTitle"
        :dialogBool.sync="scrapDialogShow"
        @sure-submit-scrap="sureSubmitScrap"
      ></scrap-dialog>
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

export default {
  name: "engine-management",
  components: {
    subReq,
    AddDialog,
    scrapDialog,
    drawerDialog,
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
      engineData: [], //发动机列表
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      addDialogShow: false, //添加信息
      scrapDialogShow: false, //报废弹窗
      isShowDrawerDialog: false, //是否显示高级筛选
      customSettingVialogVisible: false,
      customSettingList:[
        {
          id: 1,
          label: "发动机编号",
          prop: "c_code",
          width: "130",
          align: "center",
          signIndex:0,
          sortable:true
        },
        {
          id: 2,
          label: "发动机类型",
          prop: "engine_type",
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
          label: "单价(元)",
          prop: "n_price",
          width: "120",
          align: "center",
          signIndex:3,
          sortable:true
        },
        {
          id: 5,
          label: "购买日期",
          prop: "d_buy",
          width: "130",
          align: "center",
          signIndex:4,
          sortable:true
        },
        {
          id: 6,
          label: "品牌",
          prop: "engine_band",
          width: "120",
          align: "center",
          signIndex:5,
          sortable:false
        },
        {
          id: 7,
          label: "厂牌",
          prop: "engine_firm",
          width: "150",
          align: "center",
          signIndex:6,
          sortable:false
        },
        {
          id: 8,
          label: "燃油种类",
          prop: "oil_type",
          width: "100",
          align: "center",
          signIndex:7,
          sortable:false
        },
        {
          id: 9,
          label: "保修截止日期",
          prop: "d_repair",
          width: "150",
          align: "center",
          signIndex:8,
          sortable:true
        },
        {
          id: 10,
          label: "关联车辆",
          prop: "vehicle_plate_number",
          width: "130",
          align: "center",
          signIndex:9,
          sortable:true
        },
        {
          id: 11,
          label: "状态",
          prop: "state",
          width: "135",
          align: "center",
          signIndex:10,
          sortable:false
        },
        {
          id: 12,
          label: "备注",
          prop: "c_remark",
          width: "140",
          align: "center",
          signIndex:11,
          sortable:false
        },
        {
          id: 13,
          label: "操作",
          prop: "operation",
          width: "220",
          align: "center",
          signIndex:12,
          sortable:false
        }
      ],
      frontFixedNum:2, //前几行固定
      backFixedNum:1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      detailLoading: false,
      curSelectedId: '', // 当前选中的发动机ID
      selectedIds:[], //勾选的ID
      showScrapTitle:'',//报废弹窗头部
      iState: "", //状态
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
    // 跳转车辆信息页面
    jumpVehInfoPage(info){
      this.$router.push({
        name:'vehinfo-manage',
        params:{
          name: info.vehicle_plate_number
        }
      })
    },
    // 导出Excel
    exportFile(){
      let params = Object.assign({},this.queryform);
      let ids = [ ...this.selectedIds ]
      if (ids.length) {
        params.ids = ids.toString()
      }
      this.$client.exportEngineInfo(params)
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
          message: '请勾选至少一条要移除的发动机',
          type: "warning",
        });
        return
      }

      let parmas = {
        context: this.selectedIds,
      };
      this.$client.batchDeleteEngine(parmas)
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
          message: '请勾选至少一条要报废的发动机',
          type: "warning",
        });
        return
      }
      this.selectedIds.forEach(id => {
        this.engineData.forEach(item => {
          if(id == item.i_id) {
            if(item.i_state != 2) {
              isCanScrap = false;
              return
            }
          }
        });
      });
      if(!isCanScrap) {
        this.$message({
          showClose: true,
          message: '只要闲置状态下的发动机才能报废',
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
      this.selectedIds.push(row.i_id);
      this.scrapDialogShow = true;
      this.showScrapTitle = `报废(编号：${row.c_code})`
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
    // 表格上点击编辑、查看 获取详情
    editInfo(val,type){
      // console.log(val,type,'选中');
      this.iState= val.i_state;
      this.addDialogShow = true;
      this.curChangeType = type;
      this.detailLoading = true;
      let params ={
        i_id: val.i_id
      };
      this.$client.getEngineManageDetail(params)
      .then(res => {
        if(res.head.result == '200') {
          res.context.i_id = val.i_id;
          this.$refs['addDialog'].setData(res.context)
          this.detailLoading = false;
        }else{
          this.$message({type: 'error', message: res.head.describle})
        }
      })
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
      this.$client.getEngineManage(params)
      .then(res => {
        if (res.head.result == "200") {
          this.engineData = res.context.list;
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
        context: {
          d_scrap: info.d_scrap,
          c_scrap_reason: info.c_scrap_reason,
          ids: this.selectedIds
        }
      };

      this.$client.batchScrapEngine(parmas)
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
          this.selectedIds = [];
        }

      })
    },
    // 编辑、保存信息
    sureSaveInfo(context){
      let params = {
        context: context
      };
      this.$client.AddEngineManageInfo(params)
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
          this.selectedIds.push(item.i_id)
        });
      }
    },
    // 计算表格高度
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
        this.customSettingShowList = this.customSettingList;
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
.engine-management
  width 100%
  height 100%
</style>
