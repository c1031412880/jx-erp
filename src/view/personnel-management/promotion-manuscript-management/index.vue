<template>
  <div class="water-management-box">
    <div class="water-management">
      <el-card class="box-card left-box">
        <div
          slot="header"
          class="clearfix show-flex-box-r"
          style="height: 37px; align-items:center;"
        >
          <span style="white-space:nowrap;">录用媒体</span>
        </div>
        <div class="show-flex-box-c">
          <div class="show-flex-box-r" style="margin-bottom:15px;" v-if="!!curSelectedDepartment">
            <el-button style="margin-left: 15px" type="primary" size="mini" @click="openSetOrganizationInfoDialog('add')">添加</el-button
            >
            <el-button style="margin-left: 15px" type="primary" size="mini" :disabled="!curSelectedDepartment.id"
            @click="openSetOrganizationInfoDialog('edit')" v-if="$isPowerShow('editType')">编辑</el-button
            >
            <el-popover
              v-if="$isPowerShow('delType')"
              placement="bottom"
              title="操作确认"
              width="400"
              v-model="visible">
              <div class="show-flex-box-r" >
                <span style="margin-right: 10px; color: #FF9900;" class="show-flex-box-r">
                  <i class="el-icon-question" style="font-size: 25px;"></i>
                </span>
                <div class="show-flex-box-c" >
                  <p style="font-size: 18px; margin-bottom: 5px;">{{`${`该类目下有${pageInfo.pageCount}个稿件`}`}}。确认删除吗</p>
                </div>
              </div>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="suerDeleteClassifyGroup()">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;" :disabled="!curSelectedDepartment.id && !loading">删除</el-button>
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
            :curSelectedDepartment="curSelectedDepartment"
            @on-add="openAddPage"
            @on-ok="onSubmit"
          ></sub-req>
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
            :spanMethodType="['column']"
            :rowspanObj="rowspanObj"
            :mergekeys="mergekeys"
            :isShowSummary="true"
          >
            <template slot-scope="scope" slot="state">
              <span :style="{color:scope.data.state == 2 ? '#027DB4' : '#D9001B'}">{{scope.data.state_name}}</span>
            </template>
            <template slot-scope="scope" slot="flow_code">
              <el-button type="text" @click="showDetails(scope.data.advert_id)">{{scope.data.flow_code}}</el-button>
            </template>
            <template slot-scope="scope" slot="operation">
              <el-button type="text" size="mini" style="margin-left: 10px;" v-if="!!scope.data.advert_id" @click="editRowInfo(scope.data,'detail')">查看</el-button>
              <el-button type="text" size="mini" style="margin-left: 10px;" v-if="(scope.data.state == 1 || scope.data.state == 3) && $isPowerShow('edit')" @click="editRowInfo(scope.data,'edit')">编辑</el-button>
              <el-button type="text" size="mini" style="margin-left: 10px;" v-if="(scope.data.state == 1 || scope.data.state == 3) && $isPowerShow('auditing')" @click="checkInfo([scope.data.id],2)">审核</el-button>
              <el-button type="text" size="mini" style="margin-left: 10px;" v-if="scope.data.state == 2 && $isPowerShow('deApproval')" @click="checkInfo([scope.data.id],3)">反审核</el-button>
              <el-popconfirm
                @confirm="deleteRowInfo(scope.data)"
                title="该文章有关联对应宣传信息审批单，删除后关联审批单的数据将同步删除 确认删除吗？">
                <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;color:#D9001B" v-show="$isPowerShow('del') && !scope.data.advert_id">删除</el-button>
              </el-popconfirm>
            </template>
          </tr-table>
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
    </div>
    <div class="organization-project-dialog">
      <add-classify-dialog
         ref="addClassifyDialog"
        :dialogBool.sync="isShowAddClassifyDialog"
        :curType="curType"
        @save-add-edit-organization="saveAddEditOrgClassifyInfo"
      ></add-classify-dialog>
      <add-fee-dialog
         ref="addFeeDialog"
        :dialogBool.sync="isShowAddFeeDialog"
      ></add-fee-dialog>
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
        :typeMessage="'宣传稿件'"
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
import addFeeDialog from "./component/add-fee-dialog"
import fileDialog from "@/components/fileDialog/file-dialog.vue";

