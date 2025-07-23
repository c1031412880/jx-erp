<template>
  <div class="fixed-assets-list">
    <el-card class="left-box">
      <div
        slot="header"
        class="clearfix show-flex-box-r"
        style="height: 37px; flex-wrap: nowrap; align-items:center;">
        <span style="white-space:nowrap;">固定资产分类</span>
      </div>
      <div class="tree-list">
        <asset-classification-tree
          ref="organizationTree"
          :placeholder="placeholder"
          :loading="organizationloading"
          :organizationTreeList="organizationTreeList"
          :organizationTreeListLength="organizationTreeListLength"
          @on-tree="selectDepartment"
          @refresh-tree="refreshTreeList"
        ></asset-classification-tree>
      </div>
    </el-card>
    <el-card class="right-box">
      <sub-req
        ref="head"
        @on-ok="onSubmit"
        @on-set="onAlarmSet"></sub-req>
      <tr-table
        :data="data"
        :loading="loading"
        :selectionShow="true"
        :TableHeight="TableHeight"
        :isShowBottomOptions="false"
        :backFixedNum="backFixedNum"
        :tableHeaderList="canRendererTableHeader">
        <template slot-scope="scope" slot="state">
          <div  v-if="scope.data.state == 0">
            <div>
              <p class = "mark" style="background-color: #67C23A;"></p> <span style="color: #999999">{{scope.data.state_name}}</span>
            </div>
          </div>
          <div  v-else-if="scope.data.state == 1">
            <div>
              <p class = "mark" style="background-color: #409EFF;"></p> <span style="color: #999999">{{scope.data.state_name}}</span>
            </div>
          </div>
          <div   v-else-if="scope.data.state == 2">
            <div>
              <p class = "mark" style="background-color: #999999;"></p> <span style="color: #999999">{{scope.data.state_name}}</span>
            </div>
          </div>
          <div   v-else-if="scope.data.state == 3">
            <div>
              <p class = "mark" style="background-color: 	#EE9A00;"></p> <span style="color: #999999">{{scope.data.state_name}}</span>
            </div>
          </div>
          <div   v-else-if="scope.data.state == 4">
            <div>
              <p class = "mark" style="background-color: #0000CD;"></p> <span style="color: #999999">{{scope.data.state_name}}</span>
            </div>
          </div>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-button type="text" size="mini" v-if="$isPowerShow('detail')" @click="upDataBaseInfo(scope.data, 'check')">查看</el-button>
          <el-button type="text" size="mini" v-if="scope.data.state != 2 && $isPowerShow('edit')"  @click="upDataBaseInfo(scope.data, 'edit')">编辑</el-button>
          <el-button type="text" size="mini" v-if="scope.data.state == 0 && $isPowerShow('borrow')" @click="upDataBaseInfo(scope.data, 'borrow')">领用</el-button>
          <el-button type="text" size="mini" v-if="(scope.data.state == 1 || (scope.data.state == 3 && !!scope.data.user_id)) && $isPowerShow('back')" @click="upDataBaseInfo(scope.data, 'back')">归还</el-button>
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
        :total="pageInfo.pageCount">
      </el-pagination>
    </el-card>
    <div class="dialog-box">
      <!-- 报废提醒设置 -->
      <alarm-setting-dialog 
        ref="alarmSet"
        :dialogBool.sync="isShowAlarmSetDialog"
        @save-alarm-set="saveAlarmSet"></alarm-setting-dialog>
      <!-- 查看、编辑、归还、领用 -->
      <assets-info-dialog 
        ref="assetsInfo"
        :curEventType="curEventType"
        @sure-save-info="saveUpdateInfo"
        :dialogBool.sync="isShowAssetsInfoDialog"></assets-info-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import alarmSettingDialog from "./component/dialog/alarm-setting-dialog";
