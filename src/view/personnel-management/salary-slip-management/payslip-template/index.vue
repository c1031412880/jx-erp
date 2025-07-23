<template>
  <div class="water-management-box">
    <div class="water-management">
      <el-card class="box-card left-box">
        <div
          slot="header"
          class="clearfix show-flex-box-r"
          style="height: 37px; align-items:center;"
        >
          <span style="white-space:nowrap;">模板名称</span>
        </div>
        <div class="show-flex-box-c">
          <div class="show-flex-box-r" style="margin-bottom:15px;">
            <el-button style="margin-left: 15px" type="primary" size="mini" @click="openSetOrganizationInfoDialog('add')">添加</el-button
            >
            <el-button style="margin-left: 15px" type="primary" size="mini" :disabled="curSelectedDepartment.id == 0"
            @click="openSetOrganizationInfoDialog('edit')" v-if="!!curSelectedDepartment && $isPowerShow('edit')">编辑</el-button
            >
            <el-popover
              placement="bottom"
              title="操作确认"
              width="400"
              v-if="$isPowerShow('del')" 
              v-model="visible">
              <div class="show-flex-box-r" >
                <span style="margin-right: 10px; color: #FF9900;" class="show-flex-box-r">
                  <i class="el-icon-question" style="font-size: 25px;"></i>
                </span>
                <div class="show-flex-box-c" >
                  <p style="font-size: 18px; margin-bottom: 5px;">{{`${`该类目下有${total}个内容`}`}}。确认删除吗</p>
                  <!-- <span style="color:#F56C6C">是否确定删除？</span> -->
                </div>
              </div>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="suerDeleteClassifyGroup()">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;" :disabled="!!curSelectedDepartment && curSelectedDepartment.id == 0 && !loading">删除</el-button>
            </el-popover>
          </div>
          <template-project-tree
            ref="organizationTree"
            :loading="organizationloading"
            :organizationTreeList="organizationTreeList"
            :organizationTreeListLength="organizationTreeListLength"
            @on-tree="selectDepartment"
            @refresh-tree="refreshTreeList"
          ></template-project-tree>
        </div>
      </el-card>
      <el-card class="box-card center-box" ref="centerBox" v-if="!!curSelectedDepartment">
        <div class="department-detail show-flex-box-c" v-loading="loading">
          <sub-req
            ref="head"
            :isShowSortButton="!!curSelectedDepartment.id"
            :isSort="isSort"
            @on-add="openAddPage"
            @on-ok="onSubmit"
            @adjust-sort-set="adjustSortSet"
          ></sub-req>
          <div v-if="!isSort">
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
          </tr-table>
          </div>
          <div v-else>
            <table-draggable-sort
              :defaultSortProps="defaultSortProps"
              :TableHeight="TableHeight"
              :tableConfig="tableConfig"
              :dataInfoList="data"
              :frontFixedNum="2"
              :backFixedNum="1"
            ></table-draggable-sort>
          </div>
        </div>
      </el-card>
      <el-card class="box-card center-box show-flex-box-r show-flex-center" v-else>
        <el-empty description="暂无工资条模板"></el-empty>
      </el-card>
    </div>
    <div class="organization-project-dialog">
      <add-classify-dialog
         ref="addClassifyDialog"
        :dialogBool.sync="isShowAddClassifyDialog"
        :curType="curType"
        @save-add-edit-organization="saveAddEditOrgClassifyInfo"
      ></add-classify-dialog>

      <set-info-dialog
        ref="setOrganizationInfo"
        :dialogBool.sync="isShowSetInfoDialog"
        :organizationTreeList="organizationTreeList"
        :requiredIDs="requiredIDs"
        @save-add-edit="saveAddEdit"
      ></set-info-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import templateProjectTree from "./component/template-project-tree";
