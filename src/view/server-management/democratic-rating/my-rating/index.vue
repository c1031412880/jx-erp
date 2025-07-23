<template>
  <div class="release-box">
    <div class="department-detail show-flex-box-c" v-loading="loading">
      <sub-req
        ref="head"
        @on-ok="onSubmit"
      ></sub-req>
      <div>
        <tr-table
          :selectionShow="true"
          :data="data"
          :tableHeaderList="canRendererTableHeader"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
        >
          <template slot-scope="scope" slot="data_state_name">
            <span :style="getColor(scope.data.state)">{{scope.data.data_state_name}}</span>
          </template>
          <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" style="margin-left: 10px;" v-if="scope.data.data_state == 4" @click="showDetails(scope.data,'add')">评分</el-button>
            <el-button type="text" size="mini" style="margin-left: 10px;" @click="showDetails(scope.data,'detail')">查看</el-button>
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

    <show-info-dialog
      ref="showInfoDialog"
      :dialogBool.sync="isShowSetInfoDialog"
      @on-save="saveForm"
      :curSelecedType="curSelecedType"
      >
    </show-info-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import showInfoDialog from "./component/show-info-dialog"
import { deepCopy } from '@/utils/index'
export default {
  name: "release-box",
  components: {
    subReq,
    showInfoDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 50,
        pageCount: 0,
      },
      data:[], //列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 2, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "状态",
          prop: "data_state_name",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "经办人",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "所在部门",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "评分季度",
          prop: "season_name",
          width: "130",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "评分时间",
          prop: "score_date_range",
          width: "130",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "评分人员数（人）",
          prop: "score_person_count",
          width: "130",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "驾驶员人数（人）",
          prop: "score_driver_count",
          width: "120",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "备注",
          prop: "remark",
          width: "120",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 8,
        },
      ],
      loading: false,
      TableHeight:500,

      form:{}, //查询表单数据
      isShowSetInfoDialog: false,
      selectedProjectIds: [],
      curSelecedType: 'add'
    };
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
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetPageListDemocraticScore(params)
      .then(res => {
        if (res.head.result == "200") {
          this.data = res.context.list;
          // 总分类下需要分页
          this.pageInfo.pageCount = res.context.total
          this.loading = false;

          this.$emit("out-num",res.context.total)
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
    showDetails(info,type) {
      this.curSelecedType = type
      this.$client.GetAuthorizationDetail({id:info.id})
        .then(res => {
          if (res.head.result == "200") {
            this.isShowSetInfoDialog = true;
            this.$nextTick(() => {
              let form = res.context
              this.$refs.showInfoDialog.initSet(form)
            })
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
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
          color = '#D9001B'
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
    // 评分 
    saveForm(form) {
      this.$client.CommitDemocraticScore(form)
        .then(res => {
          if (res.head.result == "200") {
            this.isShowSetInfoDialog = false;
            this.loadData()
            this.$message({
              showClose: true,
              message: '评分成功',
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.release-box{
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
