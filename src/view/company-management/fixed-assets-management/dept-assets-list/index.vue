<template>
  <div class="fixed-assets-list">
    <el-card class="left-box">
      <div
        slot="header"
        class="clearfix show-flex-box-r"
        style="height: 37px; flex-wrap: nowrap; align-items:center;">
        <span style="white-space:nowrap;">部门资产</span>
      </div>
      <div class="tree-list">
        <dept-assets-tree
          ref="organizationTree"
          :placeholder="placeholder"
          :loading="organizationloading"
          :organizationTreeList="organizationTreeList"
          :organizationTreeListLength="organizationTreeListLength"
          @on-tree="selectDepartment"
          @refresh-tree="refreshTreeList"
        ></dept-assets-tree>
      </div>
    </el-card>
    <el-card class="right-box">
      <sub-req
        ref="head"
        @on-ok="onSubmit"></sub-req>
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
              <p class = "mark" style="background-color: 	#EE9A00;"></p> <span style="color: 	#999999">{{scope.data.state_name}}</span>
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
import deptAssetsTree from './component/dept-assets-tree'
export default {
  name: 'fixed-assets-list',
  components: {
    subReq,
    deptAssetsTree,
  },
  props: {
    currentType: {
      type: String,
      default: 'first'
    }
  },
  watch: {
    currentType(val) {
      // console.log(val);
      if(val == 'second') {
        this.setHead()
      }
    }
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
          width: "150",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "资产单价",
          prop: "fee",
          width: "170",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "存放地点",
          prop: "address",
          width: "170",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "使用部门",
          prop: "dept_name",
          width: "170",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "使用人",
          prop: "user_name",
          width: "170",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "购买日期",
          prop: "buy_date",
          width: "170",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "资产使用年限",
          prop: "time_limit",
          width: "170",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "资产报废日期",
          prop: "scrap_date",
          width: "170",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "备注",
          prop: "remark",
          width: "170",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "入库方式",
          prop: "source_name",
          width: "170",
          align: "center",
          signIndex: 14,
          sortable: false,
        }
      ]
    }
  },
  mounted() {
    this.loadOrganizationTree();
    this.$nextTick(() => {
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 获取资产分组树
    loadOrganizationTree() {
      this.organizationloading = true;
      this.$client.GetDeptGroupAssetsInfo()
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
        dept_id : this.curSelectedDepartment.i_id
      }
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      params = Object.assign({},params,this.form)
      this.$client.GetByPageAssetsInfo(params)
      .then(res => {
        if (res.head.result == "200") {
          this.data = res.context.list;
          this.pageInfo.pageCount = res.context.total
          setTimeout(() => {
            this.loading = false;
          }, 800);
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
      console.log(departmentInfo);
      this.curSelectedDepartment = departmentInfo;
      this.loadData();
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
    // 计算表格高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH - 40;
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
    height: 100%
    margin-left: 10px
.mark
  width: 7px
  height: 7px
  border-radius:20px
  display: inline-block
  margin-bottom: 2px
</style>