import subReq from "./component/sub-req";
import addClassifyDialog from "./dialog/add-classify-dialog"
import setInfoDialog from "./dialog/set-info-dialog"
import tableDraggableSort from "@/components/tableDraggableSort";
export default {
  name: "assessment-template",
  components: {
    templateProjectTree,
    subReq,
    addClassifyDialog,
    tableDraggableSort,
    setInfoDialog,
  },
  data() {
    return {
      total: '',
      visible: false,
      organizationloading: false,
      organizationTreeList: [],
      organizationTreeListLength:0,
      curType: 'add', //添加分类
      curSelectedDepartment:null, //当前选中的组织树节点
      isShowAddClassifyDialog: false, // 添加项目分类弹窗
      data:[], //列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 2, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "项目名称",
          prop: "item_name",
          width: "300",
          align: "center",
          signIndex: 0,
        },
      ],
      loading: false,
      TableHeight:500,
      form:{}, //查询表单数据
      previewForm: {},
      selectedProjectIds:[], //勾选中要删除的IDs

      // 排序
      isSort: false, //是否排序
      tableConfig: {
        tableItems: [
          {
            label: "项目名称",
            prop: "label",
            width: "130",
            align: "center",
          },
          {
            label: "上下拖拽调整排序",
            prop: "sort",
            width: "190",
            align: "center",
          },
        ],
      },
      newTableData:[], //排序后的数据
      defaultSortProps:{
        value: "id",
        label: "item_name",
        sort: "sort",
      },

      isShowSetInfoDialog: false,
      previewDialogVisible: false,
      requiredIDs: []
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
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - 85 -th;
      }, 60);
    },
    // 刷新维修组织分类
    refreshTreeList() {
      this.loading = true;
      this.organizationloading = true;
      this.loadOrganizationTree();
      // 重新定位到目前组织树中
      this.curSelectedDepartment.id = this.organizationTreeList[0].id
      this.locationCurNode();
    },
    // 获取组织tree信息
    loadOrganizationTree() {
      this.$client.GetPaySlipTemplates()
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
      this.isSort = false; //切换分类 停止排序
      setTimeout(() => {
        this.$refs.head.onSubmit();
      },50)
    },
    // 获取列表
    // isCurDepartment //是否是当期组织还是上级组织
    reqOrgProjectList() {
      this.loading = true;
      let params = {
        id: this.curSelectedDepartment.id,
      }
      params = Object.assign({},params,this.form)
      this.previewForm = params
      this.$client.GetItemByTemplateId(params)
      .then(res => {
        if (res.head.result == "200") {
          this.data = res.context
          this.requiredIDs = []
          this.data.forEach(item => {
            if (item.is_default) {
              this.requiredIDs.push(item.id)
            }
          })
          this.total = this.data.length
          // 总分类下需要分页
          this.isSort = false
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
      this.reqOrgProjectList(true);
    },
    // 头部事件抛出
    openAddPage(type) {
      switch (type) {
        case "add":
          let ids = []
          this.data.forEach(item => {
            ids.push(item.id)
          })
          this.isShowSetInfoDialog = true
          this.$nextTick(() => {
            this.$refs.setOrganizationInfo.ruleForm.template_id = this.curSelectedDepartment.id
            this.$refs.setOrganizationInfo.ruleForm.item_ids = ids
          })
          break;
        case "delete": //删除
          this.deleteSelectedUserInfo()
          break;
      }
    },
    // 打开编辑分类弹窗
    openSetOrganizationInfoDialog(type) {
      this.curType = type;
      if(!!this.curSelectedDepartment && this.curType == 'edit') {
        this.$refs.addClassifyDialog.ruleForm.template_id = this.curSelectedDepartment.id;
        this.$refs.addClassifyDialog.ruleForm.template_name = this.curSelectedDepartment.template_name;
      }

      this.isShowAddClassifyDialog = true;
    },
    // 添加、编辑保存分类
    saveAddEditOrgClassifyInfo(form) {
      let successrMessage = '';
      let params = {
        context: form
      }
      if (this.curType == "add") {
        successrMessage = "添加成功";
      }else {
        successrMessage = "编辑成功";
      }
      this.$client.AddOrUpdatePaySlipTemplate(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadOrganizationTree();
            // 重新定位到目前组织树中
            this.locationCurNode();
            this.isShowAddClassifyDialog = false;
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
      .catch((err) => {});
      
    },
    // 删除分类
    suerDeleteClassifyGroup() {
      let params = {
        context: this.curSelectedDepartment.id
      }
      this.$client
        .DeletePaySlipTemplate(params)
        .then((res) => {
          if (res.head.result == "200") {
            // 排序成功重新加载组织树
            this.loadOrganizationTree();
            // 重新定位到目前上一级组织树中
            this.locationParentNode()
            this.visible = false;
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
            this.visible = false;
          }
        })
        .catch((err) => {
          this.visible = false;
        });
    },
    // 重新定位到目前组织树中
    locationCurNode() {
      let ids= [];
      ids.push(this.curSelectedDepartment.id);
      this.$refs.organizationTree.setSelecedCheckedKeys(ids);
    },
    //重新定位到目前上一级组织树中
    locationParentNode() {
      let ids= [];
      ids.push(this.curSelectedDepartment.group_id);
      this.$refs.organizationTree.setSelecedCheckedKeys(ids);
    },
    // 选中表格勾选框
    selectedUserList(projectList) {
      this.selectedProjectIds = [];
      projectList.forEach((item,index) => {
        this.selectedProjectIds.push(item.id)
      });
    },
    // 排序
    adjustSortSet(isSort){
      this.isSort = !this.isSort
      if(isSort) {
        console.log('newTableData',JSON.parse(JSON.stringify(this.newTableData)));
        let ids = this.newTableData.map(item => {return item.value})
        let params = {
          template_id: this.curSelectedDepartment.id,
          item_ids: ids
        }
        this.saveAddEdit(params,'排序成功')
      }
    },
    // 监听更新排序函数
    updateSortInfo(tableData) {
      this.newTableData= [...tableData]
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
      this.deleteRowInfo()
    },
    // 删除关联关系
    deleteRowInfo() {
      let isHave = false
      for (let index = 0; index < this.requiredIDs.length; index++) {
        if (this.selectedProjectIds.includes(this.requiredIDs[index])) {
          isHave = true
        }
      }
      if (isHave) {
        this.$message({
          showClose: true,
          message: '工资库中姓名和手机号不可删除',
          type: "warning",
        });
        return
      }
      let allIDs = this.data.map(item => {return item.id})
      
      let ids = allIDs.filter(item => {
        return !this.selectedProjectIds.includes(item)
      })

      let params = {
        template_id: this.curSelectedDepartment.id,
        item_ids: ids
      }
      this.saveAddEdit(params,'删除成功')
    },
    saveAddEdit(form,message) {
      this.$client.AddTemplateItem({context:form})
      .then(res => {
        if (res.head.result == "200") {
          this.isShowSetInfoDialog = false
          this.reqOrgProjectList()
          this.$message({
            showClose: true,
            message: message,
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
.water-management-box{
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

.water-management /deep/ .el-card__header {
  background-color: #F5F5F5;
  padding: 12px 20px;
}

.superior-department-content {
  margin-bottom: 30px;
}

.dialog-box /deep/ .el-dialog{
  height: 90%;
}

.dialog-box /deep/ .el-dialog__body {
  height: calc(100% - 20px);
}
</style>
