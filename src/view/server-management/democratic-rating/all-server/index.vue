<template>
  <div class="release-box">
    <div class="department-detail show-flex-box-c" v-loading="loading">
      <sub-req
        ref="head"
        @on-ok="onSubmit"
        @on-add="onAdd"
        @on-delete="deleteSelectedUserInfo"
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
          @on-select-change-row="selectedUserList"
        >
          <template slot-scope="scope" slot="data_state_name">
            <span :style="getColor(scope.data.data_state)">{{scope.data.data_state_name}}</span>
          </template>
          <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" style="margin-left: 10px;" v-if="[-2,-1,1].includes(scope.data.data_state)" @click="eidt(scope.data)">编辑</el-button>
            <el-button type="text" size="mini" style="margin-left: 10px;" v-if="[2,3].includes(scope.data.data_state)" @click="showApprove(scope.data)">查看</el-button>
            <el-button type="text" size="mini" style="margin-left: 10px;" v-if="scope.data.data_state == 4 || scope.data.data_state == 5" @click="showDetails(scope.data)">查看</el-button>
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
      @save-form="saveForm"
      v-if="isShowSetInfoDialog"
      >
    </show-info-dialog>

    <show-detail-dialog
      ref="showDetailDialog"
      :dialogBool.sync="isShowSetDetailDialog"
      >
    </show-detail-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import showInfoDialog from "./component/show-info-dialog"
import showDetailDialog from "./component/show-detail-dialog"
import { deepCopy } from '@/utils/index'
export default {
  name: "release-box",
  components: {
    subReq,
    showInfoDialog,
    showDetailDialog
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
      isShowSetDetailDialog: false
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
    onAdd() {
      this.isShowSetInfoDialog = true
      this.$nextTick(() => {
        this.$refs.showInfoDialog.initSet()
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
    // 编辑
    eidt(info) {
      this.$client.GetAuthorizationDetail({id:info.id})
      .then(res => {
        if (res.head.result == "200") {
          this.isShowSetInfoDialog = true;
          this.$nextTick(() => {
            let form = res.context
            if (info.data_state == -1 || info.data_state == -2) {
              form.id = 0
            }
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
    showDetails(info) {
      this.$client.GetAuthorizationDetail({id:info.id})
      .then(res => {
        if (res.head.result == "200") {
          this.isShowSetDetailDialog = true
          this.$nextTick(() => {
            let form = res.context
            this.$refs.showDetailDialog.initSet(form)
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
    // 查看
    showApprove(row) {
      let detail_id = 7000, title = '待办消息:民主评分'
      this.$router.push({
        path: `/news-details/${row.id}/${title}/${detail_id}`
      })
    },
    // 选中表格勾选框
    selectedUserList(projectList) {
      this.selectedProjectIds = [];
      // projectList.forEach((item,index) => {
      //   this.selectedProjectIds.push(item.id)
      // });
      // 过滤 草稿 拒绝 撤回 
      let list = projectList.filter(item => {
        return [-2,-1,1].includes(item.data_state) 
      })
      list.forEach((item,index) => {
        this.selectedProjectIds.push(item.id)
      });
    },
    // 确定批量移除勾选
    deleteSelectedUserInfo() {
      if(this.selectedProjectIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选至少一条要移除的',
          type: "warning",
        });
        return
      }
      this.deleteRowInfo(null)
    },
    // 移除
    deleteRowInfo() {
       let params = {
        context: this.selectedProjectIds
      };
      this.$client.DeleteDemocraticScore(params)
      .then(res => {
        if (res.head.result == "200") {
          // 重新加载列表详情
          this.loadData();
          this.$message({
            showClose: true,
            message: "删除成功",
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
    // 提交 
    saveForm(formData,data) {
      this.$client.CreateAuthorization({context: {
        form_data: formData,
        step_data: data,
      }}).then(req => {
        if (req.head.result === "200") {
          this.isShowSetInfoDialog = false
          this.loadData()
          this.$message({message: req.head.describle, type: "success",});
        } else {
          this.$message({message: req.head.describle, type: "error",});
        }
      }).catch(e => {
        this.$message({message: '服务异常', type: "error",});
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