export default {
  name: "promotion-manuscript-management",
  components: {
    maintenanceProjectTree,
    subReq,
    addClassifyDialog,
    setInfoDialog,
    fileDialog,
    addFeeDialog
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
        // {
        //   id: 1,
        //   label: "宣传审批单编号",
        //   prop: "flow_code",
        //   width: "130",
        //   align: "center",
        //   signIndex: 0,
        //   sortable: false,
        // },
        {
          id: 1,
          label: "报送类别",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "部门",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "信息标题",
          prop: "advert_title",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        // {
        //   id: 5,
        //   label: "信息内容",
        //   prop: "content",
        //   width: "130",
        //   align: "center",
        //   signIndex: 4,
        // },
        {
          id: 4,
          label: "作者(文)",
          prop: "author_article_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "作者(文)得分",
          prop: "text_score",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "作者(文)稿费",
          prop: "text_fee",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "作者(摄)",
          prop: "author_photo_name",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "作者(摄)得分",
          prop: "img_score",
          width: "120",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "作者(摄)费用",
          prop: "img_fee",
          width: "123",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "总得分",
          prop: "total_score",
          width: "150",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        //  {
        //   id: 12,
        //   label: "操作",
        //   prop: "operation",
        //   width: "180",
        //   align: "center",
        //   signIndex: 11,
        //   sortable: false,
        // },
      ],
      loading: false,
      TableHeight:500,
      filedialogVisible:false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/宣传稿件导入模板.xlsx`,
      },
      form:{}, //查询表单数据

      selectedProjectIds:[], //勾选中要删除的IDs
      rowspanObj: {},
      mergekeys: ['selection','id','state','advert_title','advert_score','advert_type_name','enter_time','level_name','remark','operation'],
      isShowAddFeeDialog: false
    };
  },
  mounted() {
    // this.setHead();
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
      this.curSelectedDepartment.id = this.organizationTreeList[0].id
      this.locationCurNode();
    },
    // 获取组织tree信息
    loadOrganizationTree() {
      // this.organizationloading = true;
      this.$client.GetAdvertPlatforms()
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
      this.$nextTick(() => {
        this.setHead()
        this.$refs.head.onSubmit()
      })
    },
    // 获取列表
    // isCurDepartment //是否是当期组织还是上级组织
    reqOrgProjectList() {
      this.loading = true;
      let params = {
        platform_id: this.curSelectedDepartment.id || 0
      }
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      params = Object.assign({},params,this.form)
      this.$client.GetAdvertManuscript({context:params})
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.data = res.context.list
          if (this.data.length > 0) {
            this.rowspanObj = this.$handleTableSpan(this.mergekeys, this.data,'id',true)
          }
          // 总分类下需要分页
          this.pageInfo.pageCount = res.context.total
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
      console.log(this.form);
      this.pageInfo.pageIndex = 1;
      // this.pageInfo.pageSize = 20;
      this.pageInfo.pageCount = 0;
      this.reqOrgProjectList();
    },
    // 头部事件抛出
    openAddPage(type) {
      this.curSelecedType = type;
      switch (type) {
        case "add":
          if(this.curSelectedDepartment) {
            this.$refs.setOrganizationInfo.form.enter_platform = this.curSelectedDepartment.id || ''
          }
          this.isShowSetInfoDialog = true;
          this.$nextTick(() => {
            this.$refs.setOrganizationInfo.changePlatform()
          })
          break;
        case "edit":
          this.isShowSetInfoDialog = true;
          break;
        case "import":
          this.filedialogVisible = true;
          break;
        case "delete": //删除
          this.deleteSelectedUserInfo()
          break;
        case "export":
          this.exportExcel();
          break;
        case "auditing":
          this.checkSelectedInfo(2)
          break;
        case "deApproval":
          this.checkSelectedInfo(3)
          break;
        case "fee":
          this.isShowAddFeeDialog = true
          break;
      }
    },
    // 编辑
    editRowInfo(info,type) {
      this.curSelecedType = type
      if(!!info) {
        let newForm = {...info};
        setTimeout(() => {
          for (const key in this.$refs.setOrganizationInfo.form) {
            if (Object.hasOwnProperty.call(newForm, key)) {
              this.$refs.setOrganizationInfo.form[key] = newForm[key]
            }
          }
          this.$refs.setOrganizationInfo.files = newForm.files_list
          this.$refs.setOrganizationInfo.imgs = newForm.thumbnail_imgs
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
        .AddOrEditAdvertManuscript(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.reqOrgProjectList();
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
      this.reqOrgProjectList();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.reqOrgProjectList();
    },
    // 导入
    onSubmitExcel(val) {
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      let params = formData;
      this.$client.ImportAdvertInfo(params)
      .then(res => {
        if(res.head.result == "200") {
          this.form = {};
          this.pageInfo.pageIndex = 1;
          this.pageInfo.pageCount = 0;
          this.reqOrgProjectList();
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
    // 导出Excel
    exportExcel(){
      let params = Object.assign({}, this.form);
      this.$client.ExportAdvertInfo(params)
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
        this.$refs.addClassifyDialog.ruleForm.platform = this.curSelectedDepartment.platform;
        this.$refs.addClassifyDialog.ruleForm.level = this.curSelectedDepartment.level;
        this.$refs.addClassifyDialog.ruleForm.score = this.curSelectedDepartment.score;
        this.$refs.addClassifyDialog.ruleForm.img_score = this.curSelectedDepartment.img_score;
        this.$refs.addClassifyDialog.ruleForm.remark = this.curSelectedDepartment.remark;
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
        .AddOrEditAdvertPlatform(params)
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
        .DirectDelAdvertPlatform(params)
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
      ids.push(this.curSelectedDepartment.parent_id);
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
          message: '请勾选至少一条要移除的数据',
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
      this.$client.DirectDelAdvertManuscript(params)
      .then(res => {
        if (res.head.result == "200") {
          // 重新加载列表详情
          this.reqOrgProjectList();
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
    // 批量审核 反审核
    checkSelectedInfo(type) {
      if(this.selectedProjectIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选至少一条数据',
          type: "warning",
        });
        return
      }
      this.checkInfo(this.selectedProjectIds,type)
    },
    // 审核  反审核
    checkInfo(ids,type) {
      let params = {
        manuscript_id: ids,
        state: type
      }
      this.$client.UpdateStateAdvertManuscript({context: params}).then(res => {
        if (res.head.result == "200") {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
          this.reqOrgProjectList()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 查看
    showDetails(id) {
      this.$router.push({
        path: `/news-details/${id}/待办事项:宣传信息审批单/5050`,
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
</style>
