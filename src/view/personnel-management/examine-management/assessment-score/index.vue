<template>
  <div class="assessment-score">
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
      <template slot-scope="scope" slot="exam_state">
        <span :style="getColor(scope.data.exam_state)">{{scope.data.exam_state_name}}</span>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" style="margin-left: 10px;" @click="showDetails(scope.data,'detail')">查看</el-button>
        <el-button type="text" size="mini" style="margin-left: 10px;" v-if="scope.data.exam_checks.indexOf(userId) != -1 && [1,2].includes(scope.data.exam_state)" @click="showDetails(scope.data,'edit')">评分</el-button>
        <el-button type="text" size="mini" style="margin-left: 10px;" v-if="scope.data.user_id == userId && scope.data.exam_state == 2" @click="showDetails(scope.data,'check')">审核</el-button>
        <el-button type="text" size="mini" style="margin-left: 10px;" v-if="$isPowerShow('mark') && (scope.data.exam_state == 5 || scope.data.exam_state == 6)" @click="showMark(scope.data)">抄送</el-button>
        <el-button type="text" size="mini" style="margin-left: 10px;" v-if="$isPowerShow('markDetail') && (scope.data.exam_state == 5 || scope.data.exam_state == 6)" @click="showMarkDetails(scope.data)">抄送记录</el-button>
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
      :curSelecedType="curSelecedType"
      :tableHeaderList="showInfoTableHeader"
      @on-save="saveRating">
    </show-info-dialog>

    <vue-user-role-tree
      :selectPersonShow.sync="selectPersonShow"
      ref="vueUserRoleTree" 
      placeholder="请选择人员"
      :show_all="true" 
      :func_type="0" 
      :is_contain_emp="true" 
      :isCheckSort="true"
      :isShowCheckbox="true"
      @on-ok="saveSelectUsers"></vue-user-role-tree>

      <!-- 抄送记录 -->
    <mark-detail
      ref="markDialog"
      :dialogBool.sync="isShowmarkDialog">
    </mark-detail>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import showInfoDialog from "@/view/personnel-management/examine-management/check-management/release-box/component/show-info-dialog"
import VueUserRoleTree from '@/components/base/formModel/tree/user-role-select-tree/list'
import markDetail from "./component/mark-detail";
import { getUser } from "@/utils/auth";
import { deepCopy } from '@/utils/index'
export default {
  name: 'assessment-score',
  components: {
    subReq,
    showInfoDialog,
    VueUserRoleTree,
    markDetail
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
          label: "编号",
          prop: "flow_code",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "考核名称",
          prop: "exam_name",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "考核类型",
          prop: "exam_type_name",
          width: "130",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "考核时间",
          prop: "start_time",
          width: "130",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "被考核对象",
          prop: "exam_obj_name",
          width: "130",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "被考核人员",
          prop: "exam_dept_name",
          width: "130",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "总分值",
          prop: "total_score",
          width: "120",
          align: "center",
          signIndex: 6,
        },
        // {
        //   id: 8,
        //   label: "评分人",
        //   prop: "exam_score_person",
        //   width: "120",
        //   align: "center",
        //   signIndex: 7,
        // },
        {
          id: 9,
          label: "考核得分",
          prop: "exam_score",
          width: "120",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "考核状态",
          prop: "exam_state",
          width: "120",
          align: "center",
          signIndex: 9,
        },
        {
          id: 11,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 10,
        },
      ],
      isShowSetInfoDialog: false,
      curSelecedType: 'detail',
      userId: '',

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
          signIndex: 3,
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
       
      ],

      showInfoTableHeader: null,
      checkID: null,
      selectPersonShow: false,
      markID: '',
      isShowmarkDialog: false
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
      params.push_state = 1
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
    showDetails(info,type) {
      if (type == 'check') {
        this.checkID = info.id
      } else {
        this.checkID = null
      }
      this.showInfoTableHeader = deepCopy(this.showInfoTableHeaderList)
      if (type == 'detail' || type == 'check') {
        
        if (info.is_appeal == 1 || info.exam_state == 4) {
          let list = [
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
          ]
          this.showInfoTableHeader = [...this.showInfoTableHeader,...list]
        } else {
          this.showInfoTableHeader.push({
            id: 10,
            label: "评分人",
            prop: "score_person_name",
            width: "130",
            align: "center",
            signIndex: 9,
          })
        }
      }
      this.curSelecedType = type
      this.isShowSetInfoDialog = true;
      this.$nextTick(() => {
        this.$refs.showInfoDialog.initSet(info)
      })

      if (type == 'detail') {
        this.$client.ReadCopyAssessManage({context: info.id})
      }
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
    // 保存审核评分
    saveRating(params) {
      if (this.checkID) {
        let list = deepCopy(params.list) 
        // 判断是否都有评分 
        let iSrateAll = list.every(item => {
          return item.score !== ''
        })
        if (!iSrateAll) {
          this.$message({
            showClose: true,
            message: '请先全部评分完成再审核',
            type: "warning",
          });
          return
        }
        this.$client.ReviewAssessRecordScore({context:this.checkID}).then(res => {
          if (res.head.result == "200") {
            this.isShowSetInfoDialog = false
            this.loadData()
            this.$message({
              showClose: true,
              message: '考核审核成功',
              type: "success",
            });
          }
        })
      } else {
        let list = deepCopy(params.list) 
        // 判断是否都有评分 
        let iSrateAll = list.every(item => {
          return item.score !== ''
        })
        if (iSrateAll) {
          params.all_score = 1
        } else {
          params.all_score = 0
        }
        params.list.forEach(item => {
          if (item.score === '') {
            item.score = null
          }
        });
        console.log(JSON.parse(JSON.stringify(params)));
        this.$client.ApproveAssessRecord({context:params})
        .then(res => {
          if (res.head.result == "200") {
            this.isShowSetInfoDialog = false
            this.loadData()
            this.$message({
              showClose: true,
              message: '考核评分成功',
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
      }

    },
    showMark(row) {
      this.markID = row.id
      this.selectPersonShow = true
    },
    saveSelectUsers(list) {
      if (list.length == 0) {
        this.$message({
          showClose: true,
          message: '请选择抄送人员',
          type: "warning",
        });
        return
      }
      let ids = list.map(item => {
        return item.value
      })
      let params = {
        copy_ids: ids,
        id: this.markID
      }
      this.$client.AddCopyAssessManage({context:params})
      .then(res => {
        if (res.head.result == "200") {
            this.selectPersonShow = false
            this.$message({
              showClose: true,
              message: "抄送成功",
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
        this.loading = false;
      })

    },
    showMarkDetails(row) {
      this.isShowmarkDialog = true
      this.$nextTick(() => {
        this.$refs.markDialog.loadData(row.id)
      })
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.assessment-score
  height: 100%
  width: 100%
</style>