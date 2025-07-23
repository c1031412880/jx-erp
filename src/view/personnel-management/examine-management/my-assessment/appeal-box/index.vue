<template>
  <div class="assessment-appeal">
    <sub-req
      ref="head"
      @on-ok="onSubmit">
    </sub-req>
    <tr-table
      :data="data"
      :tableHeaderList="customSettingList"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    > 
      <template slot-scope="scope" slot="appeal_state">
        <span :style="getColor(scope.data.appeal_state)">{{scope.data.appeal_state_name}}</span>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" style="margin-left: 10px;" @click="showDetails(scope.data)">考核详情</el-button>
        <el-popconfirm
          v-if="scope.data.exam_state == 4"
          @confirm="representations(scope.data)"
          title="是否确认取消申述?">
          <el-button  slot="reference" type="text" size="mini" style="margin-left: 10px;">取消申诉</el-button>
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
      :total="pageInfo.pageCount"
    >
    </el-pagination>
    <!-- 明细弹窗 -->
    <show-info-dialog
      ref="showInfoDialog"
      :dialogBool.sync="isShowSetInfoDialog"
      :tableHeaderList="showInfoTableHeader"
      :curSelecedType="'detail'">
    </show-info-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import showInfoDialog from "./component/show-info-dialog"
import { getUser } from "@/utils/auth";
export default {
  name: 'assessment-appeal',
  components: {
    subReq,
    showInfoDialog,
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
      selectedIds:[],
      frontFixedNum: 0, //前几行固定
      backFixedNum: 1, //后几行固定

      index: null,
      dialogVisible: false,
      formData: {
      },
      rules: {},

      detailVisible: false,
      detailData: [],
      customSettingList: [
        {
          id: 1,
          label: "考核名称",
          prop: "exam_name",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "申诉人名称",
          prop: "appeal_name",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "评分人",
          prop: "exam_score_person",
          width: "130",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "考核得分",
          prop: "exam_score",
          width: "130",
          align: "center",
          signIndex: 3,
        },
        // {
        //   id: 5,
        //   label: "申述理由",
        //   prop: "appeal_reason",
        //   width: "130",
        //   align: "center",
        //   signIndex: 4,
        // },
        {
          id: 6,
          label: "申诉时间",
          prop: "appeal_time",
          width: "120",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "处理状态",
          prop: "appeal_state",
          width: "120",
          align: "center",
          signIndex: 6,
        },
        // {
        //   id: 8,
        //   label: "处理结果",
        //   prop: "result_name",
        //   width: "120",
        //   align: "center",
        //   signIndex: 7,
        // },
        {
          id: 9,
          label: "最终考核得分",
          prop: "last_score",
          width: "120",
          align: "center",
          signIndex: 8,
        },
        // {
        //   id: 10,
        //   label: "处理意见",
        //   prop: "deal_reason",
        //   width: "120",
        //   align: "center",
        //   signIndex: 9,
        // },
        {
          id: 11,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 10,
        },
      ],
      isShowSetInfoDialog: false,

      appealDialog:false,
      appealType: 'detail',
      userId: 0,

      showInfoTableHeader: [
        {
          id: 1,
          label: "指标分类",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "考核内容",
          prop: "content",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "指标值及要求",
          prop: "demand",
          width: "200",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "标准分值",
          prop: "score",
          width: "100",
          align: "center",
          signIndex:3,
          nestedTablesHeader: [
            {
              id: 101,
              label: "明细",
              prop: "score",
              width: "80",
              align: "center",
              signIndex: 100,
            },
            {
              id: 102,
              label: "合计",
              prop: "total_score",
              width: "80",
              align: "center",
              signIndex: 101,
            },
          ]
        },
        {
          id: 5,
          label: "考核标准",
          prop: "standard",
          width: "200",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "审核人评分",
          prop: "exam_score",
          width: "130",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "审核说明",
          prop: "exam_score_remark",
          width: "130",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "审核佐证材料",
          prop: "exam_files",
          width: "200",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "评分人",
          prop: "score_person_name",
          width: "200",
          align: "center",
          signIndex: 9,
        },
        {
          id: 11,
          label: "申诉理由",
          prop: "appeal_reason",
          width: "200",
          align: "center",
          signIndex: 10,
        },
        {
          id: 12,
          label: "申诉文件",
          prop: "appeal_files",
          width: "200",
          align: "center",
          signIndex: 11,
        },
        {
          id: 13,
          label: "最终得分",
          prop: "last_score",
          width: "200",
          align: "center",
          signIndex: 12,
        },
        {
          id: 14,
          label: "审核说明",
          prop: "deal_reason",
          width: "200",
          align: "center",
          signIndex: 13,
        },
        {
          id: 15,
          label: "作证材料",
          prop: "deal_files",
          width: "200",
          align: "center",
          signIndex: 14,
        }
      ],
    }
  },
  created() {
    if (getUser()) {
      let userInfo = JSON.parse(getUser());
      this.userId =  Number(userInfo.user_id)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({},params,this.form)
      params.appeal_id = this.userId
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetAssessAppealByPage(params)
      .then(res => {
        if (res.head.result == "200") {
          this.data = res.context
          // 总分类下需要分页
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
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 取消申诉  
    representations(row) {
      this.$client.RevokeAssessAppeal({context:row.id})
        .then(res => {
          if (res.head.result == "200") {
            // 重新加载列表详情
            this.loadData();
            this.$message({
              showClose: true,
              message: "已取消申诉",
              type: "success",
            });
          } else {
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
    // 查看详情  
    showDetails(info) {
      this.$client.GetAssessRecordDetail({id:info.record_id})
      .then(res => {
        if (res.head.result == "200") {
          this.isShowSetInfoDialog = true;
          this.$nextTick(() => {
            this.$refs.showInfoDialog.initSet(res.context)
          })
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
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th - 30;
      }, 60);
    },
    getColor(type) {
      let color = ''
      switch (type) {
        case 1:
          color = '#027DB4'
          break;
        case 2:
          color = '#D9001B'
          break;
        case 3:
          color = '#70B603'
        case 4:
          color = '#70B603'
          break;
      }
      return `color:${color}`
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.assessment-appeal
  height: 100%
  width: 100%
</style>