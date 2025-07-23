<template>
  <div class="asset-information-management">
    <el-card class="left-box">
      <div
        slot="header"
        class="clearfix show-flex-box-r"
        style="height: 37px; flex-wrap: nowrap; align-items:center;">
        <span style="white-space:nowrap;">资产分类</span>
      </div>
      <div class="show-flex-box-c">
        <div class="show-flex-box-r" style="margin-bottom:15px;flex-wrap: nowrap; justify-content: space-evenly;" v-if="!!curSelectedDepartment">
          <el-button type="primary" size="mini" :disabled="curSelectedDepartment.type == 2" @click="openassetInfoDialog('add')">添加分组</el-button>
          <el-button style="margin-left: 15px" type="primary" size="mini" :disabled="!curSelectedDepartment.type" @click="openassetInfoDialog('edit')">编辑分组</el-button>
          <el-popover
            placement="bottom"
            title="操作确认"
            width="400"
            v-model="visible">
            <div class="show-flex-box-r" style="">
              <span style="margin-right: 10px; color: #FF9900;" class="show-flex-box-r">
                <i class="el-icon-question" style="font-size: 25px;"></i>
              </span>
              <div class="show-flex-box-c" >
               <p style="font-size: 18px; margin-bottom: 5px;">{{`${`该分类下有${curSelectedDepartment.count}个资产`}`}}。确认删除吗</p>
                <!-- <span style="color:#F56C6C">是否确定删除？</span> -->
              </div>
            </div>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="suerDeleteClassifyGroup()">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;" :disabled="!curSelectedDepartment.type && !loading">删除</el-button>
          </el-popover>
        </div>
        <asset-classification-tree
          ref="organizationTree"
          :placeholder="placeholder"
          :loading="organizationloading"
          :organizationTreeList="organizationTreeList"
          :organizationTreeListLength="organizationTreeListLength"
          @on-tree="selectDepartment"
          @refresh-tree="refreshTreeList"
        ></asset-classification-tree>
      </div>
    </el-card>
    <el-card class="right-box">
      <sub-req
        ref="head"
        :curSelectedDepartment="curSelectedDepartment"
        @on-ok="onSubmit"
        @on-add="openAddPage"></sub-req>
      <tr-table
        :selectionShow="true"
        :data="tableData"
        :tableHeaderList="canRendererTableHeader"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading"
        @on-select-change-row="selectedUserList"
        :backFixedNum="backFixedNum">
        <template slot-scope="scope" slot="state_name">
          <div  v-if="scope.data.state == 0">
            <div>
              <p class = "mark" style="background-color: #67C23A;"></p> <span>{{scope.data.state_name}}</span>
            </div>
          </div>
          <div  v-else-if="scope.data.state == 1">
            <div>
              <p class = "mark" style="background-color: #409EFF;"></p> <span>{{scope.data.state_name}}</span>
            </div>
          </div>
          <div   v-else-if="scope.data.state == 2">
            <div>
              <p class = "mark" style="background-color: #909399;"></p> <span>{{scope.data.state_name}}</span>
            </div>
          </div>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-button type="text" size="mini" @click="openAddPage('detail',scope.data)">查看</el-button>
          <el-button type="text" size="mini" style="margin-left: 10px;" :disabled="scope.data.state == 2" @click="openAddPage('edit', scope.data)">编辑</el-button>
          <el-button type="text" size="mini" style="margin-left: 10px;" v-show="scope.data.state == 1" @click="openAddPage('back', scope.data)">归还</el-button>
          <el-button type="text" size="mini" style="margin-left: 10px;" v-show="scope.data.state == 0" @click="openAddPage('borrow', scope.data)">领用</el-button>
          <el-popconfirm
            v-show="scope.data.state == 0"
            @confirm="onScrapAsset(scope.data.id)"
            title="确定报废吗？">
            <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;">报废</el-button>
          </el-popconfirm>
        </template>
      </tr-table>
      <el-pagination
        style="margin: 5px 0;display:flex; justify-content: flex-end;"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        ref="paginationH"
        :current-page="pageInfo.pageIndex"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="pageInfo.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="pageInfo.pageCount">
      </el-pagination>
    </el-card>

    <div class="organization-project-dialog">
      <add-classify-dialog
        ref="addClassifyDialog"
        :classifyOptions1="classifyOptions1"
        :dialogBool.sync="isShowAddClassifyDialog"
        :currType="currChangeType"
        @save-add-edit-organization="saveAddEditOrgClassifyInfo"
      ></add-classify-dialog>
      <asset-check-detail
        ref="assetInfo"
        :dialogBool.sync="isShowSetInfoDialog"
        :curSelectType="curSelectedType"
        @save-add-edit="saveAddEdit"
        @save-borrow-row="saveBorrowRow"
        @save-back-row="saveBackRow"
      ></asset-check-detail>
      <file-dialog
        :dialogBool.sync="fileDialogVisible"
        :fileData="FileData"
        :typeMessage="'物料'"
        @on-submit-excel="onSubmitExcel"
      ></file-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import assetClassificationTree from './component/asset-classification-tree'
