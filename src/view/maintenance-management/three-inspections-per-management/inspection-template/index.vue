<template>
  <div class="inspection-template-box">
    <div class="inspection-template">
      <el-card class="box-card left-box">
        <div
          slot="header"
          class="clearfix show-flex-box-r"
          style="height: 37px; align-items:center;"
        >
          <span style="white-space:nowrap;">检查模板</span>
        </div>
        <div class="show-flex-box-c">
          <div class="show-flex-box-r" style="margin-bottom:15px;">
            <el-button style="margin-left: 15px" type="primary" size="mini" @click="openSetOrganizationInfoDialog('add')">添加</el-button
            >
            <el-button style="margin-left: 15px" type="primary" size="mini" :disabled="!curSelectedDepartment.template_id"
            @click="openSetOrganizationInfoDialog('edit')" v-if="!!curSelectedDepartment && $isPowerShow('editType')">编辑</el-button
            >
            <el-popover
              placement="bottom"
              title="操作确认"
              width="290"
              v-if="$isPowerShow('delType')" 
              v-model="visible">
              <div class="show-flex-box-r" >
                <span style="margin-right: 10px; color: #FF9900;" class="show-flex-box-r">
                  <i class="el-icon-question" style="font-size: 22px;"></i>
                </span>
                <div class="show-flex-box-c" >
                  <p style="font-size: 16px; margin-bottom: 5px;">确认删除吗</p>
                </div>
              </div>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="suerDeleteClassifyGroup()">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;" :disabled="!!curSelectedDepartment && !curSelectedDepartment.template_id && !loading">删除</el-button>
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
            :isSort="isSort"
            :isShowSortButton="!!curSelectedDepartment.template_id"
            @on-add="openAddPage"
            @on-ok="onSubmit"
            @adjust-sort-set="adjustSortSet"
          ></sub-req>
          <div style="display: flex;align-items: center;margin-bottom: 8px;">
            <span style="width: 100px;font-size: 18px;">适配车辆：</span>
              <get-vehicle-select-tree
                ref="vehicleTree"
                :placeholder="'选择车辆'"
                :isShowCheckbox="true"
                :isExportMultiple="true"
                :width="500"
                v-model="vehicle_ids">
              </get-vehicle-select-tree>
          </div>
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
              <template slot-scope="scope" slot="operation">
                <el-popconfirm
                  @confirm="deleteRowInfo(scope.index)"
                  title="确定删除此条记录吗？"
                  v-if="$isPowerShow('del')">
                  <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;color:red" >删除</el-button>
                </el-popconfirm>
              </template>
            </tr-table>
          </div>
          <div v-else>
            <table-draggable-sort
              :defaultSortProps="defaultSortProps"
              :TableHeight="TableHeight"
              :tableConfig="tableConfig"
              :dataInfoList="data"
            ></table-draggable-sort>
          </div>
        </div>
      </el-card>
    </div>
    <div class="organization-project-dialog">
      <add-classify-dialog
         ref="addClassifyDialog"
        :dialogBool.sync="isShowAddClassifyDialog"
        :curType="curType"
        @save-add-edit-organization="saveAddEditOrgClassifyInfo"
      ></add-classify-dialog>

      <el-dialog
        :visible.sync="isShowContentDialog"
        :close-on-click-modal="false"
        top="5px"
        width="70%"
        title="新增"
        class="dialog-box">
        <content-box
          ref="contentBox"
          @on-save="saveContent"
          @on-close="isShowContentDialog = false">
        </content-box>
      </el-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import templateProjectTree from "./component/template-project-tree";
