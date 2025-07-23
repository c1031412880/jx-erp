<template>
  <div class="assessment-box">
    <div class="department-detail show-flex-box-c" v-loading="loading">
      <sub-req
        ref="head"
        @on-ok="onSubmit"
      ></sub-req>
      <div>
        <tr-table
          :data="data"
          :tableHeaderList="canRendererTableHeader"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
        >
          <template slot-scope="scope" slot="exam_state">
            <span :style="getColor(scope.data.exam_state)">{{scope.data.exam_state_name}}</span>
          </template>
          <template slot-scope="scope" slot="push_state">
            <span :style="{color: scope.data.push_state == 0 ? '#D9001B' : '#02A7F0'}">{{scope.data.push_state_name}}</span>
          </template>
          <template slot-scope="scope" slot="start_time">
            <span>{{scope.data.start_time + '至' + scope.data.end_time}}</span>
          </template>
          <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" style="margin-left: 10px;" @click="showDetails(scope.data)">查看</el-button>
            <el-button type="text" size="mini" style="margin-left: 10px;" v-if="scope.data.exam_state == 3 && scope.data.is_appeal !== 1"  @click="representations(scope.data,'add')">申诉</el-button>
            <el-popconfirm
               v-if="scope.data.exam_state == 4"
                @confirm="representations(scope.data,'cancel')"
                title="是否确认取消申述?">
                <el-button  slot="reference" type="text" size="mini" style="margin-left: 10px;">取消申诉</el-button>
              </el-popconfirm>
            <div v-if="scope.data.exam_state == 3 || scope.data.exam_state == 4" style="display:inline-block">
              <el-popconfirm
                @confirm="confirmInfo(scope.data)"
                title="确认后就不能进行申诉考核结果，是否确认?">
                <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;color:red">确认</el-button>
              </el-popconfirm>
            </div>
          </template>
        </tr-table>
      </div>
      <el-pagination
        style="margin: 5px 0;display:flex; justify-content: flex-end;"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        ref="paginationH"
        :current-page="pageInfo.pageIndex"
        :page-sizes="[10, 20, 30, 40, 50,]"
        :page-size="pageInfo.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="pageInfo.pageCount"
      >
      </el-pagination>
    </div>

    <!-- 评分详情 -->
    <show-info-dialog
      ref="showInfoDialog"
      :dialogBool.sync="isShowSetInfoDialog"
      :tableHeaderList="showInfoTableHeader"
      :curSelecedType="curSelecedType"
      @on-save="saveAppeal">
    </show-info-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import { getUser } from "@/utils/auth";
import showInfoDialog from "./component/show-info-dialog"
import { deepCopy } from '@/utils/index'
export default {
  name: "assessment-box",
  components: {
    subReq,
    showInfoDialog,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 50,
        pageCount: 0,
      },
      isShowSetInfoDialog: false,
      data:[], //列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 2, //后几行固定
      canRendererTableHeader: [
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
          label: "考核类型",
          prop: "exam_type_name",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "考核时间",
          prop: "start_time",
          width: "160",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "被考核对象",
          prop: "exam_obj_name",
          width: "130",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "被考核人员",
          prop: "exam_user_names",
          width: "130",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "总分值",
          prop: "total_score",
          width: "120",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "评分人",
          prop: "exam_score_person",
          width: "120",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "考核得分",
          prop: "exam_score",
          width: "120",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "考核状态",
          prop: "exam_state",
          width: "120",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "操作",
          prop: "operation",
          width: "150",
          align: "center",
          signIndex: 9,
        },
      ],
      loading: false,
      TableHeight:500,

      form:{}, //查询表单数据
      selectedProjectIds:[], //勾选中要删除的IDs
      userId: 0,

      appealDialog: false,
      showInfoTableHeaderList: [
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
      ],
      showInfoTableHeader: null,

      curSelecedType: 'detail'
    };
  },
  created() {
    if (getUser()) {
      let userInfo = JSON.parse(getUser());
      this.userId =  Number(userInfo.user_id)
    }
  },
  mounted() {
    this.setHead()
  },
  methods: {
    // 计算高吨
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - 35 -th;
      }, 60);
    },
    // 获取列表
    loadData() {
      this.loading = true;
      let params = Object.assign({},params,this.form)
      params.flow_state = 2
      params.user_id = this.userId
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetAssessRecordByPage(params)
      .then(res => {
        if (res.head.result == "200") {
          this.data = res.context.list;
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
    // 查询
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
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
    getColor(type) {
      let color = ''
      switch (type) {
        case 0:
          color = '#333333'
          break;
        case 1:
          color = '#02A7F0'
          break;
        case 2:
          color = '#70B603'
          break;
        case 3:
          color = '#F59A23'
          break;
        case 4:
          color = '#F59A23'
          break;
        case 5:
          color = '#70B603'
          break;
        case 6:
          color = '#D9001B'
          break;
      }
      return `color:${color}`
    },
    // 查看详情
    showDetails(info) {
      this.curSelecedType = 'detail'
      this.isShowSetInfoDialog = true;
      this.showInfoTableHeader = deepCopy(this.showInfoTableHeaderList)
      if (info.exam_state == 4 ) {
        let list = [
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
        ]

        this.showInfoTableHeader = [...this.showInfoTableHeader,...list]
      }

      if (info.is_appeal == 1) {
        let list = [
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
          },
        ]
        this.showInfoTableHeader = [...this.showInfoTableHeader,...list]
      }
      this.$nextTick(() => {
        this.$refs.showInfoDialog.initSet(info)
      })
    },
    // 申诉
    representations(row,type) {
      if (type === 'add') {
        this.curSelecedType = 'edit'
        this.isShowSetInfoDialog = true
        this.showInfoTableHeader = deepCopy(this.showInfoTableHeaderList)
        let list = [
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
        ]
        this.showInfoTableHeader = [...this.showInfoTableHeader,...list]
        this.$nextTick(() => {
          this.$refs.showInfoDialog.initSet(row)
        })
      } else {
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
      }
    },
    // 提交申诉
    saveAppeal(params) {
      this.$client.AppealAssessRecord({context:params})
        .then(res => {
          if (res.head.result == "200") {
            this.isShowSetInfoDialog = false
            // 重新加载列表详情
            this.loadData();
            this.$message({
              showClose: true,
              message: "成功提交申诉",
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
    // 确认考核
    confirmInfo(row) {
      this.$client.ConfirmAssessRecord({context:row.id})
        .then(res => {
          if (res.head.result == "200") {
            // 重新加载列表详情
            this.loadData();
            this.$message({
            showClose: true,
            message: "已确认考核结果",
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

  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.assessment-box{
  width: 100%;
  height: 100%;
}
.water-management {
  width: 100%;
  height: 100%;
  display: flex;

  .box-card {
    height: 100%;
    overflow: auto;
  }

  .left-box {
    flex: 0 0 15vw;
    margin: 0 5px 0 0;
    width: 300px;
    height: 100%;
  }

  .center-box {
    flex: 1;
    height: 100%;
  }
}

</style>