import addClassifyDialog from './component/add-classify-dialog'
import newLibraryDialog from './component/new-library-dialog'
import assetCheckDetail from './component/asset-check-detail'
import fileDialog from "@/components/fileDialog/file-dialog.vue";
export default {
  name: "asset-information-management",
  components: {
    assetClassificationTree,
    addClassifyDialog,
    newLibraryDialog,
    assetCheckDetail,
    subReq,
    fileDialog
  },
  mounted() {
    this.loadOrganizationTree();
    this.loadClassifyGroup()
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  data() {
    return {
      visible: false, //添加分组
      placeholder: "请输入关键词",
      tableData: [],
      TableHeight: 500,
      loading: false,
      backFixedNum: 1, //后几行固定
      pageInfo: {
        pageIndex: 1,
        pageSize: 100,
        pageCount: 0,
      },
      organizationloading: false,
      organizationTreeList: [],
      organizationTreeListLength:0,
      curSelectedDepartment:null, //当前选中的组织树节点
      isShowAddClassifyDialog: false,
      currChangeType: 'add', //添加分类
      curSelectedType: 'add', //添加
      isShowSetInfoDialog: false,
      classifyOptions1: [], //所属类别列表
      selectedProjectIds:[], //勾选中要删除的IDs
      fileDialogVisible: false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/资产信息导入模板.xlsx`,
      },
      canRendererTableHeader: [
        {
          id: 1,
          label: "资产编号",
          prop: "material_code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "当前状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "资产名称",
          prop: "material_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "资产类别",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "规格型号",
          prop: "specifications",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "金额",
          prop: "fee",
          width: "150",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "使用部门",
          prop: "dept_name",
          width: "170",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "使用人",
          prop: "user_name",
          width: "170",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "来源",
          prop: "source_name",
          width: "170",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "备注",
          prop: "remark",
          width: "170",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "操作",
          prop: "operation",
          width: "180",
          align: "left",
          signIndex: 10,
          sortable: false,
        }
      ],
      form: {},
    }
  },
  methods: {
    // 刷新资产分组
    refreshTreeList() {
      // this.loading = true;
      this.loadOrganizationTree();
      // 重新定位到目前组织树中
      this.locationCurNode();
    },
    // 查询
    onSubmit(form) {
      this.form = form;
      // console.log(form, this.form);
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.reqOrgProjectList(true);
    },
    // 获取资产分组树
    loadOrganizationTree() {
      this.organizationloading = true;
      let params ={}
      params.type = 1
      this.$client.GetGroupAssetsInfo()
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
      }).catch(err => {

        })
    },
    // 加载所属类别
    loadClassifyGroup() {
      this.$client.GetGroupAssetsInfo()
      .then(res => {
        console.log(res, '所属类别')
        if(res.head.result == "200") {
          // this.classifyOptions = res.context
          this.classifyOptions1 =res.context[0].children
        }else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch()
    },
    // 选择某一组织
    selectDepartment(departmentInfo) {
      this.curSelectedDepartment = departmentInfo;
      this.reqOrgProjectList(true)
    },
    // 获取资产列表
    reqOrgProjectList(isCurDepartment) {
      this.loading = true;
      let params = {
        group_id: isCurDepartment ? this.curSelectedDepartment.id : this.curSelectedDepartment.parents_id
      }
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      params = Object.assign({},params,this.form)
      // console.log(params, Object.prototype.toString(params));
      this.$client.GetByPageAssetsInfo(params)
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.tableData = res.context.list;
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
        this.loading = false;
      })
    },
    // 打开编辑分类弹窗
    openassetInfoDialog(type) {
      this.currChangeType = type;
      if(!!this.curSelectedDepartment && this.currChangeType == 'edit') {
        this.$refs.addClassifyDialog.ruleForm.id = this.curSelectedDepartment.id;
        this.$refs.addClassifyDialog.ruleForm.name = this.curSelectedDepartment.name;
        this.$refs.addClassifyDialog.ruleForm.code = this.curSelectedDepartment.code;
        this.$refs.addClassifyDialog.ruleForm.remark = this.curSelectedDepartment.remark;
        this.$refs.addClassifyDialog.type = this.curSelectedDepartment.type;
        this.$refs.addClassifyDialog.ruleForm.parents = this.curSelectedDepartment.parents;
      }
      if(!!this.curSelectedDepartment && this.currChangeType == 'add') {
        this.$refs.addClassifyDialog.parents_type = this.curSelectedDepartment.type;
        this.$refs.addClassifyDialog.ruleForm.parents = this.curSelectedDepartment.id;
        this.$refs.addClassifyDialog.grandfather_id = this.curSelectedDepartment.parents_id;

        if(this.curSelectedDepartment.type === 0) {
          this.$refs.addClassifyDialog.type = 1;
        }

        if(this.curSelectedDepartment.type === 1) {
          this.$refs.addClassifyDialog.type = 2;
        }
      }

      this.isShowAddClassifyDialog = true;
    },
    // 添加、编辑保存分类
    saveAddEditOrgClassifyInfo(form) {
      let successMessage = '';
      if (this.currChangeType == "add") {
        successMessage = "添加成功";
        delete form.id
      } else {
        successMessage = "编辑成功";
      }
      let params = {
        context: form
      }
      this.$client
        .SetGroupAssetsInfo(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadOrganizationTree();
            // 重新加载分类
            this.loadClassifyGroup()
            // 重新定位到目前组织树中
            this.locationCurNode();
            this.isShowAddClassifyDialog = false;
            this.$message({
              showClose: true,
              message: successMessage,
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
      let ids = []
      ids.push(this.curSelectedDepartment.id)

      if(this.curSelectedDepartment.children && this.curSelectedDepartment.children.length) {
        this.curSelectedDepartment.children.forEach(item => {
          ids.push(item.id)
        })
      }
      let params = {
        context: ids
      }
      this.$client
        .DeleteGroupAssetsInfo(params)
        .then((res) => {
          if (res.head.result == "200") {
            // 排序成功重新加载组织树
            this.loadOrganizationTree();
            // 重新定位到目前上一级组织树中
            this.locationParentNode()
            // 重新加载分类
            this.loadClassifyGroup()
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
      ids.push(this.curSelectedDepartment.parents);
      console.log('chongxindingwei', ids);
      this.$refs.organizationTree.setSelecedCheckedKeys(ids);
    },
    // 事件抛出
    openAddPage(type, data) {
      console.log('头部事件', type, this.curSelectedDepartment.id, data);
      this.curSelectedType = type;
      switch (type) {
        case "add":
          this.isShowSetInfoDialog = true;
          this.$refs.assetInfo.ruleForm.group_id = this.curSelectedDepartment.id === 1 ? '' : this.curSelectedDepartment.id
          break;
        case "detail":
          this.isShowSetInfoDialog = true;
          this.$refs.assetInfo.setData(data)
          break;
        case "edit":
          this.isShowSetInfoDialog = true;
          this.$refs.assetInfo.setData(data)
          break;
        case "borrow":
          this.isShowSetInfoDialog = true;
          this.$refs.assetInfo.setData(data)
          break;
        case "back":
          this.isShowSetInfoDialog = true;
          this.$refs.assetInfo.setData(data)
          break;
        case "import":
          this.fileDialogVisible = true;
          break;
        case "export":
          this.exportExcel();
          break;
        case "delete": //删除
          this.deleteSelectedInfo()
          break;
      }
    },
    // 新建、编辑入库
    saveAddEdit(form) {
      let successMessage = '';
      if (this.curSelectedType == "add") {
        successMessage = "添加成功";
      } else {
        successMessage = "编辑成功";
      }
      let info = Object.assign({}, form)
      let params = {
        context: info
      }
      this.$client.SetRecordAssetsInfo(params).then(res => {
        if (res.head.result == "200") {
          this.isShowSetInfoDialog = false
          this.loadOrganizationTree();
          // 重新定位到目前组织树中
          this.locationCurNode();
          // this.reqOrgProjectList(true)
          this.$message({
            showClose: true,
            message: successMessage,
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {})
    },
    // 领用
    saveBorrowRow(form) {
      let info = Object.assign({}, form)
      let params = {
        context: info
      }
      this.$client.ReceiveAssetsAssetsInfo(params).then(res => {
        if (res.head.result == "200") {
          this.isShowSetInfoDialog = false
          this.reqOrgProjectList(true)
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {})
    },
    // 归还
    saveBackRow(form) {
      let info = Object.assign({}, form)
      let params = {
        context: info
      }
      this.$client.BackAssetsAssetsInfo(params).then(res => {
        if (res.head.result == "200") {
          this.isShowSetInfoDialog = false
          this.reqOrgProjectList(true)
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {})
    },
    // 导入
    onSubmitExcel(val) {
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      let params = formData;
      this.$client.ImportAssetsInfo(params)
      .then(res => {
        if(res.head.result == "200") {
          this.form = {};
          // 重新加载列表详情
          this.loadOrganizationTree();
          // 重新定位到目前组织树中
          this.locationCurNode();
          this.fileDialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        }else{
          this.fileDialogVisible = false;
          let errorData = [];
          const h = this.$createElement;
          errorData.push(h('p',null,res.head.describle));
          for(let i = 0; i < 30; i++) {
            if(res.context[i]) {
              errorData.push(h('p',null,res.context[i]))
            }
          }
          this.$msgbox({
            title: '提示',
            message: h('div',{style: 'height: 300px; overflow: auto'}, errorData),
            confirmButtonText: '确定',
          }).catch(() => {})
        }
      })
    },
    // 导出Excel
    exportExcel(){
      let params = {}
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      params.group_id = this.curSelectedDepartment.id
      params = Object.assign({},params,this.form)
      let ids = [ ...this.selectedProjectIds ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      this.$client.ExportAssetsInfo(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 报废资产
    onScrapAsset(id) {
      let params = {
        context: id
      }
      this.$client.ScrapRecordAssetsInfo(params).then(res => {
        if (res.head.result == "200") {
          this.reqOrgProjectList(true)
          this.$message({
            showClose: true,
            message: res.head.describle,
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
    // 选中表格勾选框
    selectedUserList(projectList) {
      this.selectedProjectIds = [];
      projectList.forEach((item,index) => {
        this.selectedProjectIds.push(item.id)
      });
    },
    // 确定批量移除勾选
    deleteSelectedInfo() {
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
    // 删除
    deleteRowInfo(info) {
      let params = {};
      params.context = [];
      if(!!info) {
        params.context.push(info.id)
      }else{
        params.context = this.selectedProjectIds;
      }
      this.$client.DeleteRecordAssetsInfo(params)
      .then(res => {
        if (res.head.result == "200") {
          // 重新加载列表详情
          this.loadOrganizationTree();
            // 重新定位到目前组织树中
          this.locationCurNode();
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
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.reqOrgProjectList(true)
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.reqOrgProjectList(true)
    },   
    // 计算表格高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH - 40;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.asset-information-management {
  height: 100%;
  width: 100%;
  display: flex;

  .left-box {
    height: 100%;
    width: 300px;

    /deep/ .el-card__header {
      background-color: #F5F5F5;
      padding: 12px 20px;
    }
  }

  .right-box {
    flex: 1;
    height: 100%;
    margin-left: 10px;
  }
}
.mark {
  width: 7px;
  height: 7px;
  border-radius:20px;
  display: inline-block;
  margin-bottom: 2px;
}
</style>
