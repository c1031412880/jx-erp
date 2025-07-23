<template>
  <div class="maintenance-project-manage-box">
    <div class="maintenance-project-manage" ref="maintenanceProjectManage">
      <el-card class="box-card left-box">
        <div
          slot="header"
          class="clearfix show-flex-box-r"
          style="height: 37px; flex-wrap: nowrap; align-items:center;"
        >
          <span style="white-space:nowrap;">稽查项目类别</span>
        </div>
        <div class="show-flex-box-c">
          <div
            class="show-flex-box-r"
            style="margin-bottom:15px;flex-wrap: nowrap;"
            v-if="!!curSelectedDepartment"
          >
            <el-button
              style="margin-left: 15px"
              type="primary"
              size="mini"
              @click="openSetOrganizationInfoDialog('add')"
              v-if="$isPowerShow('add')"
            >添加</el-button>
            <el-button
              style="margin-left: 15px"
              type="primary"
              size="mini"
              :disabled="!curSelectedDepartment.type"
              @click="openSetOrganizationInfoDialog('edit')"
              v-if="$isPowerShow('edit')"
            >编辑</el-button>
            <el-popover placement="bottom" title="操作确认" width="400" v-model="visible" v-if="$isPowerShow('del')">
              <div class="show-flex-box-r" style>
                <span style="margin-right: 10px; color: #FF9900;" class="show-flex-box-r">
                  <i class="el-icon-question" style="font-size: 25px;"></i>
                </span>
                <div class="show-flex-box-c">
                  <p style="font-size: 18px; margin-bottom: 5px;">该分类下有{{data.length}}个稽查项目。确认删除吗</p>
                  <span style="color:#F56C6C">是否确定删除？</span>
                </div>
              </div>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="suerDeleteClassifyGroup()">确定</el-button>
              </div>
              <el-button
                slot="reference"
                type="danger"
                size="mini"
                style="margin-left: 10px;"
                :disabled="!curSelectedDepartment.type && !loading"

              >删除</el-button>
            </el-popover>
            <el-button 
              style="margin-left: 10px;" 
              size="mini" 
              type="primary"
              @click="setAndSaveDrag"
            >{{isDraggable ? '保存排序' : '排序'}}</el-button>
          </div>
          <maintenance-project-tree
            ref="organizationTree"
            :organizationTreeHeight="organizationTreeHeight"
            :loading="organizationloading"
            :placeholder="placeholder"
            :isDraggable="isDraggable"
            :organizationTreeList="organizationTreeList"
            :organizationTreeListLength="organizationTreeListLength"
            @on-tree="selectDepartment"
            @refresh-tree="refreshTreeList"
          ></maintenance-project-tree>
        </div>
      </el-card>
      <el-card class="box-card center-box" ref="centerBox" v-if="!!curSelectedDepartment">
        <div style="margin: 10px 0" slot="header">
          <span>稽查项目奖罚</span>
        </div>
        <div class="department-detail show-flex-box-c" v-loading="loading">
          <sub-req
            ref="head"
            :isShowSortButton="!!curSelectedDepartment.type"
            :isSort="isSort"
            :curSelectedDepartment="curSelectedDepartment"
            @on-add="openAddPage"
            @on-ok="onSubmit"
            @on-reset="onReset"
            @adjust-sort-set="adjustSortSet"
            @on-cancel="isSort = false"
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

              <template slot-scope="scope" slot="i_enable">
                <span>{{!!scope.data.i_enable? '是': '否'}}</span>
              </template>

              <template slot-scope="scope" slot="operation">
                <el-button
                  type="text"
                  size="mini"
                  style="margin-left: 10px;"
                  @click="editRowInfo(scope.data)"
                  v-if="$isPowerShow('edit')"
                >编辑</el-button>

                <el-popconfirm @confirm="deleteRowInfo(scope.data)" title="确定删除此条记录吗？" v-if="$isPowerShow('del')">
                  <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;">删除</el-button>
                </el-popconfirm>
              </template>
            </tr-table>
          </div>
          <div v-else>
            <table-draggable-sort
              :defaultSortProps="defaultSortProps"
              :tableConfig="tableConfig"
              :dataInfoList="data"
              :TableHeight="TableHeight"
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
          ></el-pagination>
        </div>
      </el-card>
      <el-card class="box-card center-box show-flex-box-r show-flex-center" v-else>
        <el-empty description="暂无维修项目信息"></el-empty>
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
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import maintenanceProjectTree from "./component/maintenance-project-tree";
import subReq from "./component/sub-req";
import setInfoDialog from "./component/set-info-dialog";
import addClassifyDialog from "./component/add-classify-dialog";
import tableDraggableSort from "@/components/tableDraggableSort";

