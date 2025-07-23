<template>
  <div class="water-management-box">
    <div class="water-management">
      <el-card class="box-card left-box">
        <div
          slot="header"
          class="clearfix show-flex-box-r"
          style="height: 37px; align-items:center;"
        >
          <span style="white-space:nowrap;">考核模板</span>
        </div>
        <div class="show-flex-box-c">
          <div class="show-flex-box-r" style="margin-bottom:15px;">
            <el-button style="margin-left: 15px" type="primary" size="mini" @click="openSetOrganizationInfoDialog('add')">添加</el-button
            >
            <el-button style="margin-left: 15px" type="primary" size="mini" :disabled="curSelectedDepartment.id == 0"
            @click="openSetOrganizationInfoDialog('edit')" v-if="!!curSelectedDepartment && $isPowerShow('editType')">编辑</el-button
            >
            <el-popover
              placement="bottom"
              title="操作确认"
              width="400"
              v-if="$isPowerShow('delType')" 
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
            :isSave="isSave"
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
              <template slot-scope="scope" slot="operation">
                <!-- <el-button type="text" size="mini" style="margin-left: 10px;" v-if="$isPowerShow('edit')" @click="editRowInfo(scope.data)">编辑</el-button> -->
                <el-popconfirm
                  @confirm="deleteRowInfo(scope.data)"
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
      <el-card class="box-card center-box show-flex-box-r show-flex-center" v-else>
        <el-empty description="暂无考核内容信息"></el-empty>
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
        :curSelecedType="curSelecedType"
        @save-add-edit="saveAddEdit"
      ></set-info-dialog>

      <el-dialog
        :visible.sync="isShowContentDialog"
        :close-on-click-modal="false"
        top="5px"
        width="80%"
        class="dialog-box">
        <content-box
          ref="contentBox"
          @on-save="saveContent"
          @on-close="isShowContentDialog = false">
        </content-box>
      </el-dialog>
      
      <file-dialog
        :dialogBool.sync="filedialogVisible"
        :fileData="FileData"
        :typeMessage="'考核内容管理'"
        @on-submit-excel="onSubmitExcel"
      ></file-dialog>

      <preview-dialog
        :dialogBool.sync="previewDialogVisible"
        :data="data"
        :form="previewForm"
      ></preview-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import templateProjectTree from "./component/template-project-tree";
