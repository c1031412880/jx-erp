<template>
  <div class="online-number">
    <el-card class="content-left">
      <div slot="header" class="clearfix">
        <span>组织架构</span>
      </div>
      <div class="tree-box" :style="{height: TableHeight + 'px'}">
        <el-tree
          ref="deptTree"
          :data="treeData"
          node-key="i_id"
          :props="defaultProps"
          v-loading="treeLoading"
          :highlight-current="true"
          :check-on-click-node="true"
          @node-click="handleNodeClick"
          :default-expanded-keys="defaultKeys"
          :current-node-key="currentNodeKey">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
              <i style="margin-right: 5px; color:#409EFF" :class="data.type ? 'el-icon-office-building' : 'el-icon-user'"></i>
              <span style="margin-right: 25px">{{ node.label }}</span>
            </span>
          </span>
        </el-tree>
      </div>
    </el-card>
    <el-card class="content-right">
      <sub-req
        ref="head"
        @on-ok="onSubmit">

      </sub-req>
      <tr-table
        :selectionShow="false"
        :data="data"
        :loading="loading"
        :TableHeight="TableHeight"
        :tableHeaderList="customSettingList"
        :isShowBottomOptions="false"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="1"
      >
        <template slot-scope="scope" slot="state">
          <span :style="{color: scope.data.state == 1 ? '#94d03b' : '#999'}">{{scope.data.state == 1 ? "在线" : "离线"}}</span>
        </template>
        <template slot-scope="scope" slot="is_gzh">
          <span :style="{ color: scope.data.is_gzh == 2 ?'#94d03b' : '#d9001b'}">{{scope.data.is_gzh == 2 ? "已关注" : "未关注"}}</span>
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
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
export default {
  name: 'online-number',
  components: {
    subReq,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      treeData: [],
      defaultKeys: [],
      currentNodeKey:'',
      treeLoading: false,
      defaultProps: {
        children: "children",
        label: "c_name",
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1, //前几行固定
      customSettingList: [
        {
          id: 1,
          label: "是否在线",
          prop: "state",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "姓名",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "部门",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "职位",
          prop: "position_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "是否关注公众号",
          prop: "is_gzh",
          width: "100",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "最后登录时间",
          prop: "last_login_time",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },

        // {
        //   id: 4,
        //   label: "操作",
        //   prop: "operation",
        //   width: "220",
        //   align: "center",
        //   signIndex: 3,
        //   sortable: false,
        // }
      ],
    }
  },
  activated() {

  },
  mounted() {
    // window.eventOn.$on('load-onLine-tree',() => {
    //   // console.log(this,this.$router, this.$router.currentRoute, this.$router.currentRoute.name);
    //   if(!!this.$router && this.$router.currentRoute.name === 'online-number') {
    //     this.getDepartmentTree()
    //   }
    // })
    this.$nextTick(() => {
      this.setHead()
      this.getDepartmentTree()
    })
  },
  methods: {
    // 获取组织架构
    getDepartmentTree() {
      this.treeLoading = true;
      let params = {
        is_contain_emp: false,
        show_all: false,
        func_type: 0
      };
      this.$client.getOnLineUserEmps(params)
        .then((res) => {
          this.treeLoading = false;
          if (res.head.result === "200") {
            this.treeData = res.context;
            if(this.treeData.length > 0) {
              setTimeout(() => {
                this.currentNodeKey = res.context[0].i_id
                this.defaultKeys.push(res.context[0].i_id)
                this.$refs['deptTree'].setCurrentKey(res.context[0].i_id)
                let node =  this.$refs['deptTree'].getCurrentNode(this.firstCurrentNodeKey)
                this.handleNodeClick(node)
              }, 30)
            }
          }
          this.treeLoading = false;
        })
        .catch((err) => {
          this.treeLoading = false;
        });
    },
    onSubmit(form) {
      this.form = Object.assign(this.form,form)
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData()
    },
    loadData() {
      this.loading = true
      let params = {}
      params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetListOnLineUser(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
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
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 点击树节点
    handleNodeClick(data) {
      console.log('节点点击',data)
      if(!!data.children) delete data.children
      this.form.dept_id = data.i_id
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.$nextTick(() => {
        this.$refs.head.onSubmit()
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
    // 计算表格高度 和初始化表头
    setHead() {
      // this.canRendererTableHeader = this.customSettingList;
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let ph = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - ph - 25 ;
        console.log(maxh, th, ph);
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.online-number {
  height: 100%;
  width: 100%;
  display: flex;
  .content-left {
    width: 320px;
    height: 100%;
    flex: 0 0 320px;
    //overflow: hidden;
    .tree-box{
      height: calc(100% - 72px);
      overflow: auto;
    }
  }
  .content-right {
    flex: 1;
    height: 100%;
  }
  /deep/ .el-card__header {
    background-color: #F5F5F5
  }
  /deep/ .el-card__body {
    padding: 10px;
  }
}
</style>
