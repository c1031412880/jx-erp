<template>
  <div class="passenger-mistakenly-statistics">
    <sub-req ref="head" @on-ok="onSubmit"></sub-req>
    <tr-table
      :indexShow="true"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :loading="loading">
      <template slot-scope="scope" slot="vehicles">
        <span>{{ getDetailsInfo(scope.data,'vehicle_name') }}</span>
      </template>
      <template slot-scope="scope" slot="drivers">
        <span>{{ getDetailsInfo(scope.data,'driver_name') }}</span>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" @click="openMistakenlyAuditHandle(scope.data,'detail')">查看</el-button>
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
  name: "passenger-mistakenly-statistics",
  components: {
    subReq
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
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
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      customSettingList: [
        {
          id: 1,
          label: "制表人",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable:false
        },
        {
          id: 2,
          label: "日期",
          prop: "date",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable:false
        },
        {
          id: 3,
          label: "乘客姓名",
          prop: "passenger_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable:false
        },
        {
          id: 4,
          label: "联系电话",
          prop: "passenger_phone",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable:false,
        },
        {
          id: 5,
          label: "退款金额)",
          prop: "fee",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable:false,
        },
        {
          id: 6,
          label: "退款方式",
          prop: "refund_name",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable:false,
        },
        {
          id: 7,
          label: "退还时间",
          prop: "refund_time",
          width: "180",
          align: "center",
          signIndex: 6,
          sortable:false,
        },
        {
          id: 8,
          label: "服务受理人",
          prop: "handle_user_name",
          width: "180",
          align: "center",
          signIndex: 7,
          sortable:false,
        },
        {
          id: 9,
          label: "3D视频审核确认人",
          prop: "confirm_user_name",
          width: "180",
          align: "center",
          signIndex: 8,
          sortable:false,
        },
        {
          id: 10,
          label: "车牌号",
          prop: "vehicles",
          width: "180",
          align: "center",
          signIndex: 9,
          sortable:false,
        },
        {
          id: 11,
          label: "司机",
          prop: "drivers",
          width: "180",
          align: "center",
          signIndex: 10,
          sortable:false,
        },
        {
          id: 12,
          label: "处理原因",
          prop: "handle_reason",
          width: "180",
          align: "center",
          signIndex: 11,
          sortable:false,
        },
        {
          id: 13,
          label: "身份证号",
          prop: "id_card",
          width: "180",
          align: "center",
          signIndex: 12,
          sortable:false,
        },
        {
          id: 14,
          label: "开户行",
          prop: "bank",
          width: "180",
          align: "center",
          signIndex: 13,
          sortable:false,
        },
        {
          id: 15,
          label: "银行卡号",
          prop: "bank_no",
          width: "180",
          align: "center",
          signIndex: 14,
          sortable:false,
        },
        {
          id: 16,
          label: '操作',
          prop: 'operation',
          width: '120',
          align: 'center',
          signIndex: 15
        }
      ],

    }
  },
  methods: {
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    // 获取数据
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      this.$client.GetByPageMistakeHandle({context:params}).then(res => {
        this.loading = false
        if (res.head.result == "200") {
            this.data =  res.context.list;
            this.pageInfo.pageCount = res.context.total
          } else {
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
    //数据处理获取details信息
    getDetailsInfo(row,type){
      if(row.details.length == 0)  return ''
      let arry = []
      row.details.forEach(item =>{
        arry.push(item[type]);
      })
      return arry.join("、")
    },
    // 乘客误刷处理单
    openMistakenlyAuditHandle(row) {
      let detail_id = 5250, title = '乘客误刷处理单'
      this.$router.push({
        path: `/news-details/${row.id}/${title}/${detail_id}`
      })
    },
    // 计算表格高度
    setHead(type) {
      // if(type == 'initialize') {
      //   this.canRendererTableHeader = this.customSettingList;
      // }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.passenger-mistakenly-statistics {
  height: 100%;
  width: 100%;
}
</style>
