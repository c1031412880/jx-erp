<template>
  <div class="outside-repair-management">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-add="addInfo"
      @on-delete="onDelete"
      @on-export="exportFile"
    ></sub-req>
    <table-data
      ref="table"
      :data="repairData"
      :loading="loading || headerLoading"
      :selectionShow="true"
      :TableHeight="TableHeight"
      :tableHeaderList="canRendererTableHeader"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :isShowSummary="isShowSummary"
      :omitColumnIndex="[2]"
      @on-select-change-row="selectedList"
    >
      <template slot-scope="scope" slot="state">
        <div v-if="scope.data.state == 1">
          <div style="color: #d71345">
            <p class="mark" style="background-color: #d71345"></p>
            <span>{{ scope.data.state_name }}</span>
          </div>
        </div>
        <div v-else-if="scope.data.state == 2">
          <div style="color: #18be6b">
            <p class="mark" style="background-color: #18be6b"></p>
            <span>{{ scope.data.state_name }}</span>
          </div>
        </div>
        <div v-else-if="scope.data.state == 3">
          <div style="color: #c88400">
            <p class="mark" style="background-color: #c88400"></p>
            <span>{{ scope.data.state_name }}</span>
          </div>
        </div>
        <div v-else-if="scope.data.state == 4">
          <div style="color: #ffc20e">
            <p class="mark" style="background-color: #ffc20e"></p>
            <span>{{ scope.data.state_name }}</span>
          </div>
        </div>
        <div v-else-if="scope.data.state == 5">
          <div style="color: #409eff">
            <p class="mark" style="background-color: #409eff"></p>
            <span>{{ scope.data.state_name }}</span>
          </div>
        </div>
        <div v-else-if="scope.data.state == 6">
          <div style="color: #77787b">
            <p class="mark" style="background-color: #77787b"></p>
            <span>{{ scope.data.state_name }}</span>
          </div>
        </div>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="primary" size="mini" @click="addEditInfo(scope.data, 'edit')">
          编辑
        </el-button>
        <el-button type="primary" size="mini" @click="addEditInfo(scope.data, 'detail')">
          详情
        </el-button>
        <el-popconfirm title="是否确认删除该工单？" @confirm="onDelete(scope.data)">
          <el-button type="primary" size="mini" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
    </table-data>
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
    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
    <information-dialog
      ref="addDialog"
      :curChangeType="curChangeType"
      :dialogBool.sync="informationDialogShow"
    ></information-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from './component/sub-req'