import subReq from "./component/sub-req";
import addClassifyDialog from "./dialog/add-classify-dialog"
import fileDialog from "@/components/fileDialog/file-dialog.vue";
import tableDraggableSort from "@/components/tableDraggableSort";
import contentBox from './content-box'
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
export default {
  name: "inspection-template",
  components: {
    templateProjectTree,
    subReq,
    addClassifyDialog,
    fileDialog,
    tableDraggableSort,
    contentBox,
    getVehicleSelectTree
  },
  data() {
    return {
      visible: false,
      organizationloading: false,
      organizationTreeList: [],
      organizationTreeListLength:0,
      curType: 'add', //添加分类
      isShowContentDialog: false,
      // isFirstOrganization: false,
      curSelectedDepartment: {
        id: ''
      }, //当前选中的组织树节点
      isShowAddClassifyDialog: false, // 添加项目分类弹窗
      data:[], //列表
      classifyOptions1: [], //所属类别列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
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
        {
          id: 5,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 4,
        }
      ],
      loading: false,
      TableHeight:500,
      filedialogVisible:false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/考核内容管理模板.xlsx`,
      },
      form:{}, //查询表单数据
      selectedProjectIds:[], //勾选中要删除的IDs
      // 排序
      isSort: false, //是否排序
      tableConfig: {
        tableItems: [
        {
          label: "检查项目名称",
          prop: "check_name",
          width: "150",
          align: "center",
        },
        {
          label: "项目内容",
          prop: "check_content",
          width: "130",
          align: "center",
        },
        {
          label: "技术要求",
          prop: "technical_require",
          width: "130",
          align: "center",
        },
        {
          label: "风险等级",
          prop: "risk_level_name",
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
        label: "check_name",
        sort: "sort",
        check_name:"check_name",
        check_content:"check_content",
        technical_require:"technical_require",
        risk_level_name:"risk_level_name",
      },

      isShowSetInfoDialog: false,
      vehicle_ids: []
    };
  },
  mounted() {
    this.loadOrganizationTree();
    this.$nextTick(() => {
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  methods: {
    // 保存内容
    saveContent(list) {
      this.isShowContentDialog = false
      this.data = this.unique([...this.data,...list])
    },
    //去重
    unique(arr) {
      let map = new Map();
      for (let item of arr) {
        map.set(item.id, item);
      }
      return [...map.values()];
    },
    // 刷新
    refreshTreeList() {
      this.loading = true;
      this.organizationloading = true;
      this.loadOrganizationTree();
      setTimeout(() => {
        // 重新定位到目前组织树中
        this.locationCurNode();
      }, 300);
    },
    // 获取组织tree信息
    loadOrganizationTree() {
      this.organizationloading = true;
      this.$client.GetCheckTemplateTreesDayCheck()
      .then(res => {
        if (res.head.result == "200") {
          this.organizationTreeList = res.context;
          this.organizationTreeListLength = this.organizationTreeList.length;
          // this.classifyOptions1 =res.context[0].children
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
    selectDepartment(info,infoNode) {
      this.curSelectedDepartment = infoNode.data;
      if (!infoNode) {
        this.locationCurNode();
        return
      }
      if(infoNode.parent.data.type_id){
        this.curSelectedDepartment.parentId = infoNode.parent.data.type_id
      }
      //获取父节点的分类id
      this.form = {}; //搜索置空
      this.setHead(infoNode.data)
      this.isSort = false; //切换分类 停止排序
      if(!!this.curSelectedDepartment.template_id){
        setTimeout(() => {
        this.$refs.head.onSubmit();
      //  }
      },50)
      }
    },
    // 获取列表
    reqOrgProjectList() {
      this.loading = true;
      let params = {  
        id: this.curSelectedDepartment.template_id,
      }
      params = Object.assign({},params,this.form)
      this.$refs.vehicleTree.onClear()
      this.$client.GetContentsByTemplateIdDayCheck(params)
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.data = res.context.checkContents || [];
          this.vehicle_ids = res.context.vehicle_ids || []
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
          this.isShowContentDialog = true;
          break;
        case "import":
          this.filedialogVisible = true;
          break;
        case "delete": //删除
          this.deleteSelectedUserInfo()
          break;
        case "save": //保存
          this.onSave()
          break;
      }
    },
    onSave(){
      if (!this.curSelectedDepartment.template_id) {
        this.$message({
          showClose: true,
          message: '请选择检查模板',
          type: "warning",
        });
        return
      }
      if (this.data.length == 0) {
        this.$message({
          showClose: true,
          message: '请添加要关联的检查内容',
          type: "warning",
        });
        return
      }

      if (this.vehicle_ids.length == 0) {
        this.$message({
          showClose: true,
          message: '请选择要适配的车辆',
          type: "warning",
        });
        return
      }
      let content_ids = this.data.map(item => {
        return item.id
      })
      let params = {
        content_ids: content_ids,
        vehicle_ids: this.vehicle_ids,
        id: this.curSelectedDepartment.template_id,
        template_name: this.curSelectedDepartment.template_name,
        type: this.curSelectedDepartment.parentId,
      }
      this.$client.AddOrUpdateTemplateContent({context:params}).then(res => {
        if (res.head.result == "200") {
          this.curSelectedDepartment.template_id = res.context
          this.refreshTreeList()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })

    },
    // 打开编辑分类弹窗
    openSetOrganizationInfoDialog(type) {
      this.curType = type;
      if(!!this.curSelectedDepartment && this.curType == 'edit') {
        this.$refs.addClassifyDialog.ruleForm.id = this.curSelectedDepartment.template_id;
        this.$refs.addClassifyDialog.ruleForm.type = this.curSelectedDepartment.parentId;
        this.$refs.addClassifyDialog.ruleForm.template_name = this.curSelectedDepartment.template_name;
      }
      this.isShowAddClassifyDialog = true;
      // this.isShowContentDialog = true
    },
    // 添加、编辑保存分类
    saveAddEditOrgClassifyInfo(form) {
      let successrMessage = '';
      if (this.curType == "add") {
        successrMessage = "添加成功";
        delete form.id
      }else{
        successrMessage = "编辑成功";
      }
      let params = {
        context: form
      }
      this.$client
      .AddOrUpdateTemplateDayCheck(params)
      .then((res) => {
        if (res.head.result == "200") {
          this.curSelectedDepartment.template_id = res.context
          this.refreshTreeList()

          // this.loadOrganizationTree();
          // // 重新定位到目前组织树中
          // this.locationCurNode();
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
        context: this.curSelectedDepartment.template_id
      }
      this.$client
        .DeleteTemplateDayCheck(params)
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
      ids.push(this.curSelectedDepartment.template_id);
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
          id: this.curSelectedDepartment.template_id,
          content_ids: ids
        }
        this.$client.SortTemplateContent({context:params})
        .then(res => {
          if (res.head.result == "200") {
              this.reqOrgProjectList();
              this.$message({
                showClose: true,
                message: '排序成功',
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

        })
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
      console.log(this.selectedProjectIds)
      this.data = this.data.filter(item => {
        return !this.selectedProjectIds.includes(item.id)
      })
    },
    // 删除列表数据
    deleteRowInfo(index) {
      this.data.splice(index,1)
    },
    // 计算高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - th - 95;
      }, 60);
    },
  },
  
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.inspection-template-box{
  width: 100%;
  height: 100%;
}
.inspection-template {
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

.inspection-template /deep/ .el-card__header {
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
