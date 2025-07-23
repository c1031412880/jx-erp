<template>
  <div class="table-date">
    <sub-req
      ref="head"
      :currentType="currentType"
      @on-ok="onSubmit">

    </sub-req>
    <tr-table
      :data="data"
      :loading="loading"
      :TableHeight="TableHeight"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :tableHeaderList="currentType == 'first' ? firstCanRendererTableHeader : secondCanRendererTableHeader">
      <template slot-scope="scope" slot="operation">
          <el-button type="text" size="mini">查看</el-button>
          <el-button type="text" size="mini" v-if="currentType == 'second'">编辑</el-button>
          <el-button type="text" size="mini">预览</el-button>
          <el-button type="text" size="mini" v-if="currentType == 'second'">发布</el-button>
          <el-button type="text" size="mini" v-if="currentType == 'second'">重新发起</el-button>
            <!-- v-if="$isPowerShow('delete')" -->
            <!-- @confirm="onDelete(scope.data.id)" -->
          <el-popconfirm
             v-if="currentType == 'second'"
            title="确定删除吗？">
            <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;">删除</el-button>
          </el-popconfirm>
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
import subReq from "./sub-req";
export default {
  components: {
    subReq,
  },
  props: {
    currentType: {
      type: String,
      default: 'second'
    }
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
      backFixedNum: 1,
      frontFixedNum: 0,
      firstCanRendererTableHeader: [
        {
          id: 1,
          label: "活动标题",
          prop: "title",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "开始时间",
          prop: "start_time",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "结束时间",
          prop: "end_time",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "活动状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "活动参与人",
          prop: "activity_names",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "活动地点",
          prop: "address",
          width: "150",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "组织部门",
          prop: "dept_names",
          width: "150",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "操作",
          prop: "operation",
          width: "180",
          align: "center",
          signIndex: 7,
          sortable: false,
        }
      ],
      secondCanRendererTableHeader: [
        {
          id: 1,
          label: "活动标题",
          prop: "title",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "开始时间",
          prop: "start_time",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "结束时间",
          prop: "end_time",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "活动审批状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "活动发布状态",
          prop: "is_public",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "活动状态",
          prop: "address",
          width: "150",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "活动参与人",
          prop: "activity_names",
          width: "150",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "活动地点",
          prop: "address",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "组织部门",
          prop: "dept_names",
          width: "150",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "负责人",
          prop: "duty_names",
          width: "150",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "活动内容",
          prop: "content",
          width: "150",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "创建人",
          prop: "create_name",
          width: "150",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
        {
          id: 13,
          label: "创建时间",
          prop: "created_date",
          width: "150",
          align: "center",
          signIndex: 12,
          sortable: true,
        },
        {
          id: 14,
          label: "操作",
          prop: "operation",
          width: "280",
          align: "center",
          signIndex: 13,
          sortable: false,
        }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 提交查询
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    // 获取事务列表
    loadData() {
      this.loading = true
      let params = {
        context: {}
      }
      params.context = Object.assign({},this.form)
      params.context.page_index = this.pageInfo.pageIndex
      params.context.page_size = this.pageInfo.pageSize
      this.$client.GetByPageActivityManage(params).then((res) => {
        this.loading = false;
        if (res.head.result == "200") {
          this.data = JSON.parse(JSON.stringify(res.context.list));
          this.pageInfo.pageCount = res.context.total
        } else {
          this.$message({showClose: true, message: res.head.describle, type: "error",});
        }
      }).catch((err) => {
        this.loading = false;
        this.$message({showClose: true, message: err.body.message, type: "error",});
      });
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
    // 计算表格高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH - 5;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.table-date
  height: 100%
  width: 100%
</style>