import assetsInfoDialog from "./component/dialog/assets-info-dialog";
import assetClassificationTree from './component/base-info/asset-classification-tree'
export default {
  name: 'fixed-assets-list',
  components: {
    subReq,
    alarmSettingDialog,
    assetsInfoDialog,
    assetClassificationTree,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      data: [],
      form: {},
      loading: false,
      TableHeight: 500,
      backFixedNum: 1,
      placeholder: "请输入关键词",
      organizationloading: false,
      organizationTreeList: [],
      organizationTreeListLength:0,
      curSelectedDepartment:null, //当前选中的组织树节点
      isShowAlarmSetDialog: false,
      title: '编辑',
      dialogVisible: false,
      curEventType: '',
      isShowAssetsInfoDialog: false,
      canRendererTableHeader: [
        {
          id: 1,
          label: "资产编号",
          prop: "assets_code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "当前状态",
          prop: "state",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "资产名称",
          prop: "assets_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "规格型号",
          prop: "model",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "所属类别",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "计量单位",
          prop: "unit_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "资产单价",
          prop: "fee",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "存放地点",
          prop: "address",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "使用部门",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "使用人",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "购买日期",
          prop: "buy_date",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "资产使用年限",
          prop: "time_limit",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "资产报废日期",
          prop: "scrap_date",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "供应商",
          prop: "supplier_name",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "供应商联系人",
          prop: "contact_person",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "供应商电话",
          prop: "contact_phone",
          width: "150",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "备注",
          prop: "remark",
          width: "170",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
        {
          id: 18,
          label: "入库方式",
          prop: "source_name",
          width: "130",
          align: "center",
          signIndex: 17,
          sortable: false,
        },
        {
          id: 19,
          label: "操作",
          prop: "operation",
          width: "160",
          align: "center",
          signIndex: 18,
          sortable: false,
        }
      ]
    }
  },
  mounted() {
    this.loadOrganizationTree();
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 获取资产分组树
    loadOrganizationTree() {
      this.organizationloading = true;
      let params ={}
      params.type = 1
      this.$client.GetGroupAssetsInfo(params)
      .then(res => {
        if (res.head.result == "200") {
          this.organizationTreeList = res.context;
          this.organizationTreeListLength = this.organizationTreeList.length;
          setTimeout(() => {
            this.organizationloading = false;
          }, 600);
        } else {
          this.organizationloading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {})
    },
    // 查询
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    loadData() {
      this.loading = true;
      let params = {
        group_id : this.curSelectedDepartment.id
      }
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      params = Object.assign({},params,this.form)
      this.$client.GetByPageAssetsInfo(params)
      .then(res => {
        if (res.head.result == "200") {
          this.data = res.context.list;
          this.pageInfo.pageCount = res.context.total
          this.loading = false;
        } else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        this.loading = false;
      })
    },
    selectDepartment(departmentInfo) {
      this.curSelectedDepartment = departmentInfo;
      this.$refs.head.onSubmit()
      // this.loadData();
    },
    refreshTreeList() {
      this.loadOrganizationTree();
      // 重新定位到目前组织树中
      this.locationCurNode();
    },
    // 重新定位到目前组织树中
    locationCurNode() {
      let ids= [];
      ids.push(this.curSelectedDepartment.id);
      this.$refs.organizationTree.setSelecedCheckedKeys(ids);
    },
    // 打开提醒设置
    onAlarmSet() {
      this.$client.GetScrapRuleAssetsScrap().then(res => {
        console.log(res);
        if (res.head.result == "200") {
          this.$refs.alarmSet.setData(res.context)
        }
      })
      this.isShowAlarmSetDialog = true
    },
    // 提醒设置保存
    saveAlarmSet(info) {
      let params = {
        context: {}
      }
      params.context = info
      this.$client.SaveScrapRuleAssetsScrap(params).then(res => {
        this.isShowAlarmSetDialog = false
        if (res.head.result == "200") {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData()
    },  
    // 编辑、归还、领用
    upDataBaseInfo(row, type) {
      this.curEventType = type
      this.$refs.assetsInfo.setData(row)
      this.isShowAssetsInfoDialog = true
    },
    // 保存编辑
    saveUpdateInfo(info) {
      console.log(this.curEventType);
      switch (this.curEventType) {
        case 'edit':
          this.saveEditInfo(info)
          break;
        case 'borrow':
          this.saveBorrowInfo(info)
          break;
        case 'back':
          this.saveBackInfo(info)
          break;
      }
    },
    saveEditInfo(val) {
      let params = {}
      params.context = Object.assign({}, val)
      this.$client.SetRecordAssetsInfo(params)
      .then(res => {
        if (res.head.result == "200") {
          this.isShowAssetsInfoDialog = false
          this.$message({
            showClose: true,
            message: '保存成功',
            type: "success",
          });
          this.loadData()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    saveBorrowInfo(val) {
      let params = {
        context: {}
      }
      params.context = Object.assign({}, val)
      params.context.borrow_date = val.date
      params.context.assets_id = val.id
      this.$client.ReceiveAssetsAssetsInfo(params)
      .then(res => {
        if (res.head.result == "200") {
          this.isShowAssetsInfoDialog = false
          this.$message({
            showClose: true,
            message: '领用成功',
            type: "success",
          });
          this.loadData()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    saveBackInfo(val) {
      let params = {}
      params.context = Object.assign({}, val)
      params.context.back_date = val.date
      params.context.assets_id = val.id
      this.$client.BackAssetsAssetsInfo(params)
      .then(res => {
        if (res.head.result == "200") {
          this.isShowAssetsInfoDialog = false
          this.$message({
            showClose: true,
            message: '归还成功',
            type: "success",
          });
          this.loadData()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 计算表格高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH - 50;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.fixed-assets-list
  height: 100%
  width: 100%
  display: flex
  .left-box
    height: 100%
    width: 300px
    /deep/ .el-card__body
      height: calc(100% - 61px)
      overflow: auto
    /deep/ .el-card__header
      background-color: #F5F5F5
      padding: 12px 20px
  .right-box
    flex: 1
    margin-left: 10px
.mark
  width: 7px
  height: 7px
  border-radius:20px
  display: inline-block
  margin-bottom: 2px
</style>