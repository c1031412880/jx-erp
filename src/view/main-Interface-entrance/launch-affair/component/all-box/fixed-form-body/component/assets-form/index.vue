<template>
  <div class="asset-classification">
    <el-card class="left-box">
      <asset-classification-tree
        ref="organizationTree"
        :placeholder="placeholder"
        :loading="organizationloading"
        :organizationTreeList="organizationTreeList"
        :organizationTreeListLength="organizationTreeListLength"
        @on-tree="selectDepartment"
        @refresh-tree="refreshTreeList"
      ></asset-classification-tree>
    </el-card>
    <el-card class="right-box">
      <sub-req
        ref="head"
        :curType="curType"
        @on-ok="onSubmit"
        @on-add="sureSelectInfo"
        @on-clear="onClearSelectList"></sub-req>
      
      <div class="show-box">
        <span>已选资产：</span>
        <div class="title-tag">
          <el-tag style="margin: 0 5px" size="mini" effect="dark" type="success" v-for="item in selectedList" :key="item.id">{{item.assets_name}}</el-tag>
        </div>
      </div>
      <tr-table
        ref="trTable"
        :data="data"
        :loading="loading"
        :reserveSelect="true"
        :selectionShow="true"
        :TableHeight="TableHeight"
        :isShowBottomOptions="false"
        :tableHeaderList="canRendererTableHeader"
        @on-select-change-row="selectedUserList">
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
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import assetClassificationTree from './component/asset-classification-tree'
export default {
  name: "asset-classification",
  components: {
    subReq,
    assetClassificationTree,
  },
  props: {
    curType: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      placeholder: "请输入关键词",
      organizationloading: false,
      organizationTreeList: [],
      organizationTreeListLength:0,
      curSelectedDepartment:null, //当前选中的组织树节点

      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      selectedList: [],
      canRendererTableHeader: [],
      first: [
        {
          id: 1,
          label: "资产名称",
          prop: "assets_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "规格型号",
          prop: "model",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "所属类别",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "计量单位",
          prop: "unit_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "资产单价",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 7,
          label: "品牌",
          prop: "brand",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 6,
          label: "供应商",
          prop: "supplier_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
      ],
      second: [
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
          id: 18,
          label: "品牌",
          prop: "brand",
          width: "130",
          align: "center",
          signIndex: 17,
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
      ]
    }
  },
  mounted() {
    this.loadOrganizationTree();
    this.$nextTick(() => {
      this.setHead();
      this.canRendererTableHeader = this.curType ? this.second : this.first
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 刷新资产分组
    refreshTreeList() {
      // this.loading = true;
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
    // 获取资产分组树
    loadOrganizationTree() {
      this.organizationloading = true;
      let params ={}
      params.type = 1
      let title = this.curType ? 'GetGroupAssetsInfo' : 'GetGroupAssetsType'
      this.$client[title](params)
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
    // 选择某一组织
    selectDepartment(departmentInfo) {
      this.curSelectedDepartment = departmentInfo;
      this.loadData(true)
    },
    // 查询
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 获取资产列表
    loadData() {
      this.loading = true;
      let params = {
        group_id: this.curSelectedDepartment.id
      }
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      params = Object.assign({},params,this.form)
      let title = this.curType ? 'GetByPageAssetsInfo' : 'GetByPageAssetsType'
      this.$client[title](params)
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
    // 选中
    selectedUserList(list) {
      // console.log(list);
      this.selectedList = list
    },
    // 清空用户选中
    onClearSelectList() {
      this.$refs.trTable.handleSelectionChange([])
    },
    // 给父级页面提供选中数据
    sureSelectInfo() {
      if(!this.selectedList.length) {
        this.$message({
          showClose: true,
          message: '请选择资产',
          type: "error",
        });
        return
      }
      this.$emit('set-info', this.selectedList)
      this.onClearSelectList()
    },
    // 计算表格高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH - 70;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.asset-classification
  height: 90vh
  width: 100%
  display: flex;
  .left-box
    height: 100%;
    width: 300px;
  .right-box
    flex: 1;
    height: 100%;
    margin-left: 10px;
    .show-box
      width: 100%;
      height: 20px;
      display: flex;
      margin-bottom: 10px;
      align-items: center;
      .title-tag
        flex: 1; 
        overflow: hidden;
.mark
  width: 7px
  height: 7px
  border-radius:20px
  display: inline-block
  margin-bottom: 2px
</style>