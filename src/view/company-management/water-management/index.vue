<template>
  <div class="water-management-box">
    <div class="water-management">
      <el-card class="box-card left-box">
        <div
          slot="header"
          class="clearfix show-flex-box-r"
          style="height: 37px; align-items:center;"
        >
          <span style="white-space:nowrap;">水表选择</span>
        </div>
        <div class="show-flex-box-c">
          <div class="show-flex-box-r" style="margin-bottom:15px;" v-if="!!curSelectedDepartment">
            <el-button type="primary" size="mini" :disabled="curSelectedDepartment.type == 2" @click="openSetOrganizationInfoDialog('add')">添加</el-button
            >
            <el-button style="margin-left: 15px" type="primary" size="mini" :disabled="!curSelectedDepartment.type"
            @click="openSetOrganizationInfoDialog('edit')">编辑</el-button
            >
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
                  <p style="font-size: 18px; margin-bottom: 5px;">{{`${curSelectedDepartment.type === 2?`该水表下有${data.length}个记录`:`该地址下有${ curSelectedDepartment.children && curSelectedDepartment.children.length}个水表`}`}}。确认删除吗</p>
                  <span style="color:#F56C6C">是否确定删除？</span>
                </div>
              </div>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="suerDeleteClassifyGroup()">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;" :disabled="!curSelectedDepartment.type && !loading">删除</el-button>
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
        <div style="margin: 10px 0" slot="header">
          <span>抄表记录</span>
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
              :isShowSummary="true"
              :omitColumnIndex='[2,3,5,6,8,10]'
            >
              <template slot-scope="scope" slot="operation">
                <el-button type="text" size="mini" style="margin-left: 10px;" @click="editRowInfo(scope.data)">编辑</el-button>

                <el-popconfirm
                  @confirm="deleteRowInfo(scope.data)"
                  title="确定删除此条记录吗？">
                  <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;">移除</el-button>
                </el-popconfirm>
              </template>
            </tr-table>
          </div>
          <div v-else>
            <table-draggable-sort
              :defaultSortProps="defaultSortProps"
              :tableConfig="tableConfig"
              :dataInfoList="data"
            ></table-draggable-sort>
          </div>
          <el-pagination
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
        <el-empty description="暂无抄表记录信息"></el-empty>
      </el-card>
    </div>
    <div class="organization-project-dialog">
      <add-classify-dialog
         ref="addClassifyDialog"
        :dialogBool.sync="isShowAddClassifyDialog"
        :curType="curType"
        :classifyOptions="classifyOptions"
        @save-add-edit-organization="saveAddEditOrgClassifyInfo"
      ></add-classify-dialog>
      <set-info-dialog
        ref="setOrganizationInfo"
        :dialogBool.sync="isShowSetInfoDialog"
        :curSelecedType="curSelecedType"
        :classifyOptions="classifyOptions"
        @save-add-edit="saveAddEdit"
      ></set-info-dialog>
      <file-dialog
        :dialogBool.sync="filedialogVisible"
        :fileData="FileData"
        :typeMessage="'同名抄表日期记录'"
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

