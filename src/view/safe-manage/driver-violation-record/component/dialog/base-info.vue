<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClosevv"
    width="1000px"
    :append-to-body="appendToBody"
  >
    <div>
      <!-- <base-info ref="baseInfo" :curChangeType="curChangeType"></base-info> -->
      <div class="base-info" style="height: 600px; overflow-x: hidden">
        <el-card class="box-card left-box">
          <div
            slot="header"
            class="clearfix show-flex-box-r"
            style="height: 37px; flex-wrap: nowrap; align-items:center;"
          >
            <span style="white-space:nowrap;">稽查项目类别</span>
          </div>
          <div class="show-flex-box-c">
            <maintenance-project-tree
            ref="organizationTree"
            :loading="organizationloading"
            :organizationTreeList="organizationTreeList"
            :organizationTreeListLength="organizationTreeListLength"
            @on-tree="selectDepartment"
          ></maintenance-project-tree>
          </div>
        </el-card>
        <el-card class="box-card center-box" ref="centerBox">
          <div style="margin: 10px 0" slot="header">
            <span>稽查项目名称</span>
          </div>
          <div class="department-detail show-flex-box-c" v-loading="loading">
            <req
              ref="head"
              @on-ok="onSubmit"
            ></req>
            <div>
              <p style="margin-bottom: 10px;">已选项目:  {{selectNames.toString()}}</p>
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
              ></tr-table>
            </div>
          </div>
        </el-card>
      </div>
      <div></div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogClosevv">取 消</el-button>
      <el-button type="primary" @click="submitFormDatavv">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import maintenanceProjectTree from "./maintenance-project-tree";
import req from "./req";
import fileDialog from "@/components/fileDialog/file-dialog.vue";
import tableDraggableSort from "@/components/tableDraggableSort";
export default {
  components: {
    maintenanceProjectTree,
    req,
    fileDialog,
    tableDraggableSort,
  },
  props: {
    dialogBool: Boolean,
    appendToBody: {
      type: Boolean,
      default: false
    },

  },
  data() {
    return {
      selectedId: "",
      showTitle: "违规检查奖罚",
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      visible: false,
      classifyOptions: [], //所属类别列表

      organizationloading: false,
      organizationTreeList: [],
      organizationTreeListLength: 0,

      curSelectedDepartment: null, //当前选中的维修组织树节点

      data: [], //维修项目列表
      frontFixedNum: 0, //前几行固定
      backFixedNum: 0, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "稽查项目名称",
          prop: "c_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: "所属类别",
          prop: "main_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: "奖罚标识",
          prop: "model",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false
        },
        {
          id: 4,
          label: "奖罚金额（元）",
          prop: "c_fee",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true
        },
        {
          id: 5,
          label: "加减分值",
          prop: "n_score",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable: true
        },
        {
          id: 6,
          label: "详细说明",
          prop: "c_remark",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false
        },
        {
          id: 7,
          label: "启用状态",
          prop: "i_enable",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false
        },
        {
          id: 8,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 7,
          sortable: false
        }
      ],
      loading: false,
      TableHeight: 400,
      filedialogVisible: false,
      form: {}, //查询表单数据
      selectedProjectIds: [],
      selectNames: [],
      selectData: [],
    };
  },
  mounted() {
    // this.setHead();
    this.loadOrganizationTree();
  },
  watch: {
    // dialogBool(bool) {
    //   if (bool === false) {
    //     Object.assign(this.$data, this.$options.data());
    //     this.resetData();
    //   } else {
    //     this.configAddStaffInfo();
    //   }
    // }
  },
  methods: {
    dialogClosevv() {
      this.$emit("update:dialogBool", false);
    },
    submitFormDatavv() {
      if (this.selectedProjectIds.length) {
        if(this.selectedProjectIds.length > 1) {
          this.$message({ type: "error", message: '请选择1个处罚依据'});
          return false;
        }
        this.$emit("on-change", this.selectedProjectIds[0], this.selectNames[0], this.selectData[0]);
      } else {
        this.$message({ type: "error", message: '请选择处罚依据'});
      }
    },
    // 明细筛选
    onSubmit(form) {
      this.form = form;
      console.log(this.form);
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = 20;
      this.pageInfo.pageCount = 0;
      this.reqInspectProjectList(true);
    },
    // 获取组织tree信息
    loadOrganizationTree() {
      this.organizationloading = true;
      this.$client
        .getGroupRewardPunish()
        .then(res => {
          this.organizationloading = false;
          if (res.head.result == "200") {
            this.organizationTreeList = res.context;
            // this.organizationTreeListLength = this.organizationTreeList.length;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error"
            });
          }
        })
        .catch(err => {});
    },

    // 选择某一组织
    selectDepartment(departmentInfo) {
      this.curSelectedDepartment = departmentInfo;
      this.reqInspectProjectList(true) // 获取稽查项目列表
    },
    // 加载右侧数据
    reqInspectProjectList(isCurDepartment) {
      this.loading = true;
      let params = {
        group_id: isCurDepartment? this.curSelectedDepartment.i_id : this.curSelectedDepartment.p_id,
        enable: 1  // 只获取启用的项目
      }
      if(!this.curSelectedDepartment.type) {
        params.page_index = this.pageInfo.pageIndex;
        params.page_size = this.pageInfo.pageSize;
      }
      params = Object.assign({},params,this.form)
      this.$client.getProItems(params)
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.data = res.context.list;
          // 总分类下需要分页
          if(!this.curSelectedDepartment.type) {
            this.pageInfo.pageCount = res.context.total
          }
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
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.reqInspectProjectList(true);
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.reqInspectProjectList(true);
    },
    // 选中表格勾选框
    selectedUserList(projectList) {
      this.selectedProjectIds = [];
      this.selectNames = [];
      this.selectData = [];
      projectList.forEach((item, index) => {
        this.selectedProjectIds.push(item.i_id);
        this.selectNames.push(item.c_name);
        this.selectData.push(item);
      });
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.base-info {
  width: 100%;
  height: 100%;
  display: flex;

  .box-card {
    height: 100%;
    overflow: auto;
  }

  .left-box {
    flex: 0 0 300px;
    margin: 0 5px 0 0;
    width: 300px;
    height: 100%;
  }

  .center-box {
    flex: 1;
    height: 100%;
  }
}

.department-detail {
}

.department-detail /deep/ .el-input {
  // width: 250px;
}

.maintenance-project-manage /deep/ .el-card__header {
  background-color: #F5F5F5;
  padding: 12px 20px;
}

.superior-department-content {
  margin-bottom: 30px;
}
</style>
