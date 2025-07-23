<template>
  <div class="leaving-approval">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
    ></sub-req>

    <tr-table
      :data="data"
      :loading="loading"
      :selectionShow="true"
      :TableHeight="TableHeight"
      :backFixedNum="backFixedNum"
      :isShowBottomOptions="false"
      :frontFixedNum="frontFixedNum"
      :tableHeaderList="canRendererTableHeader">
      <template slot-scope="scope" slot="state_child_name">
        <span :style="scope.data.state | outStateColor">{{scope.data.state === 1 ? scope.data.state_child_name : scope.data.state_name}}</span>
      </template>
      <template slot-scope="scope" slot="content">
        <p v-html="scope.data.content"></p>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" @click="detailsPush(scope.data)">查看</el-button>
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
import subReq from "./component/sub-req";
export default {
  name: 'leaving-approval',
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
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingList: [
        {
          id: 1,
          label: "标题",
          prop: "title",
          width: "200",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "内容摘要",
          prop: "content",
          width: "200",
          align: "center",
          signIndex: 1,
          sortable: false,
          notTooltip: true
        },
        {
          id: 3,
          label: "发起人",
          prop: "created_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "发起时间",
          prop: "created_date",
          width: "160",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "完成时间",
          prop: "finish_date",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "流程状态",
          prop: "state_child_name",
          width: "160",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "操作",
          prop: "operation",
          width: "180",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
      ],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 查询
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.state = 1
      params.form_id = [1350]
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getListFlowRecord(params)
        .then(res => {
          // console.log(JSON.stringify(res));
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
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    detailsPush(row) {
      let title = '代办事项:离职退休申请'
      this.$router.push({
        path: `/news-details/${row.detail_id}/${title}/${row.object_id}`
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
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let ph = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - ph - 14;
      }, 60);
    },
  },
  filters: {
    outStateColor(code) {
        let color
        switch (code) {
          case 1:
            color = '#E6A23C'
            break;
          case 2:
            color = '#67C23A'
            break;
          case 3:
            color = '#F56C6C'
            break;
          case 4:
            color = '#909399'
            break;       
          default:
            color = '#909399'
            break;
        }
        return `color: ${color}`
      },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.leaving-approval
  height: 100%
  width: 100%
</style>