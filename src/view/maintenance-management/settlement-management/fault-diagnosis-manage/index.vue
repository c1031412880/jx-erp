<template>
  <div class="maintenance-project-manage-box">
    <div class="maintenance-project-manage">
      <el-card class="box-card left-box">
        <div
          slot="header"
          class="clearfix show-flex-box-r"
          style="height: 37px; flex-wrap: nowrap; align-items:center;"
        >
          <span style="white-space:nowrap;">维修项目分类</span>
        </div>
        <div class="show-flex-box-c">
      
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
        <div style="margin: 10px 0" slot="header">
          <span>维修项目</span>
        </div>
        <div class="department-detail show-flex-box-c" v-loading="loading">
          <sub-req
            ref="head"
            :isShowSortButton="!!curSelectedDepartment.type"
            :isSort="isSort"
            :curSelectedDepartment="curSelectedDepartment"
            @on-add="openAddPage"
            @on-ok="onSubmit"
            @adjust-sort-set="adjustSortSet"
          ></sub-req>
          <div v-if="!isSort">
            <trtabletrue
              ref="trTabel"
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
                <el-button type="text" size="mini" style="margin-left: 10px;" @click="editRowInfo(scope.data)" v-if="$isPowerShow('edit')">编辑</el-button>
                <el-popconfirm
                  @confirm="deleteRowInfo(scope.data)"
                  title="确定删除此条记录吗？"
                  v-if="$isPowerShow('del')">
                  <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;">移除</el-button>
                </el-popconfirm>
              </template>
            </trtabletrue>
          </div>
          <div v-else>
            <table-draggable-sort
              :defaultSortProps="defaultSortProps"
              :tableConfig="tableConfig"
              :dataInfoList="data"
            ></table-draggable-sort>
          </div>
          <el-pagination
            v-if="curSelectedDepartment && !curSelectedDepartment.type"
            style="margin: 5px 0;display:flex; justify-content: flex-end;"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            ref="paginationH"
            :current-page="pageInfo.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            :page-size="pageInfo.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="pageInfo.pageCount"
          >
          </el-pagination>
        </div>
      </el-card>
      <el-card class="box-card center-box show-flex-box-r show-flex-center" v-else>
        <el-empty description="暂无故障诊断项目信息"></el-empty>
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
        :classifyOptions="classifyOptions"
        @save-add-edit="saveAddEditProject"
      ></set-info-dialog>
      <file-dialog
        :dialogBool.sync="filedialogVisible"
        :fileData="FileData"
        :typeMessage="'同名故障诊断项目'"
        @on-submit-excel="onSubmitExcel"
      ></file-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import trtabletrue from "./component/tr_tabletrue";
import maintenanceProjectTree from "./component/maintenance-project-tree";
import subReq from "./component/sub-req";
import setInfoDialog from "./component/set-info-dialog"
import addClassifyDialog from "./component/add-classify-dialog"
import fileDialog from "@/components/fileDialog/file-dialog.vue";
import tableDraggableSort from "@/components/tableDraggableSort";

