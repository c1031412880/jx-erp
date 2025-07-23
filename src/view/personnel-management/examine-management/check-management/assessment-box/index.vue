<template>
  <div class="check-management">
    <div class="department-detail show-flex-box-c" v-loading="loading">
      <sub-req
        ref="head"
        @on-add="openAddPage"
        @on-ok="onSubmit"
      ></sub-req>
      
      <div>
        <tr-table
          :selectionShow="true"
          :data="data"
          :tableHeaderList="canRendererTableHeader"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          @on-select-change-row="selectedUserList"
        >
          <template slot-scope="scope" slot="flow_state">
            <span :style="getColor(scope.data.flow_state)">{{scope.data.flow_state_name}}</span>
          </template>
          <template slot-scope="scope" slot="start_time">
            <span>{{scope.data.start_time + '至' + scope.data.end_time}}</span>
          </template>
          <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" style="margin-left: 10px;" v-if="scope.data.flow_state != 0" @click="checkDetail(scope.data)">查看</el-button>
            <el-button type="text" size="mini" style="margin-left: 10px;" v-if="scope.data.flow_state == 0"  @click="showDetails(scope.data,'edit')">编辑</el-button>
            <el-button type="text" size="mini" style="margin-left: 10px;"  @click="showDetails(scope.data,'copy')">复制模板</el-button>
            <div style="display:inline-block" v-if="$isPowerShow('del') && (scope.data.flow_state == 3 || scope.data.flow_state == 4)">
              <el-popconfirm
                @confirm="deleteRowInfo(scope.data)"
                title="确定删除此条记录吗？">
                <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;color:red" >删除</el-button>
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
    <div class="organization-project-dialog">
      <set-info-dialog
        ref="setOrganizationInfo"
        :dialogBool.sync="isShowSetInfoDialog"
        :curSelecedType="curSelecedType"
        @save-add-edit="saveAddEdit"
      ></set-info-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import setInfoDialog from "./component/set-info-dialog"

export default {
  name: "check-management",
  components: {
    subReq,
    setInfoDialog,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 50,
        pageCount: 0,
      },
      curSelecedType: 'add', //添加
      isShowSetInfoDialog: false,
      data:[], //列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 2, //后几行固定
      canRendererTableHeader: [
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
          width: "100",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "考核时间",
          prop: "start_time",
          width: "200",
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
          prop: "exam_user_names",
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
        {
          id: 8,
          label: "审批状态",
          prop: "flow_state",
          width: "100",
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
      selectedProjectIds:[], //勾选中要删除的IDs
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
    // 头部事件抛出
    openAddPage(type) {
      this.curSelecedType = type;
      switch (type) {
        case "add":
          this.isShowSetInfoDialog = true;
          this.$nextTick(() => {
            this.$refs.setOrganizationInfo.initSet()
          })
          break;
        case "import":
          this.filedialogVisible = true;
          break;
        case "delete": //删除
          this.deleteSelectedUserInfo()
          break;
        case "export": 
          this.onExport()
          break
      }
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
    // 新增和编辑
    saveAddEdit(params) {
      if (this.curSelecedType == 'add' || this.curSelecedType == 'copy') {
        this.$client
        .AddAssessRecord({context:params})
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.isShowSetInfoDialog = false;
            this.$message({
              showClose: true,
              message: '保存成功',
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
        .catch((err) => {
        });
      } else if (this.curSelecedType == 'edit') {
        this.$client
          .UpdateAssessRecord({context:params})
          .then((res) => {
            if (res.head.result == "200") {
              this.loadData();
              this.isShowSetInfoDialog = false;
              this.$message({
                showClose: true,
                message: successrMessage,
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
          .catch((err) => {
          });
      }
      
    },
    // 选中表格勾选框
    selectedUserList(projectList) {
      this.selectedProjectIds = [];
      projectList.forEach((item,index) => {
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
    deleteRowInfo(info) {
       let params = {
        context: []
      };
      if(!!info) {
        params.context[0] = info.id
      }else{
        params.context = this.selectedProjectIds
      }
      this.$client.DeleteAssessRecord(params)
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
          color = '#D9001B'
          break;
      }
      return `color:${color}`
    },
    // 编辑和复制模板
    showDetails(row,type) {
      this.curSelecedType = type
      this.isShowSetInfoDialog = true;
      this.$nextTick(() => {
        this.$refs.setOrganizationInfo.initSet(row,type)
      })
    },
    checkDetail(row) {
      let detail_id = 5220, title = '待办事项:考核申请 '
      this.$router.push({
        path: `/news-details/${row.id}/${title}/${detail_id}`
      })
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.check-management{
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