export default {
  name: "water-management",
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      visible: false,
      classifyOptions: [], //所属类别列表
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
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "所属地址",
          prop: "ex_water_belong",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "水表名称",
          prop: "ex_water_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "抄表日期",
          prop: "read_date",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "水表上次底数",
          prop: "last_value",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "水表本月吨数",
          prop: "this_value",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "本月用水量（吨）",
          prop: "use",
          width: "150",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "每吨金额（吨/元）",
          prop: "price",
          width: "170",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "总用水金额（元）",
          prop: "total_fee",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
      ],
      loading: false,
      TableHeight:500,
      filedialogVisible:false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/水费记录模板.xlsx`,
      },
      form:{}, //查询表单数据
      isSort: false, //是否排序
      tableConfig: {
        tableItems: [
          {
            label: "名称",
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
      newTableData:[], //排序后的数据
      selectedProjectIds:[], //勾选中要删除的IDs
      defaultSortProps:{
        value: "id",
        label: "name",
        sort: "i_order",
        parent_name:"parent_name",
        parents_id: "parents_id"
      }
    };
  },
  components: {
    maintenanceProjectTree,
    subReq,
    addClassifyDialog,
    setInfoDialog,
    fileDialog,
  },
  mounted() {
    // this.setHead();
    this.loadOrganizationTree();
     // 加载所属类别
    this.loadClassifyGroup();
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
        // if(!departmentInfo.type) {
        //   this.TableHeight = maxh - 145 -th;
        //   return
        // }
        this.TableHeight = maxh - 145 -th;
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
      this.$client.getWaterTreeWaterAndElectricFee()
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
      this.$client.getWaterUnit()
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
      // this.$refs.head.onSubmit();
      setTimeout(() => {
        this.$refs.addClassifyDialog.parents_type = departmentInfo.type;
        this.$refs.addClassifyDialog.ruleForm.parents_id = departmentInfo.id;
        this.$refs.addClassifyDialog.grandfather_id = departmentInfo.parents_id;
        // type 0总组织 1地址 2水表
        if(departmentInfo.type === 0) {
          this.$refs.addClassifyDialog.ruleForm.type = 1;
        }

        if(departmentInfo.type === 1) {
          this.$refs.addClassifyDialog.ruleForm.type = 2;
          this.$refs.setOrganizationInfo.ruleForm.parents_id = departmentInfo.id;
        }
        if(departmentInfo.type === 2) {
          this.$refs.setOrganizationInfo.ruleForm.parents_id = departmentInfo.parents_id;
          this.$refs.setOrganizationInfo.ruleForm.water_id = departmentInfo.id;
        }
        // 查询
        this.$refs.head.onSubmit();
      },50)
    },
    // 获取列表
    // isCurDepartment //是否是当期组织还是上级组织
    reqOrgProjectList(isCurDepartment) {
      this.loading = true;
      let params = {
        id: isCurDepartment? this.curSelectedDepartment.id : this.curSelectedDepartment.parents_id
      }
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      params = Object.assign({},params,this.form)
      this.$client.getWaterRecordList(params)
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
      // this.pageInfo.pageSize = 20;
      this.pageInfo.pageCount = 0;
      this.reqOrgProjectList(true);
    },
    // 调整排序
    adjustSortSet(isSort){
      this.isSort = !this.isSort
      if(isSort) {
        let list = [];
        this.newTableData.forEach(item => {
          let obj = {
            id: item.value,
            parents_id: item.parents_id,
            name: item.label,
            parent_name: item.parent_name,
            i_order: item.sort,
          };
          list.push(obj)
        });
        this.$client.sortFaultDiagnosis({context:list})
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
    // 头部事件抛出
    openAddPage(type) {
      this.curSelecedType = type;
      switch (type) {
        case "add":
          if(this.curSelectedDepartment && this.curSelectedDepartment.type === 1) {
            this.$refs.setOrganizationInfo.ruleForm.parents_id = this.curSelectedDepartment.id;
          }
          if(this.curSelectedDepartment && this.curSelectedDepartment.type === 2) {
            this.$refs.setOrganizationInfo.ruleForm.parents_id = this.curSelectedDepartment.parents_id;
            this.$refs.setOrganizationInfo.ruleForm.water_id = this.curSelectedDepartment.id;
          }
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
          this.$refs.setOrganizationInfo.ruleForm.parents_id = newForm.ex_water_belong_id;

        },100)
      }
      this.isShowSetInfoDialog = true;
    },
    // 添加
    saveAddEdit(form) {
      let successrMessage = '';
      if (this.curSelecedType == "add") {
        successrMessage = "添加成功";
        delete form.id
      } else {
        successrMessage = "编辑成功";
      }
      let params = {
        context: form
      }
      this.$client
        .addWaterRecord(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.reqOrgProjectList(true);
            // this.loadOrganizationTree();
            // if(!!this.curSelectedDepartment.type) {
            //   if(form.parents_id != this.curSelectedDepartment.id ) {
            //     this.curSelectedDepartment.id = form.parents_id;
            //   }
            // }
            // // 重新定位到目前组织树中
            // this.locationCurNode();
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
      this.$client.ImportWaterRecord(params)
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
      params.id = this.curSelectedDepartment.id;
      let ids = [ ...this.selectedProjectIds ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      this.$client.exportWaterWaterAndElectricFee(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })

    },
    // 打开编辑分类弹窗
    openSetOrganizationInfoDialog(type) {
      this.curType = type;
      if(!!this.curSelectedDepartment && this.curType == 'edit') {
        this.$refs.addClassifyDialog.ruleForm.id = this.curSelectedDepartment.id;
        this.$refs.addClassifyDialog.ruleForm.name = this.curSelectedDepartment.name;
        this.$refs.addClassifyDialog.ruleForm.parents_id = this.curSelectedDepartment.parents_id;
        this.$refs.addClassifyDialog.ruleForm.type = this.curSelectedDepartment.type;
      }
      if(!!this.curSelectedDepartment && this.curType == 'add') {
        this.$refs.addClassifyDialog.parents_type = this.curSelectedDepartment.type;
        this.$refs.addClassifyDialog.ruleForm.parents_id = this.curSelectedDepartment.id;
        this.$refs.addClassifyDialog.grandfather_id = this.curSelectedDepartment.parents_id;
        if(this.curSelectedDepartment.type === 0) {
          this.$refs.addClassifyDialog.ruleForm.type = 1;
        }

        if(this.curSelectedDepartment.type === 1) {
          this.$refs.addClassifyDialog.ruleForm.type = 2;
        }
      }

      this.isShowAddClassifyDialog = true;
    },
    // 添加、编辑保存分类
    saveAddEditOrgClassifyInfo(form) {
      let successrMessage = '';
      if (this.curType == "add") {
        successrMessage = "添加成功";
        delete form.id
      } else {
        successrMessage = "编辑成功";
      }
      let params = {
        context: form
      }
      this.$client
        .addWaterGroup(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadOrganizationTree();
            this.loadClassifyGroup()
            if(this.curType == "add") {
              this.$refs.setOrganizationInfo.selectedParentsId(this.curSelectedDepartment.id)
            }else{
              this.$refs.setOrganizationInfo.selectedParentsId(this.curSelectedDepartment.parents_id)
            }
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
        context: [this.curSelectedDepartment.id]
      }
      this.$client
        .batchWaterGroupDelete(params)
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
      setTimeout(() => {
        this.$refs.organizationTree.setSelecedCheckedKeys(ids);
      },200)
    },
    //重新定位到目前上一级组织树中
    locationParentNode() {
      let ids= [];
      ids.push(this.curSelectedDepartment.parents_id);
       setTimeout(() => {
        this.$refs.organizationTree.setSelecedCheckedKeys(ids);
      },200)
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
      this.$client.batchWaterRecordDelete(params)
      .then(res => {
        if (res.head.result == "200") {
          // if(!this.curSelectedDepartment.type) {
          //   this.pageInfo.pageIndex = 1;
          //   this.pageInfo.pageSize = 20;
          //   this.pageInfo.pageCount = 0;
          // }
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
    // flex: 0 0 15vw;
    margin: 0 5px 0 0;
    width: 240px;
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

.water-management /deep/ .el-card__header {
  background-color: #F5F5F5;
  padding: 12px 20px;
}

.superior-department-content {
  margin-bottom: 30px;
}
</style>
