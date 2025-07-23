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
          <div class="show-flex-box-r" style="margin-bottom:15px;" v-if="!!curSelectedDepartment">
            <el-button style="margin-left: 15px" type="primary" size="mini" @click="openSetOrganizationInfoDialog('add')">添加</el-button
            >
            <el-button style="margin-left: 15px" type="primary" size="mini" :disabled="curSelectedDepartment.id == 0"
            @click="openSetOrganizationInfoDialog('edit')" v-if="$isPowerShow('editType')">编辑</el-button
            >
            <el-popover
              placement="bottom"
              title="操作确认"
              width="400"
              v-model="visible">
              <div class="show-flex-box-r" >
                <span style="margin-right: 10px; color: #FF9900;" class="show-flex-box-r">
                  <i class="el-icon-question" style="font-size: 25px;"></i>
                </span>
                <div class="show-flex-box-c" >
                  <p style="font-size: 18px; margin-bottom: 5px;">{{`${`该类目下有${pageInfo.pageCount}个内容`}`}}。确认删除吗</p>
                  <!-- <span style="color:#F56C6C">是否确定删除？</span> -->
                </div>
              </div>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="suerDeleteClassifyGroup()">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;" v-if="$isPowerShow('delType')" :disabled="curSelectedDepartment.id == 0 && !loading">删除</el-button>
            </el-popover>
          </div>
          <maintenance-project-tree
            ref="organizationTree"
            :loading="organizationloading"
            :placeholder="placeholder"
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
              <template slot-scope="scope" slot="enable">
                <el-switch
                  v-model="scope.data.enable"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="1"
                  :inactive-value="0"
                  @change="stateChange(scope.data)"
                  >
                </el-switch>
              </template>
              <template slot-scope="scope" slot="operation">
                <el-button type="text" size="mini" style="margin-left: 10px;" v-if="$isPowerShow('edit')"  @click="editRowInfo(scope.data)">编辑</el-button>
                <el-popconfirm
                  @confirm="deleteRowInfo(scope.data)"
                  title="确定删除此条记录吗？"
                   v-if="$isPowerShow('del')">
                  <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;color:red">删除</el-button>
                </el-popconfirm>
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
        :organizationTreeList="organizationTreeList"
        @save-add-edit="saveAddEdit"
      ></set-info-dialog>
      <file-dialog
        :dialogBool.sync="filedialogVisible"
        :fileData="FileData"
        :typeMessage="'考核内容管理'"
        @on-submit-excel="onSubmitExcel"
      ></file-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import maintenanceProjectTree from "./component/maintenance-project-tree";
import subReq from "./component/sub-req";
import setInfoDialog from "./component/set-info-dialog"
import addClassifyDialog from "./component/add-classify-dialog"
import fileDialog from "@/components/fileDialog/file-dialog.vue";
import tableDraggableSort from "@/components/tableDraggableSort";

export default {
  name: "assessment-content",
  components: {
    maintenanceProjectTree,
    subReq,
    addClassifyDialog,
    setInfoDialog,
    fileDialog,
    tableDraggableSort
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 50,
        pageCount: 0,
      },
      visible: false,
      placeholder: "请输入关键词",
      organizationloading: false,
      organizationTreeList: [],
      organizationTreeListLength:0,
      curType: 'add', //添加分类
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
          label: "状态",
          prop: "enable",
          width: "120",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "备注",
          prop: "remark",
          width: "130",
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
      filedialogVisible:false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/考核内容管理模板.xlsx`,
      },
      form:{}, //查询表单数据

      selectedProjectIds:[], //勾选中要删除的IDs
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
        this.TableHeight = maxh - 85 -th;
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
      // this.$refs.head.onSubmit();
      setTimeout(() => {
        // this.$refs.addClassifyDialog.parents_type = departmentInfo.type;
        // this.$refs.addClassifyDialog.ruleForm.parent_id = departmentInfo.id;
        // this.$refs.addClassifyDialog.grandfather_id = departmentInfo.parent_id;
        // // type 0总组织
        // if(departmentInfo.id === 0) {
        //   this.$refs.addClassifyDialog.ruleForm.type = 1;
        // }

        // if(departmentInfo.type === 1) {
        //   this.$refs.addClassifyDialog.ruleForm.type = 2;
        //   this.$refs.setOrganizationInfo.ruleForm.parent_id = departmentInfo.id;
        // }
        // if(departmentInfo.type === 2) {
        //   this.$refs.setOrganizationInfo.ruleForm.parent_id = departmentInfo.parent_id;
        //   this.$refs.setOrganizationInfo.ruleForm.water_id = departmentInfo.id;
        // }
        // 查询
      //  if(departmentInfo.type !=0) {
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
    // 编辑
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
          this.$refs.setOrganizationInfo.files = newForm.files
          this.$refs.setOrganizationInfo.imgs = newForm.imgs
        },100)
      }
      this.isShowSetInfoDialog = true;
    },
    // 添加
    saveAddEdit(form) {
      let successrMessage = '';
      let params = {
        context: form
      }
      if (this.curSelecedType == "add") {
        successrMessage = "添加成功";
        delete form.id
        this.$client
        .AddAssessContent(params)
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
      } else {
        successrMessage = "编辑成功";
        this.$client
        .UpdateAssessContent(params)
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
    // 导入
    onSubmitExcel(val) {
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      let params = formData;
      this.$client.ImportAssessContent(params)
      .then(res => {
        if(res.head.result == "200") {
          this.form = {};
          this.pageInfo.pageIndex = 1;
          this.pageInfo.pageCount = 0;
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
        this.$refs.addClassifyDialog.ruleForm.group_id = this.curSelectedDepartment.group_id;
        this.$refs.addClassifyDialog.ruleForm.name = this.curSelectedDepartment.name;
        this.$refs.addClassifyDialog.ruleForm.reamrk = this.curSelectedDepartment.reamrk;
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
        .AddAssessGroup(params)
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
      } else {
        successrMessage = "编辑成功";
        this.$client
        .UpdateAssessGroup(params)
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
      }
    },
    // 删除分类
    suerDeleteClassifyGroup() {
      let params = {
        context: this.curSelectedDepartment.id
      }
      this.$client
        .DeleteAssessGroup(params)
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
      this.$client.DeleteAssessContent(params)
      .then(res => {
        if (res.head.result == "200") {
          // 重新加载列表详情
          this.reqOrgProjectList(true);
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
    stateChange(data){
      let params = {
        enable:data.enable,
        ids:[data.id]
      }
      this.$client.StopAssessContent({context:params}).then(req => {
        if (req.head.result === '200') {
          this.reqOrgProjectList()
          this.$message({type: 'success', message: '操作成功'})
        }else{
          this.$message({type: 'error', message: '操作失败'})
        }
      })
    },
    onExport() {
      let params = Object.assign({}, this.form);
      this.$client.ExportAssessContent(params).then((res) => {
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
</style>