export default {
  name: "fault-diagnosis-manage",
    props: {
      parentmessage: {
        type: Array,
        default: [],
      }
    },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      visible: false,
      selectorderlist:[],
      classifyOptions: [], //所属类别列表
      placeholder: "请输入关键词",
      organizationloading: false,
      organizationTreeList: [],
      organizationTreeListLength:0,
      curType: 'add', //添加分类
      curSelecedType: 'add', //添加故障诊断项目
      isShowSetInfoDialog: false,
      // isFirstOrganization: false,
      curSelectedDepartment:null, //当前选中的故障诊断组织树节点
      isShowAddClassifyDialog: false, // 添加项目分类弹窗
      data:[], //故障诊断项目列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "故障项目名称",
          prop: "c_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "所属分类",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "编码",
          prop: "c_code",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "备注",
          prop: "c_remark",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        // {
        //   id: 5,
        //   label: "操作",
        //   prop: "operation",
        //   width: "120",
        //   align: "center",
        //   signIndex: 4,
        //   sortable: false,
        // },
      ],
      loading: false,
      TableHeight:500,
      filedialogVisible:false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/故障诊断项目记录模板.xlsx`,
      },
      form:{}, //查询表单数据
      isSort: false, //是否排序
      tableConfig: {
        tableItems: [
          {
            label: "故障诊断项目名称",
            prop: "label",
            width: "360",
            align: "left",
          },
          {
            label: "上下拖拽调整排序",
            prop: "sort",
            width: "190",
            align: "center",
          },
        ],
      },
      newTableData:[], //故障诊断项目排序后的数据
      selectedProjectIds:[], //勾选中要删除的故障诊断项目IDs
      defaultSortProps:{
        value: "i_id",
        label: "c_name",
        sort: "i_order",
        group_name:"group_name",
        i_group_id: "i_group_id"
      }
    };
  },
  components: {
    maintenanceProjectTree,
    subReq,
    addClassifyDialog,
    setInfoDialog,
    fileDialog,
    tableDraggableSort,
    trtabletrue
  },
   watch: {
      // parentmessage: {
      //   handler(val, oldVal) {
      //     console.log(val)
      //     this.$refs.trTabel.selectedRowInfo(val)
      //     this.selectedProjectIds = val;
      //   },
      //   deep: true,
      //   immediate: true
 
      // },
    },
  mounted() {
    // this.setHead();
    this.loadOrganizationTree();
     // 加载所属类别
    this.loadClassifyGroup()
  },
  methods: {
    // 计算高度
    setHead(departmentInfo) {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        if(!departmentInfo.type) {
          this.TableHeight = maxh - 190;
          return
        }
        this.TableHeight = maxh - 160;
      }, 60);
    },
    // 监听更新排序函数
    updateSortInfo(tableData) {
      // console.log(tableData);
      // this.newTableData= JSON.parse(JSON.stringify(tableData)) 
      this.newTableData= [...tableData]
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
      this.organizationloading = true;
      this.$client.getMoldProjectTree()
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
      this.$client.getMaintainProjectGroup()
      .then(res => {
        console.log(res)
        if(res.head.result == "200") {
          this.classifyOptions = res.context
        }else {
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
      this.isSort = false; //切换分类 停止排序
      this.setHead(departmentInfo)
      this.reqOrgProjectList(true) // 获取故障诊断项目列表
    },
    // 获取故障诊断项目列表
    // isCurDepartment //是否是当期组织还是上级组织
      reqOrgProjectList(isCurDepartment) {
      this.loading = true;
      let params = {
        i_group_id: isCurDepartment? this.curSelectedDepartment.i_id : this.curSelectedDepartment.p_id
      }
      if(!this.curSelectedDepartment.type) {
        params.page_index = this.pageInfo.pageIndex;
        params.page_size = this.pageInfo.pageSize;
      }
      params = Object.assign({},params,this.form)
      this.$client.getMaintainProjectList(params)
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
           this.setSelectTabel()
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
    // 查询故障诊断项目
    onSubmit(form) {
      this.form = form;
      console.log(this.form);
      this.pageInfo.pageIndex = 1;
      // this.pageInfo.pageSize = 20;
      this.pageInfo.pageCount = 0;
      this.reqOrgProjectList(true);
    },
    // 调整排序故障诊断项目
    adjustSortSet(isSort){
      this.isSort = !this.isSort
      if(isSort) {
        let list = [];
        this.newTableData.forEach(item => {
          let obj = {
            i_id: item.value,
            i_group_id: item.i_group_id,
            c_name: item.label,
            group_name: item.group_name,
            i_order: item.sort,
          };
          list.push(obj)
        });
        this.$client.sortMaintainProject({context:list})
        .then(res => {
          // console.log(JSON.stringify(res))
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
    // 故障诊断项目头部事件抛出
    openAddPage(type) {
      this.curSelecedType = type;
      switch (type) {
        case "add":
          this.isShowSetInfoDialog = true;
          break;
        case "edit":
          this.isShowSetInfoDialog = true;
          break;
        case "import":
          this.filedialogVisible = true;
          break;
        case "export":
          this.exportExcel();
          break;
        case "delete": //删除
          this.deleteSelectedUserInfo()
      }
    },
    // 编辑故障诊断项目
    editRowInfo(info) {
      this.curSelecedType = 'eidt';
      if(!!info) {
        this.$refs.setOrganizationInfo.ruleForm.i_id = info.i_id;
        this.$refs.setOrganizationInfo.ruleForm.c_name = info.c_name;
        this.$refs.setOrganizationInfo.ruleForm.i_group_id = info.i_group_id;
        this.$refs.setOrganizationInfo.ruleForm.c_code = info.c_code;
        // this.$refs.setOrganizationInfo.ruleForm.i_hours = info.i_hours;
        // this.$refs.setOrganizationInfo.ruleForm.n_price = info.n_price;
        this.$refs.setOrganizationInfo.ruleForm.c_remark = info.c_remark;
      }
      this.isShowSetInfoDialog = true;
    },
    // 添加故障诊断项目
    saveAddEditProject(form) {
      let successrMessage = '';
      if (this.curSelecedType == "add") {
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }
      let params = {
        context: form
      }
      this.$client
        .addMaintainProject(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadOrganizationTree();
            if(!!this.curSelectedDepartment.type) {
              if(form.i_group_id != this.curSelectedDepartment.i_id ) {
                this.curSelectedDepartment.i_id = form.i_group_id;
              }
            }
            // 重新定位到目前组织树中
            this.locationCurNode();
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
      this.$client.importMaintainProject(params)
      .then(res => {
        if(res.head.result == "200") {
          this.form = {};
          this.pageInfo.pageIndex = 1;
          this.pageInfo.pageCount = 0;
          this.reqOrgProjectList(true);
          this.filedialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        }else{
          this.filedialogVisible = false;
          let errorData = [];
          const h = this.$createElement;
          errorData.push(h('p',null,res.head.describle));
          this.$msgbox({
            title: '提示',
            message: h('div',null, errorData),
            confirmButtonText: '确定',
          })
        }
      })
    },
    // 导出Excel
    exportExcel(){
      let params = Object.assign({}, this.form);
      params.i_group_id = this.curSelectedDepartment.i_id;
      this.$client.exportRepairProject(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })

    },
    // 打开故障诊断项目分类弹窗
    openSetOrganizationInfoDialog(type) {
      this.curType = type;
      if(!!this.curSelectedDepartment && this.curType == 'edit') {
        this.$refs.addClassifyDialog.ruleForm.i_id = this.curSelectedDepartment.i_id;
        this.$refs.addClassifyDialog.ruleForm.c_name = this.curSelectedDepartment.c_name;
      }
      this.isShowAddClassifyDialog = true;
    },
    // 添加、编辑保存分类
    saveAddEditOrgClassifyInfo(form) {
      let successrMessage = '';
      if (this.curType == "add") {
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }
      let params = {
        context: form
      }
      this.$client
        .addFaultDiagnosis(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadOrganizationTree();
            this.loadClassifyGroup()
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
        context: [this.curSelectedDepartment.i_id]
      }
      this.$client
        .deleteFaultDiagnosis(params)
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
      ids.push(this.curSelectedDepartment.i_id);
      
      this.$refs.organizationTree.setSelecedCheckedKeys(ids);
    },
    //重新定位到目前上一级组织树中
    locationParentNode() {
      let ids= [];
      ids.push(this.curSelectedDepartment.p_id);
      this.$refs.organizationTree.setSelecedCheckedKeys(ids);
    },
    setSelectTabel(val) {
      if(val){
      this.data.forEach(item =>{
        val.forEach(element => {
          if(item.c_code==element.c_code){
            this.selectorderlist.push(item)
          }
       });
      })
      }
      // console.log(this.selectorderlist,[this.data[1]],'667')
      this.$refs.trTabel.toggleSelection(this.selectorderlist)
      // this.$refs.trTabel.toggleSelection(val)
    },
    // 选中表格勾选框
    selectedUserList(projectList) {
      this.selectedProjectIds = [];
      projectList.forEach((item,index) => {
        this.selectedProjectIds.push(item)
      });
      console.log(this.selectedProjectIds,'11111');
      // this.parentmessage = this.selectedProjectIds
      // this.$emit('func',this.selectedProjectIds)
    },
    sing(){
      this.$emit('func',this.selectedProjectIds)
      console.log(this.selectedProjectIds,'555')
    },
    // 确定批量移除勾选
    deleteSelectedUserInfo() {
      if(this.selectedProjectIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选至少一条要移除的故障诊断项目',
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
        params.context[0] = info.i_id
      }else{
        params.context = this.selectedProjectIds
      }
      this.$client.removeRepairProject(params)
      .then(res => {
        if (res.head.result == "200") {
          // if(!this.curSelectedDepartment.type) {
          //   this.pageInfo.pageIndex = 1;
          //   this.pageInfo.pageSize = 20;
          //   this.pageInfo.pageCount = 0;
          // }
          // 重新加载故障诊断项目列表详情
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
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.maintenance-project-manage-box{
  width: 100%;
  height: 60vh;
}
.maintenance-project-manage {
  width: 100%;
  height: 60vh;
  display: flex;

  .box-card {
    height: 100%;
    overflow: auto;
  }

  .left-box {
    flex: 0 0 23vw;
    margin: 0 5px 0 0;
    width: 23vw;
    height: 100%;
  }

  .center-box {
    flex: 1;
    height: 100%;
  }
}
.department-detail {
  
}
.department-detail /deep/ .el-input{
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