export default {
  name: "violation-inspect-manage",
  data() {
    return {
      organizationTreeHeight:500,
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      visible: false,
      classifyOptions: [], //所属类别列表
      placeholder: "请输入关键词",
      organizationloading: false,
      isDraggable: false,
      organizationTreeList: [],
      organizationTreeListLength: 0,
      curType: "add", //添加分类
      curSelecedType: "add", //添加项目
      isShowSetInfoDialog: false,
      // isFirstOrganization: false,
      curSelectedDepartment: null, //当前选中的组织树节点
      isShowAddClassifyDialog: false, // 添加项目分类弹窗
      data: [], //项目列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      form: {}, //查询表单数据
      cachedForm: {}, //缓存的查询条件
      isSort: false, //是否排序
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
          prop: "model_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false
        },
        {
          id: 4,
          label: "违规类型",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false
        },
        {
          id: 5,
          label: "安全等级",
          prop: "i_leavel",
          label: "奖罚金额(元)",
          prop: "c_fee",
          width: "180",
          align: "center",
          signIndex: 4,
          sortable: true
        },
        {
          id: 6,
          label: "加减分值",
          prop: "n_score",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: true
        },
        {
          id: 7,
          label: "详细说明",
          prop: "c_remark",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false
        },
        {
          id: 8,
          label: "启用状态",
          prop: "i_enable",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false
        },
        {
          id: 9,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 8,
          sortable: false
        }
      ],
      loading: false,
      TableHeight: 500,
      filedialogVisible: false,
      tableConfig: {
        tableItems: [
          {
            label: "稽查项目名称",
            prop: "label",
            width: "360",
            align: "left"
          },
          {
            label: "上下拖拽调整排序",
            prop: "sort",
            width: "190",
            align: "center"
          }
        ]
      },
      newTableData: [], //维修项目排序后的数据
      selectedProjectIds: [], //勾选中要删除的维修项目IDs
      defaultSortProps: {
        value: "i_id",
        label: "c_name",
        sort: "i_order",
        i_main_id: "i_main_id"
      }
    };
  },
  components: {
    maintenanceProjectTree,
    subReq,
    addClassifyDialog,
    setInfoDialog,
    tableDraggableSort
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
        window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
          this.setHead(this.departmentInfo)
        })
    })
    // 设置默认查询条件
    this.form = {
      i_enable: 1
    };
    this.loadOrganizationTree();
  },
  methods: {
    // 计算高度
    setHead(departmentInfo) {
      this.organizationTreeHeight = this.$refs.maintenanceProjectManage.offsetHeight - 215;
      // alert(this.organizationTreeHeight)
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        if (!!departmentInfo && !departmentInfo.type) {
          this.TableHeight = maxh - 192;
          return;
        }
        this.TableHeight = maxh - 160;
      }, 60);
    },
    // 监听更新排序函数
    updateSortInfo(tableData) {
      // console.log(tableData);
      // this.newTableData= JSON.parse(JSON.stringify(tableData))
      this.newTableData = [...tableData];
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
      this.$client
        .getGroupRewardPunish()
        .then(res => {
          this.organizationloading = false;
          if (res.head.result == "200") {
            this.organizationTreeList = res.context;
            if (this.organizationTreeList.length > 0) {
              this.classifyOptions = this.organizationTreeList[0].children;
            }
            this.organizationTreeListLength = this.organizationTreeList.length;
            
            // 组织树加载完成后，如果有数据且是首次加载，自动选择第一个部门并执行查询
            if (this.organizationTreeList.length > 0 && !this.curSelectedDepartment) {
              this.$nextTick(() => {
                // 确保默认查询条件已设置
                if (!this.form || Object.keys(this.form).length === 0) {
                  this.form = {
                    i_enable: 1
                  };
                }
                // 通知子组件更新查询条件
                if (this.$refs.head) {
                  this.$refs.head.updateFormData(this.form);
                }
              });
            }
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
    // 构建所属分类
    // bulidClassilyGroup(list) {
    //   let newList = [];
    //   if(!!list && list.length > 0) {
    //     list.forEach((item,index) => {
    //       let obj = {
    //         i_id:item.i_id,
    //         c_name:item.c_name
    //       }
    //       newList.push(obj)
    //     })
    //   }
    //   return newList
    // },
    // 选择某一组织
    selectDepartment(departmentInfo) {
      this.curSelectedDepartment = departmentInfo;
      // 不重置查询条件，保持用户之前的查询状态
      this.isSort = false; //切换分类 停止排序
      
      // 如果是首次选择部门，设置默认查询条件
      if (!this.form || Object.keys(this.form).length === 0) {
        this.form = {
          i_enable: 1
        };
        // 通知子组件更新查询条件
        this.$nextTick(() => {
          if (this.$refs.head) {
            this.$refs.head.updateFormData(this.form);
          }
        });
      }
      
      // 执行查询
      this.reqInspectProjectList(true); // 获取稽查项目列表
      this.setHead(departmentInfo)
    },
    // 获取项目列表
    reqInspectProjectList(isCurDepartment) {
      this.loading = true;
      let params = {
        group_id: isCurDepartment
          ? this.curSelectedDepartment.i_id
          : this.curSelectedDepartment.p_id
      };
      if (!this.curSelectedDepartment.type) {
        params.page_index = this.pageInfo.pageIndex;
        params.page_size = this.pageInfo.pageSize;
      }
      params = Object.assign({}, params, this.form);
      // 特殊处理i_enable字段，确保0值也能传递
      if (this.form.i_enable === 0 || this.form.i_enable === 1) {
        params.i_enable = this.form.i_enable;
        // 尝试其他可能的参数名
        params.enable = this.form.i_enable;
        params.status = this.form.i_enable;
        // 尝试字符串格式
        params.i_enable_str = this.form.i_enable.toString();
        params.enable_str = this.form.i_enable.toString();
        params.status_str = this.form.i_enable.toString();
        // 尝试usable参数（字符串格式）
        params.usable = this.form.i_enable.toString();
      }
      console.log('API请求参数:', params);
      this.$client
        .getProItems(params)
        .then(res => {
          // console.log(JSON.stringify(res))
          console.log('API响应数据:', res.context.list);
          if (res.head.result == "200") {
            this.data = res.context.list;
            // 总分类下需要分页
            if (!this.curSelectedDepartment.type) {
              this.pageInfo.pageCount = res.context.total;
            }
            setTimeout(() => {
              this.loading = false;
            }, 800);
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error"
            });
          }
        })
        .catch(err => {});
    },
    //查询
    onSubmit(form) {
      this.form = form;
      // 缓存查询条件，用于编辑后恢复
      this.cachedForm = JSON.parse(JSON.stringify(form));
      console.log('搜索参数:', this.form);
      console.log('i_enable值:', this.form.i_enable, '类型:', typeof this.form.i_enable);
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.reqInspectProjectList(true);
    },
    // 重置查询条件
    onReset() {
      this.cachedForm = {};
    },
    // 调整排序维修项目
    adjustSortSet(isSort) {
      this.isSort = !this.isSort;
      if (isSort) {
        let list = [];
        this.newTableData.forEach(item => {
          let obj = {
            i_id: item.value,
            i_main_id: item.i_main_id,
            c_name: item.label,
            i_order: item.sort
          };
          list.push(obj);
        });
        this.$client
          .groupSortRewardPunish({ context: list })
          .then(res => {
            // console.log(JSON.stringify(res))
            if (res.head.result == "200") {
              this.reqInspectProjectList(true);
              this.$message({
                showClose: true,
                message: "排序成功",
                type: "success"
              });
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error"
              });
            }
          })
          .catch(err => {});
      }
    },
    // 维修项目头部事件抛出
    openAddPage(type) {
      this.curSelecedType = type;
      switch (type) {
        case "add":
          this.isShowSetInfoDialog = true;
          if(this.curSelectedDepartment.i_id== 1){}
          else{
          this.$refs.setOrganizationInfo.ruleForm.i_main_id = this.curSelectedDepartment.i_id
          }
          break;
        case "edit":
          this.isShowSetInfoDialog = true;
          break;
        case "delete": //删除
          this.deleteSelectedUserInfo();
      }
    },
    // 编辑维修项目
    editRowInfo(info) {
      this.curSelecedType = "eidt";
      if (!!info) {
         this.$refs.setOrganizationInfo.ruleForm.i_main_id = info.i_main_id;
        this.$refs.setOrganizationInfo.ruleForm.i_id = info.i_id;
        this.$refs.setOrganizationInfo.ruleForm.c_name = info.c_name;
        this.$refs.setOrganizationInfo.ruleForm.model = info.model;
        this.$refs.setOrganizationInfo.ruleForm.c_fee = info.c_fee;
        this.$refs.setOrganizationInfo.ruleForm.n_score = info.n_score;
        this.$refs.setOrganizationInfo.ruleForm.cancel_star = info.cancel_star == 1 ? true : false;
        this.$refs.setOrganizationInfo.ruleForm.c_remark = info.c_remark;
        this.$refs.setOrganizationInfo.ruleForm.i_enable = info.i_enable
          ? true
          : false;
      }
      this.isShowSetInfoDialog = true;
    },
    // 添加维修项目
    saveAddEditProject(form) {
      console.log(form, "sj");
      let successrMessage = "";
      if (this.curSelecedType == "add") {
        successrMessage = "添加成功";
        delete form.i_id;
      } else {
        successrMessage = "编辑成功";
      }
      let params = {
        context: form
      };
      this.$client
        .setItemsRewardPunish(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loadOrganizationTree();
            if (!!this.curSelectedDepartment.type) {
              if (form.i_main_id != this.curSelectedDepartment.i_id) {
                this.curSelectedDepartment.i_id = form.i_main_id;
              }
            }
            // 重新定位到目前组织树中
            this.locationCurNode();
            this.isShowSetInfoDialog = false;
            // 恢复缓存的查询条件
            if (Object.keys(this.cachedForm).length > 0) {
              this.form = JSON.parse(JSON.stringify(this.cachedForm));
              // 通知子组件更新查询条件
              this.$nextTick(() => {
                if (this.$refs.head) {
                  this.$refs.head.updateFormData(this.form);
                }
              });
            }
            this.$message({
              showClose: true,
              message: successrMessage,
              type: "success"
            });
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

    // 打开维修项目分类弹窗
    openSetOrganizationInfoDialog(type) {
      this.curType = type;
      if (!!this.curSelectedDepartment && this.curType == "edit") {
        this.$refs.addClassifyDialog.ruleForm.i_id = this.curSelectedDepartment.i_id;
        this.$refs.addClassifyDialog.ruleForm.c_name = this.curSelectedDepartment.c_name;
        this.$refs.addClassifyDialog.ruleForm.i_type = this.curSelectedDepartment.i_type;
        this.$refs.addClassifyDialog.ruleForm.i_order = this.curSelectedDepartment.i_order;
      }
      this.isShowAddClassifyDialog = true;
    },
    // 添加、编辑保存分类
    saveAddEditOrgClassifyInfo(form) {
      let successrMessage = "";
      if (this.curType == "add") {
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }
      let params = {
        context: form
      };
      this.$client
        .setGroupRewardPunish(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loadOrganizationTree();
            // 重新定位到目前组织树中
            this.locationCurNode();
            this.isShowAddClassifyDialog = false;
            this.$message({
              showClose: true,
              message: successrMessage,
              type: "success"
            });
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
    // 删除分类
    suerDeleteClassifyGroup() {
      let params = {
        context: [this.curSelectedDepartment.i_id]
      };
      this.$client
        .deleteGroupRewardPunish(params)
        .then(res => {
          if (res.head.result == "200") {
            // 排序成功重新加载组织树
            this.loadOrganizationTree();
            // 重新定位到目前上一级组织树中
            this.locationParentNode();
            this.visible = false;
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error"
            });
            this.visible = false;
          }
        })
        .catch(err => {
          this.visible = false;
        });
    },
    // 重新定位到目前组织树中
    locationCurNode() {
      let ids = [];
      ids.push(this.curSelectedDepartment.i_id);
      setTimeout(() => {
        this.$refs.organizationTree.setSelecedCheckedKeys(ids);
      }, 300);
    },
    //重新定位到目前上一级组织树中
    locationParentNode() {
      let ids = [];
      ids.push(this.curSelectedDepartment.p_id);
      this.$refs.organizationTree.setSelecedCheckedKeys(ids);
    },
    // 选中表格勾选框
    selectedUserList(projectList) {
      this.selectedProjectIds = [];
      projectList.forEach((item, index) => {
        this.selectedProjectIds.push(item.i_id);
      });
    },
    // 确定批量移除勾选
    deleteSelectedUserInfo() {
      if (this.selectedProjectIds.length == 0) {
        this.$message({
          showClose: true,
          message: "请勾选至少一条要移除的维修项目",
          type: "warning"
        });
        return;
      }
      this.deleteRowInfo(null);
    },
    // 移除
    deleteRowInfo(info) {
      let params = {
        context: []
      };
      if (!!info) {
        params.context[0] = info.i_id;
      } else {
        params.context = this.selectedProjectIds;
      }
      this.$client
        .deleteItemsRewardPunish(params)
        .then(res => {
          if (res.head.result == "200") {
            // if(!this.curSelectedDepartment.type) {
            //   this.pageInfo.pageIndex = 1;
            //   this.pageInfo.pageSize = 20;
            //   this.pageInfo.pageCount = 0;
            // }
            // 重新加载维修项目列表详情
            this.reqInspectProjectList(true);
            // 删除后保持查询条件
            this.$nextTick(() => {
              if (this.$refs.head && Object.keys(this.cachedForm).length > 0) {
                this.$refs.head.updateFormData(this.cachedForm);
              }
            });
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success"
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error"
          });
        });
    },
    setAndSaveDrag() {
      if(!this.isDraggable) {
        this.isDraggable = !this.isDraggable
        return false
      }
      // 保存
      let params = {}
      params.context = JSON.parse(JSON.stringify(this.organizationTreeList))
      this.$client.GroupTypeSortRewardPunish(params).then(res => {
        if(res.head.result == "200") {
          this.loadOrganizationTree();
          // 重新定位到目前组织树中
          this.locationCurNode();
          this.isDraggable = false
          this.$message({
            showClose: true,
            message: successrMessage,
            type: "success"
          });
        }this.$message({
          showClose: true,
          message: res.head.describle,
          type: "error"
        });
      }).catch(err => {});
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.maintenance-project-manage-box {
  width: 100%;
  height: 100%;
}

.maintenance-project-manage {
  width: 100%;
  height: 100%;
  display: flex;

  .box-card {
    height: 100%;
    // overflow: auto;
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

.department-detail /deep/ .el-input {
  // width: 250px;
}

// 查询条件样式
.department-detail /deep/ .el-form {
  background-color: #f5f7fa;
  border-bottom: 1px solid #e6e6e6;
  padding: 8px 12px;
  margin-bottom: 10px;
}

.department-detail /deep/ .el-form-item {
  margin-right: 10px;
  
  &:last-child {
    margin-right: 0;
  }
}

.department-detail /deep/ .el-button {
  margin-left: 8px;
  
  &:first-child {
    margin-left: 0;
  }
}

.department-detail /deep/ .el-input {
  width: 200px;
}

.department-detail /deep/ .el-select {
  width: 150px;
}

.maintenance-project-manage /deep/ .el-card__header {
  background-color: #F5F5F5;
  padding: 12px 20px;
}

.superior-department-content {
  margin-bottom: 30px;
}
</style>
