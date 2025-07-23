<template>
  <div class="water-management-box">
      <el-card class="box-card center-box" ref="centerBox">
        <div class="department-detail show-flex-box-c" v-loading="loading">
          <sub-req
            ref="head"
            @on-add="openAddPage"
            @on-ok="onSubmit"
          ></sub-req>
          <div class="show-box">
            <span>已选检查内容：</span>
            <div class="title-tag">
              <el-tag style="margin: 0 5px" size="mini" effect="dark" type="success" v-for="item in selectedList" :key="item.id">{{item.check_name.slice(0,6)}}</el-tag>
            </div>
          </div>
          <div>
            <tr-table
              ref="table"
              :selectionShow="true"
              :reserveSelect="true"
              :data="data"
              :tableHeaderList="canRendererTableHeader"
              :isShowBottomOptions="false"
              :TableHeight="TableHeight"
              :loading="loading"
              @on-select-change-row="selectedUserList"
            ></tr-table>
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
      </el-card>
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
import subReq from "./sub-req";
import setInfoDialog from "../dialog/set-info-dialog"
export default {
  name: "assessment-content",
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
      loading: false,
      TableHeight:500,
      form:{}, //查询表单数据
      canRendererTableHeader: [
        {
          id: 1,
          label: "检查项目名称",
          prop: "check_name",
          width: "150",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "项目内容",
          prop: "check_content",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "技术要求",
          prop: "technical_require",
          width: "130",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "风险等级",
          prop: "risk_level_name",
          width: "130",
          align: "center",
          signIndex: 3,
        },
      ],
      selectedList:[], //勾选中要IDs
    };
  },
  mounted() {
    this.loadData()
    this.$nextTick(() => {
      this.setHead()
    })
  },
  methods: {
    // 计算高吨
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - 125 -th;
      }, 60);
    },
    // 查询
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      params.state = 1
      this.$client.GetByPageDayCheck({context:params})
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list || []
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
          this.loading = false;
        })
    },
    // 头部事件抛出
    openAddPage(type) {
      switch (type) {
        case "add":
          this.curSelecedType = 'add';
          this.isShowSetInfoDialog = true;
          break;
        case "save":
          this.onSave()
          break;
        case "close": 
          this.onClose()
          break;
      }
    },
    // 添加
    saveAddEdit(form) {
      let params = {
        context: form
      }
      this.$client
      .AddOrUpdateDayCheck(params)
      .then((res) => {
        if (res.head.result == "200") {
          this.loadData();
          this.isShowSetInfoDialog = false;
          this.$message({
            showClose: true,
            message: '添加成功',
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
      .catch((err) => {});
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
    // 选中表格勾选框
    selectedUserList(projectList) {
      this.selectedList = projectList
    },
    // 清空勾选
    clearData() {
      this.selectedList = []
      this.$refs.table.handleSelectionChange([])
    },
    // 提交勾选物资
    onSave() {
      this.$emit('on-save',this.selectedList)
      this.clearData()
    },
    onClose() {
      this.clearData()
      this.$emit("on-close");
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.water-management-box{
  width: 100%;
  height: 100%;
  .show-box {
    width: 100%;
    height: 20px;
    display: flex;
    margin-bottom: 10px;
    align-items: center
    .title-tag {
      flex: 1; 
      overflow: hidden;
      height: 20px;
    }
  }
}
</style>