import tableData from '@/components/tableHeadercustomSetting/tr-table'
import informationDialog from './component/information-dialog'
export default {
  name: 'outside-repair-management',
  components: {
    subReq,
    tableData,
    informationDialog,
    informationDialog
  },
  data() {
    return {
      pageInfo: {
          pageIndex: 1,
          pageSize: 20,
          pageCount: 0
      },
      queryform: {},
      repairData: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 2,
      backFixedNum: 1,
      isShowSummary: true,
      informationDialogShow: false,
      canRendererTableHeader: null,
      customSettingShowList: null,
      customSettingVialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "工单号码",
          prop: "order_code",
          width: "120",
          align: "center",
          signIndex:0,
          sortable:false
        },
        {
          id: 2,
          label: "车牌号",
          prop: "vehicle_name",
          width: "120",
          align: "center",
          signIndex:1,
          sortable:false
        },
        {
          id: 3,
          label: "工单状态",
          prop: "state",
          width: "120",
          align: "center",
          signIndex:2,
          sortable:false
        },
        {
          id: 4,
          label: "自编号",
          prop: "vehicle_number",
          width: "120",
          align: "center",
          signIndex:3,
          sortable:false
        },
        {
          id: 5,
          label: "所属组织",
          prop: "department",
          width: "120",
          align: "center",
          signIndex:4,
          sortable:false
        },
        {
          id: 6,
          label: "车辆型号",
          prop: "vehicle_kind",
          width: "160",
          align: "center",
          signIndex:5,
          sortable:false
        },
        {
          id: 7,
          label: "登记时间",
          prop: "string_repair_time",
          width: "160",
          align: "center",
          signIndex:6,
          sortable:false
        },
        {
          id: 8,
          label: "维修工单号",
          prop: "order_number",
          width: "160",
          align: "center",
          signIndex:7,
          sortable:false
        },
        {
          id: 9,
          label: "报修内容",
          prop: "repair_content",
          width: "140",
          align: "center",
          signIndex:8,
          sortable:false
        },
        {
          id: 10,
          label: "送修单位",
          prop: "repair_unit_name",
          width: "140",
          align: "center",
          signIndex: 9,
          sortable:false
        },
        {
          id: 11,
          label: "维修项目",
          prop: "repair_item",
          width: "140",
          align: "center",
          signIndex: 10,
          sortable:false
        },
        {
          id: 12,
          label: "工时费",
          prop: "hour_fee",
          width: "120",
          align: "center",
          signIndex:11,
          sortable:false
        },
        {
          id: 13,
          label: "附件项目",
          prop: "annex_item",
          width: "120",
          align: "center",
          signIndex:12,
          sortable:false
        },
        {
          id: 14,
          label: "附加费",
          prop: "annex_fee",
          width: "120",
          align: "center",
          signIndex:13,
          sortable:false
        },
        {
          id: 15,
          label: "材料费",
          prop: "material_fee",
          width: "120",
          align: "center",
          signIndex:14,
          sortable:false
        },
        {
          id: 16,
          label: "总费用",
          prop: "total_fee",
          width: "120",
          align: "center",
          signIndex:15,
          sortable:false
        },
        {
          id: 17,
          label: "进厂时间",
          prop: "string_finish_time",
          width: "160",
          align: "center",
          signIndex:16,
          sortable:false
        },
        {
          id: 18,
          label: "出厂时间",
          prop: "string_out_time",
          width: "160",
          align: "center",
          signIndex:17,
          sortable:false
        },
        {
          id: 19,
          label: "工单备注",
          prop: "order_remark",
          width: "140",
          align: "center",
          signIndex:18,
          sortable:false
        },
        {
          id: 20,
          label: "操作人",
          prop: "update_name",
          width: "120",
          align: "center",
          signIndex:19,
          sortable:false
        },
        {
          id: 21,
          label: "操作时间",
          prop: "string_update_date",
          width: "160",
          align: "center",
          signIndex:20,
          sortable:false
        },
        {
          id: 22,
          label: "操作",
          prop: "operation",
          width: "240",
          align: "center",
          signIndex:21,
          sortable:false
        },
      ],
      selectedIds: [], //选中的行ID
      curChangeType: 'add', //add添加  edit编辑  detail详情
      titlesId:'', //当前表头的id
      menu_code:'',
      headerLoading: false
    }
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      this.loadData()
    });
  },
  methods: {
    // 更新表格头部
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
    //点击添加
    addInfo(type) {
      this.curChangeType = type
      this.informationDialogShow = true
    },
    // 添加信息
    saveAddInfo(form) {
      let params = {
        context: form
      }
      // console.log(params);
      // return
      this.$client.addMaintRepairOut(params)
      .then(res => {
        if(res.head.result == '200'){
          this.informationDialogShow = false
          this.$message({
            showClose: true,
            type: 'success',
            message: '添加外修信息成功'
          })
          this.$refs.head.onSubmit();
        }else {
          this.$message({
            showClose: true,
            type: "error",
            message: res.head.describle
          })
        }
      })
    },
    //点击编辑详情
    addEditInfo(val, type) {
      this.curChangeType = type
      let params = {}
      params.id = val.id
      this.$client.lookMaintRepairOut(params)
      .then(res => {
        if(res.head.result == '200') {
          this.$refs.addDialog.setData(res.context)
          setTimeout(() => {
            this.informationDialogShow = true
          }, 300);
        }else {
          this.$message({
            showClose: true,
            type: 'error',
            message: '获取信息失败'
          })
        }
      })
    },
    // 编辑
    saveEditInfo(form) {
      let params = {
        context: form
      }
      this.$client.updateMaintRepairOut(params)
      .then(res => {
        if(res.head.result == '200'){
          this.informationDialogShow = false
          this.$message({
            showClose: true,
            type: 'success',
            message: '编辑外修信息成功'
          })
          this.$refs.head.onSubmit();
        }else {
          this.$message({
            showClose: true,
            type: "error",
            message: res.head.describle
          })
        }
      })
    },
    // 查询
    onSubmit(form) {
      this.queryform = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 导出
    exportFile() {
      let params = {};
      params = Object.assign({}, this.queryform);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      let ids = [ ...this.selectedIds ]
      if (ids.length) {
        params.ids = ids.toString()
      }
      this.$client.exportMaintRepairOut(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      }).catch(err => console.log(err))
    },
    // 加载数据
    loadData() {
      this.loading = true
      let params = {};
      params = Object.assign({}, this.queryform);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getByPageRepairOut(params)
      .then(res => {
        if (res.head.result == "200") {
          this.repairData = res.context.list;
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
     // 删除
    onDelete(info) {
      let params = {
        context: []
      };
      if(!!info) {
        this.selectedIds = []
        this.selectedIds.push(info.id)
        params.context = this.selectedIds
      }else {
        params.context = this.selectedIds
      }
      if (this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: "请勾选至少一条要移除的",
          type: "warning"
        });
        return;
      }
      // console.log('确定要删除id为' + params.context + '数据吗？');
      // this.selectedIds = []
      // return
      this.$client.deleteMaintRepairOut(params).then(res => {
        if (res.head.result == "200") {
          this.selectedIds = [];
          this.$refs.head.onSubmit();
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success"
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success"
          });
        }
      });
    },
    // 选中行ID
    selectedList(selectedList) {
      this.selectedIds = []
      selectedList.forEach(item => {
        this.selectedIds.push(item.id)
      })
      // console.log(this.selectedIds);
    },
    // 打开自定义表格头部弹窗
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 更新表格头部
    // updateTableHeader(newestTableHeaderList) {
    //   this.canRendererTableHeader = null;
    //   this.canRendererTableHeader = newestTableHeaderList;
    //   this.$forceUpdate();
    // },
    // 分页切换事件
    handleCurrentChange(val) {
      this.pageInfo.pageIndex = val
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(val) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = val;
      this.pageInfo.pageCount = 0;
      this.loadData()
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
      }, 60)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.outside-repair-management {
  width: 100%
  height: 100%

  .mark {
    width: 5px
    height: 5px
    border-radius: 20px
    display: inline-block
    margin-bottom: 2px
  }

}
</style>
