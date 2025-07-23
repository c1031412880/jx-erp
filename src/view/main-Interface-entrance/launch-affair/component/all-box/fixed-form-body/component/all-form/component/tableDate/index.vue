<template>
  <div class="table-date">
    <tr-table
      ref="trTable"
      :data="data"
      :loading="loading"
      :selectionShow="true"
      :reserveSelect="true"
      :TableHeight="TableHeight"
      :tableHeaderList="canRendererTableHeader"
      @on-select-row="onSelectRow"
      @on-select-change-row="selectedUserList">
      <template slot-scope="scope" slot="dept_name">
        <p>{{ scope.data.dept_name ? scope.data.dept_name : scope.data.department}}</p>
      </template>
      <template slot-scope="scope" slot="content">
        <p v-html="scope.data.content"></p>
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
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  components: {  },
  props: {
    currentType: {
      type: String,
      default: 'second'
    },
    approvalFormVisible: {
      type: Boolean,
      default: false
    },
    interType: '',
    relevances: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      rowObj: {},
      workDeal: {
        'first': 'getFinishFlowRecord',
        'second': 'getSubmitFlowRecord',
        'third': 'GetCopyFlowRecord',
        'fourth': 'getWaitFlowRecord',
      },
      // canRendererTableHeader: [
      //   {
      //     id: 1,
      //     label: "申请事由",
      //     prop: "apply_reason",
      //     width: "130",
      //     align: "center",
      //     signIndex: 0,
      //     sortable:false
      //   },
      //   {
      //     id: 2,
      //     label: "申请日期",
      //     prop: "apply_date",
      //     width: "130",
      //     align: "center",
      //     signIndex: 1,
      //     sortable:true
      //   },
      //   {
      //     id: 3,
      //     label: "申请内容",
      //     prop: "apply_content",
      //     width: "120",
      //     align: "center",
      //     signIndex: 2,
      //     sortable:false
      //   },
      //   {
      //     id: 4,
      //     label: "抄送部门",
      //     prop: "copy_dept_names",
      //     width: "160",
      //     align: "center",
      //     signIndex: 3,
      //     sortable:false
      //   },
      //   {
      //     id: 5,
      //     label: "申请人",
      //     prop: "user_name",
      //     width: "120",
      //     align: "center",
      //     signIndex: 4,
      //     sortable:false
      //   },
      //   {
      //     id: 6,
      //     label: "申请部门",
      //     prop: "dept_name",
      //     width: "145",
      //     align: "center",
      //     signIndex: 5,
      //     sortable:false
      //   },
      //   {
      //     id: 7,
      //     label: "审批编号",
      //     prop: "flow_code",
      //     width: "120",
      //     align: "center",
      //     signIndex: 6,
      //     sortable:false
      //   },
      //   {
      //     id: 8,
      //     label: "标题",
      //     prop: "title",
      //     width: "150",
      //     align: "center",
      //     signIndex: 7,
      //     sortable:false
      //   },
      //   {
      //     id: 9,
      //     label: "流程状态",
      //     prop: "state_name",
      //     width: "100",
      //     align: "center",
      //     signIndex: 8,
      //     sortable:false
      //   },
      //   {
      //     id: 10,
      //     label: "发起时间",
      //     prop: "created_date",
      //     width: "150",
      //     align: "center",
      //     signIndex: 9,
      //     sortable:true
      //   },
      //   {
      //     id: 11,
      //     label: "完成时间",
      //     prop: "finish_date",
      //     width: "130",
      //     align: "center",
      //     signIndex: 10,
      //     sortable:true
      //   },
      // ],
      canRendererTableHeader: [
        {
          id: 1,
          label: "审批单类型",
          prop: "object_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable:false
        },
        {
          id: 2,
          label: "标题",
          prop: "title",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable:false
        },
        {
          id: 3,
          label: "内容摘要",
          prop: "content",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable:true
        },
        {
          id: 4,
          label: "申请时间",
          prop: "created_date",
          width: "120",
          align: "center",
          signIndex: 2,
          sortable:false
        },
        {
          id: 5,
          label: "申请人",
          prop: "user_name",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable:false
        },
        {
          id: 6,
          label: "申请部门",
          prop: "dept_name",
          width: "145",
          align: "center",
          signIndex: 5,
          sortable:false
        },
        {
          id: 7,
          label: "审批编号",
          prop: "code",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable:false
        },
        {
          id: 8,
          label: "流程状态",
          prop: "state_name",
          width: "100",
          align: "center",
          signIndex: 8,
          sortable:false
        },
        {
          id: 9,
          label: "发起时间",
          prop: "created_date",
          width: "150",
          align: "center",
          signIndex: 9,
          sortable:true
        },
        {
          id: 10,
          label: "完成时间",
          prop: "finish_date",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable:true
        },
      ],

      selectList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      this.loadData()
    });
  },
  methods: {
    // 获取事务列表
    loadData(form) {
      this.loading = true
      let params = {}
      params = Object.assign({},form)
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      let text = this.workDeal[this.currentType]
      this.$client[text](params).then((res) => {
        this.loading = false;
        if (res.head.result == "200") {
          this.data = JSON.parse(JSON.stringify(res.context.list));
          this.pageInfo.pageCount = res.context.total
          if (this.relevances.length > 0) {
            this.echoSelect()
          }
        } else {
          this.$message({showClose: true, message: res.head.describle, type: "error",});
        }
      }).catch((err) => {
        this.loading = false;
        this.$message({showClose: true, message: err.body.message, type: "error",});
      });
    },
    // 点击某一行
    onSelectRow(row) {
      this.rowObj = Object.assign({}, row)
      // this.$emit('on-click', row)
    },
    // 选中表格勾选框
    selectedUserList(list) {
      this.$emit('on-out', list,this.relevances)
    },
    // 勾选回显
    echoSelect(bool){
      console.log('this.relevances',JSON.parse(JSON.stringify(this.relevances)));
      let arr = []
      this.$nextTick(() => {
        if (bool) {
          this.$refs.trTable.handleSelectionChange([])
        }
        this.relevances.forEach(item => {
          this.data.forEach(child => {
            if (item.code === child.code) {
              item.isClick = true
            } else {
              if (bool) {
                item.isClick = false
              }
            }
          })
          // if (!item.isClick) {
          //   list.push(item)
          // }
          arr = this.data.filter(child => {return item.code === child.code})
          this.$refs.trTable.toggleSelection(arr)
        })

        // list = [...this.selectList,...list]
        // this.$emit('on-out', list)
      })
    },
    // // 重置
    // reset() {
    //   // this.selectApplyList = []
    //   this.$refs.trTable.handleSelectionChange([])
    // },
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
    // 计算表格高度
    setHead() {
      setTimeout(() => {
        if(this.approvalFormVisible) {
          let maxh = this.$el.offsetHeight;
          let paginationH = this.$refs.paginationH.$el.offsetHeight;
          this.TableHeight = maxh - paginationH - 5;
        }
      }, 300);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.table-date
  height: 100%;
  width: 100%;
</style>