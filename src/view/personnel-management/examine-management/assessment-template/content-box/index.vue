<template>
  <div class="water-management-box">
    <div class="water-management">
      <el-card class="box-card left-box">
        <div
          slot="header"
          class="clearfix show-flex-box-r"
          style="height: 37px; align-items:center;"
        >
          <span style="white-space:nowrap;">考核指标类型</span>
        </div>
        <div class="show-flex-box-c">
          <maintenance-project-tree
            ref="organizationTree"
            :loading="organizationloading"
            :organizationTreeList="organizationTreeList"
            :organizationTreeListLength="organizationTreeListLength"
            @on-tree="selectDepartment"
            @refresh-tree="refreshTreeList"
          ></maintenance-project-tree>
        </div>
      </el-card>
      <el-card class="box-card center-box" ref="centerBox" v-if="!!curSelectedDepartment">
        <div class="department-detail show-flex-box-c" v-loading="loading">
          <sub-req
            ref="head"
            @on-add="openAddPage"
            @on-ok="onSubmit"
          ></sub-req>
          <div class="show-box">
            <span>已选考核内容：</span>
            <div class="title-tag">
              <el-tag style="margin: 0 5px" size="mini" effect="dark" type="success" v-for="item in selectedList" :key="item.id">{{item.content.slice(0,6)}}</el-tag>
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
              :frontFixedNum="frontFixedNum"
              :backFixedNum="backFixedNum"
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
      <el-card class="box-card center-box show-flex-box-r show-flex-center" v-else>
        <el-empty description="暂无考核内容信息"></el-empty>
      </el-card>
    </div>
    <div class="organization-project-dialog">
      <set-info-dialog
        ref="setOrganizationInfo"
        :dialogBool.sync="isShowSetInfoDialog"
        :curSelecedType="curSelecedType"
        :organizationTreeList="organizationTreeList"
        @save-add-edit="saveAddEdit"
      ></set-info-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import maintenanceProjectTree from "./maintenance-project-tree";
import subReq from "./sub-req";
import setInfoDialog from "../dialog/set-info-dialog"

export default {
  name: "assessment-content",
  components: {
    maintenanceProjectTree,
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
      organizationloading: false,
      organizationTreeList: [],
      organizationTreeListLength:0,
      curSelecedType: 'add', //添加
      isShowSetInfoDialog: false,
      // isFirstOrganization: false,
      curSelectedDepartment:null, //当前选中的组织树节点
      isShowAddClassifyDialog: false, // 添加项目分类弹窗
      data:[], //列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 2, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "考核指标类型",
          prop: "group_name",
          width: "150",
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
          width: "130",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "分值",
          prop: "score",
          width: "130",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "最高评分",
          prop: "max_score",
          width: "130",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "考核标准",
          prop: "standard",
          width: "130",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 6,
        },
      ],
      loading: false,
      TableHeight:500,
      form:{}, //查询表单数据

      selectedList:[], //勾选中要IDs
    };
  },
  mounted() {
    this.loadOrganizationTree();
    this.$nextTick(() => {
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        if(this.curSelectedDepartment) {
          this.setHead(this.curSelectedDepartment)
        }
      })
    })
  },
  methods: {
    // 计算高吨
    setHead(departmentInfo) {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - 125 -th;
      }, 60);
    },
    // 刷新维修组织分类
    refreshTreeList() {
      this.loading = true;
      this.organizationloading = true;
      this.loadOrganizationTree();
      // 重新定位到目前组织树中
      this.locationCurNode();
    },
    // 获取组织tree信息
    loadOrganizationTree() {
      // this.organizationloading = true;
      this.$client.GetAssessGroupTree()
      .then(res => {
        if (res.head.result == "200") {
          this.organizationTreeList = res.context;
          this.organizationTreeListLength = this.organizationTreeList.length;
          setTimeout(() => {
            this.organizationloading = false;
          }, 600);
          } else {
            this.organizationloading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      })
    },
    // 选择某一组织
    selectDepartment(departmentInfo) {
      this.curSelectedDepartment = departmentInfo;
      this.form = {}; //搜索置空
      this.setHead(departmentInfo)
      setTimeout(() => {
        this.$refs.head.onSubmit();
      //  }
      },50)
    },
    // 获取列表
    // isCurDepartment //是否是当期组织还是上级组织
    reqOrgProjectList() {
      this.loading = true;
      let params = {
        group_id: this.curSelectedDepartment.id
      }
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      params = Object.assign({},params,this.form)
      this.$client.GetAssessContentByPage(params)
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.data = res.context.list;
          // 总分类下需要分页
          this.pageInfo.pageCount = res.context.total
          setTimeout(() => {
            this.loading = false;
          }, 800);
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {

      })
    },
    // 查询
    onSubmit(form) {
      this.form = form;
      console.log(this.form);
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.reqOrgProjectList(true);
    },
    // 头部事件抛出
    openAddPage(type) {
      this.curSelecedType = type;
      switch (type) {
        case "add":
          this.$refs.setOrganizationInfo.ruleForm.group_id = this.curSelectedDepartment.id || ''
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
      .AddAssessContent(params)
      .then((res) => {
        if (res.head.result == "200") {
          this.reqOrgProjectList(true);
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
      this.reqOrgProjectList(true);
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.reqOrgProjectList(true);
    },
    // 重新定位到目前组织树中
    locationCurNode() {
      let ids= [];
      ids.push(this.curSelectedDepartment.id);

      this.$refs.organizationTree.setSelecedCheckedKeys(ids);
    },
    // 选中表格勾选框
    selectedUserList(projectList) {
      this.selectedList = projectList
    },
    //去重
    unique(arr) {
      let map = new Map();
      for (let item of arr) {
        map.set(item.id, item);
      }
      return [...map.values()];
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
      this.$emit("on-close");
      this.clearData()
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

.water-management /deep/ .el-card__header {
  background-color: #F5F5F5;
  padding: 12px 20px;
}

.superior-department-content {
  margin-bottom: 30px;
}
</style>