import subReq from "./component/sub-req";
import addClassifyDialog from "./dialog/add-classify-dialog"
import setInfoDialog from "./dialog/set-info-dialog"
import previewDialog from "./dialog/preview-dialog"
import fileDialog from "@/components/fileDialog/file-dialog.vue";
import tableDraggableSort from "@/components/tableDraggableSort";
import contentBox from './content-box'
export default {
  name: "assessment-template",
  components: {
    templateProjectTree,
    subReq,
    addClassifyDialog,
    fileDialog,
    tableDraggableSort,
    contentBox,
    setInfoDialog,
    previewDialog
  },
  data() {
    return {
      // pageInfo: {
      //   pageIndex: 1,
      //   pageSize: 50,
      //   pageCount: 0,
      // },
      total: '',
      visible: false,
      organizationloading: false,
      organizationTreeList: [],
      organizationTreeListLength:0,
      curType: 'add', //添加分类
      curSelecedType: 'edit', //添加
      isShowContentDialog: false,
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
          label: "分数明细",
          prop: "score",
          width: "100",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "最高评分",
          prop: "max_score",
          width: "100",
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
        {
          id: 8,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 7,
        },
      ],
      loading: false,
      TableHeight:500,
      filedialogVisible:false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/考核内容管理模板.xlsx`,
      },
      form:{}, //查询表单数据
      previewForm: {},
      selectedProjectIds:[], //勾选中要删除的IDs


      // 排序
      isSort: false, //是否排序
      isSave: true, //是否保存
      tableConfig: {
        tableItems: [
        {
          label: "指标分类",
          prop: "group_name",
          width: "130",
          align: "center",
        },
        {
          label: "考核内容",
          prop: "label",
          width: "130",
          align: "center",
        },
        {
          label: "指标值及要求",
          prop: "demand",
          width: "200",
          align: "center",
        },
        {
          label: "分数明细",
          prop: "score",
          width: "100",
          align: "center",
        },
        {
          label: "最高评分",
          prop: "max_score",
          width: "100",
          align: "center",
        },
        {
          label: "考核标准",
          prop: "standard",
          width: "130",
        },
        {
          label: "备注",
          prop: "remark",
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
        label: "content",
        sort: "i_order",
        group_name:"group_name",
        demand:"demand",
        score:"score",
        max_score:"max_score",
        standard:"standard",
        remark:"remark",
      },

      isShowSetInfoDialog: false,
      previewDialogVisible: false,
      
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
    // 保存内容
    saveContent(list) {
      this.data = this.unique([...this.data,...list])
      this.isShowContentDialog = false
      this.isSave = false

    },
    //去重
    unique(arr) {
      let map = new Map();
      for (let item of arr) {
        map.set(item.id, item);
      }
      return [...map.values()];
    },
    // 计算高吨
    setHead(departmentInfo) {
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
      this.curSelectedDepartment = null
      this.loadOrganizationTree();
      // // 重新定位到目前组织树中
      // this.curSelectedDepartment.id = this.organizationTreeList[0].id
      // this.locationCurNode();
    },
    // 获取组织tree信息
    loadOrganizationTree() {
      // this.organizationloading = true;
      this.$client.GetAllAssessModel()
      .then(res => {
        if (res.head.result == "200") {
          this.organizationTreeList = res.context;
          if (!this.curSelectedDepartment) {
            this.curSelectedDepartment = {
              id: this.organizationTreeList[0].id
            }
          }
          this.locationCurNode()
          // this.organizationTreeListLength = this.organizationTreeList.length;
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
      //  }
      },50)
    },
    // 获取列表
    // isCurDepartment //是否是当期组织还是上级组织
    reqOrgProjectList() {
      this.loading = true;
      let params = {
        temp_id: this.curSelectedDepartment.id,
        page_index: 1,
        page_size: 999
      }
      params = Object.assign({},params,this.form)
      this.previewForm = params
      this.$client.GetAssessModelContentByPage(params)
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.data = res.context.list;
          this.total = res.context.total
          // 总分类下需要分页
          this.isSort = false
          this.loading = false;
          this.isSave = true
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
      console.log(this.form);
      this.reqOrgProjectList(true);
    },
    // 头部事件抛出
    openAddPage(type) {
      switch (type) {
        case "add":
          this.isShowContentDialog = true;
          this.$nextTick(() => {
            this.$refs.contentBox.refreshTreeList()
          })
          break;
        case 'save':
          if (!this.curSelectedDepartment.id) {
            this.$message({
              showClose: true,
              message: '请选择考核模板',
              type: "error",
            });
            return
          }
          this.AssessModelContent()
          this.isSave = true
          break
        case "import":
          this.filedialogVisible = true;
          break;
        case 'preview':
          this.previewDialogVisible = true
          break
        case "delete": //删除
          this.deleteSelectedUserInfo()
          break;
        case "export": //导出
          this.onExport()
          break;
      }
    },
    // 保存模板内容 
    AssessModelContent() {
      let ids = this.data.map(item => {return item.id})
      let params = {
        temp_id: this.curSelectedDepartment.id,
        type: 1,
        content_ids: ids
      }
      this.$client.SetAssessModelContent({context:params})
      .then(res => {
        if (res.head.result == "200") {
          // this.reqOrgProjectList()
          this.loadOrganizationTree()
          
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
    },
    onExport() {
      let params = Object.assign({}, this.previewForm);
      this.$client.ExportAssessModel(params).then((res) => {
        if(res.head) {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        }else{
          this.$message({ type: "warning", message: "暂无可导出内容" });
        }
        
      });
    },
    //  // 分页切换事件
    // handleCurrentChange(idx) {
    //   this.pageInfo.pageIndex = idx;
    //   this.reqOrgProjectList(true);
    // },
    // // 切换每页条数
    // handleSizeChange(sizes) {
    //   this.pageInfo.pageIndex = 1;
    //   this.pageInfo.pageSize = sizes;
    //   this.pageInfo.pageCount = 0;
    //   this.reqOrgProjectList(true);
    // },
    // 导入
    onSubmitExcel(val) {
      let formData = new FormData();
      formData.append("temp_id", this.curSelectedDepartment.id);
      formData.append("file", val.file);
      formData.append("type", val.radio);
      let params = formData;
      this.$client.ImportAssessModelContent(params)
      .then(res => {
        if(res.head.result == "200") {
          this.form = {};
          this.reqOrgProjectList(true);
          this.filedialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        } else if(res.head.result == "205") {
          this.filedialogVisible = false;
          let list = res.context
          if(!!list && list.length > 0) {
            let errorData = [];
            let h = this.$createElement;
            list.forEach(element => {
              errorData.push(h('p',null,element));
            });
            this.$msgbox({
              title: `录入提示(共${list.length}条)`,
              message: h('div',{ style: `height: 300px;${list.length > 12?'overflow-y: scroll':''}`}, errorData),
              confirmButtonText: '确定',
            })
          }
        } else{
          this.filedialogVisible = false;
          this.$message({ message: res.head.describle, type: "error" });
        }
      })
    },
    // 打开编辑分类弹窗
    openSetOrganizationInfoDialog(type) {
      this.curType = type;
      if(!!this.curSelectedDepartment && this.curType == 'edit') {
        this.$refs.addClassifyDialog.ruleForm.id = this.curSelectedDepartment.id;
        this.$refs.addClassifyDialog.ruleForm.temp_name = this.curSelectedDepartment.temp_name;
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
        delete form.id
        this.$client
        .AddAssessModel(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.curSelectedDepartment = null
            this.loadOrganizationTree();
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
      } else {
        successrMessage = "编辑成功";
        this.$client
        .UpdateAssessModel(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadOrganizationTree();
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
      }
    },
    // 删除分类
    suerDeleteClassifyGroup() {
      let params = {
        context: this.curSelectedDepartment.id
      }
      this.$client
        .DeleteAssessModel(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.curSelectedDepartment = null
            // 排序成功重新加载组织树
            this.loadOrganizationTree();
            // // 重新定位到目前上一级组织树中
            // this.locationParentNode()
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
      console.log('========',ids);
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
          temp_id: this.curSelectedDepartment.id,
          type: 3,
          content_ids: ids
        }
        this.$client.SetAssessModelContent({context:params})
        .then(res => {
          if (res.head.result == "200") {
              this.reqOrgProjectList(true);
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
      this.deleteRowInfo(null)
    },
    // 删除关联关系
    deleteRowInfo(row) {
      let content_ids = []
      if(!!row) {
        content_ids = [row.id]
      }else{
        content_ids = this.selectedProjectIds
      }
      this.data = this.data.filter(item => {
        return !content_ids.includes(item.id)
      })
      this.isSave = false
      // let params = {
      //   temp_id: this.curSelectedDepartment.id,
      //   type: 2,
      //   content_ids: []
      // };
      // if(!!row) {
      //   params.content_ids = [row.id]
      // }else{
      //   params.content_ids = this.selectedProjectIds
      // }
      // this.$client.SetAssessModelContent({context:params})
      // .then(res => {
      //   if (res.head.result == "200") {
      //     this.reqOrgProjectList()
      //     this.$message({
      //       showClose: true,
      //       message: '删除成功',
      //       type: "success",
      //     });
      //   } else {
      //     this.$message({
      //       showClose: true,
      //       message: res.head.describle,
      //       type: "error",
      //     });
      //   }
      // })
    },
    // 编辑考核内容
    editRowInfo(info) {
      this.curSelecedType = 'eidt';
      if(!!info) {
        let newForm = {...info};
        setTimeout(() => {
          for (const key in this.$refs.setOrganizationInfo.ruleForm) {
            if (Object.hasOwnProperty.call(newForm, key)) {
              this.$refs.setOrganizationInfo.ruleForm[key] = newForm[key]
            }
          }
          this.$refs.setOrganizationInfo.ruleForm.group_id = newForm.group_id || ''
          this.$refs.setOrganizationInfo.ruleForm.temp_id = this.curSelectedDepartment.id
          this.$refs.setOrganizationInfo.files = newForm.files
          this.$refs.setOrganizationInfo.imgs = newForm.imgs
        },100)
      }
      this.isShowSetInfoDialog = true;
    },
    // 编辑考核内容
    saveAddEdit(form){
      let successrMessage = "编辑成功";
      this.$client
      .UpdateAssessContent({context:form})
      .then((res) => {
        if (res.head.result == "200") {
          this.reqOrgProjectList(true);
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
      .catch((err) => {});
    }
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
