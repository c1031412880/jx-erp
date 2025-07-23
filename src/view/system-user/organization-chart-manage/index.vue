<template>
  <organization-chart-manage-data-center/>
</template>
<script type="text/ecmascript-6">
  export default {
    name: "organization-chart-manage",
  }
</script>
<!--
<template>
  <div class="organization-chart" v-loading="organizationloading">
    <div class="organization-chart-manage">
      <el-card class="box-card left-box">
        <div
          slot="header"
          class="clearfix show-flex-box-r"
          style="height: 37px; flex-wrap: nowrap; align-items:center;"
        >
          <span style="white-space:nowrap;">组织架构</span>
          <el-button style="margin-left: 15px" type="primary" size="mini"
          @click="openSetOrganizationInfoDialog('add')"
          v-if="organizationTreeList.length == 0 && $isPowerShow('add')"
            >添加总组织</el-button
          >
        </div>
        <organization-tree
          ref="organizationTree"
          :loading="organizationloading"
          :placeholder="placeholder"
          :organizationTreeList="organizationTreeList"
          :organizationTreeListLength="organizationTreeListLength"
          @on-tree="selectDepartment"
        ></organization-tree>
      </el-card>
      <el-card class="box-card center-box" ref="centerBox" v-if="!!curSelectedDepartment">
        <div style="margin: 5px 0" slot="header">
          <span v-if="organizationDetailInfo">{{organizationDetailInfo.dept_name}}</span>
          <el-button style="margin-left: 100px" type="primary" size="mini" v-if="$isPowerShow('edit')"
          @click="openSetOrganizationInfoDialog('edit')"
            >编辑</el-button
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
              <div class="show-flex-box-c">
                <p style="font-size: 18px; margin-bottom: 5px;">当前部门下共有{{curSelectedDepartment.children.length}}个子部门、{{curSelectedDepartment.count}}名员工，若确定则会删除所有子部门信息，员工所属部门将为空</p>
                <span style="color:#F56C6C">是否确定删除？</span>
              </div>
            </div>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="suerDeleteDepartmentInfo()">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini" v-if="$isPowerShow('del')">删除</el-button>
          </el-popover>
        </div>
        <div class="department-detail show-flex-box-c">
          <div class="superior-department-content">
            <superior-department
              ref="superiorDepartment"
              :departmentList="curSelectedDepartment.children"
              @add-organization-info="addOrganizationInfo"
              @selected-organization-info="selectedOrganizationInfo"
              @update-sore-event="updateSoreEvent"
              @have-other-sore="haveFirstSore"
            ></superior-department>
          </div>
          <div class="department-user">
            <department-user
              ref="departmentUser"
              :departmentUserList="departmentUserList"
              :isShowAdjustOrganizationDialog="isShowAdjustOrganizationDialog"
              :loading="departmentUserListLoading"
              @adjust-organization-set="adjustOrganizationSet"
              @removed-department-user="removedDepartmentUser"
              @update-sore-event="updateSoreEvent"
              @have-other-sore="haveSecondSore"
            ></department-user>
          </div>
        </div>
      </el-card>
      <el-card class="box-card center-box show-flex-box-r show-flex-center" v-else>
        <div>
          <el-empty description="暂无部门信息"></el-empty>
          <!-- <span style="font-size: 14px; color:#909399;">暂无部门信息</span> 
        </div>
        <!-- <el-empty description="描述文字"></el-empty> 
      </el-card>
    </div>
    <div class="organization-chart-dialog">
      <set-organization-info
        ref="setOrganizationInfo"
        :dialogBool.sync="isShowSetOrganizationInfoDialog"
        :curType="curType"
        :competentUserOptions="competentUserOptions"
        :superiorDeptName="superiorDeptName"
        :isFirstOrganization="isFirstOrganization"
        @save-add-edit-organization="saveAddEditOrganizationInfo"
      ></set-organization-info>
      
      <adjust-organization-dialog
        ref="adjustOrganization"
        :organizationTreeList="organizationTreeList"
        :dialogBool.sync="isShowAdjustOrganizationDialog"
        @save-selected-department="saveSelectedDepartment"
      ></adjust-organization-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import organizationTree from "./component/organization-tree";
import superiorDepartment from "./component/superior-department";
import departmentUser from "./component/department-user";
import setOrganizationInfo from "./component/dialog-component/set-organization-info";

import adjustOrganizationDialog from "./component/dialog-component/adjust-organization-dialog";

export default {
  name: "organization-chart-manage",
  data() {
    return {
      TabelHeight: 0,
      visible: false,
      department_id: "",
      userLoading: false,
      placeholder: "请输入关键字",
      organizationloading: false,
      organizationTreeList: [],
      organizationTreeListLength:0,
      departmentList: [],
      departmentUserList: [],
      curType: 'add',
      isShowSetOrganizationInfoDialog: false,
      isFirstOrganization: false,
      isShowAdjustOrganizationDialog: false, //调整组织
      curSelectedDepartment:null,
      selectedUserIds:[],  //选中需要调整的人员IDs
      organizationDetailInfo: null,
      superiorDeptName:"无", //当前修改的上交组织名称
      competentUserOptions:[], //主管
      departmentUserListLoading:false
    };
  },
  components: {
    organizationTree,
    superiorDepartment,
    departmentUser,
    setOrganizationInfo,
    adjustOrganizationDialog
  },
  mounted() {
    this.setHead();
    this.loadOrganizationTree()
  },
  methods: {
    // 计算高度
    setHead() {
      setTimeout(() => {
        // let h = this.$refs.centerBox.$el.offsetHeight;
        // this.TabelHeight = h - 163;
      }, 60);
    },
    // 获取组织tree信息
    loadOrganizationTree() {
      this.organizationloading = true;
      this.$client.getOrganizationTree()
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.organizationTreeList = res.context;
          this.organizationTreeListLength = this.organizationTreeList.length; 
          this.organizationloading = false;
          if( this.organizationTreeList.length == 0) {
              this.isFirstOrganization = true;
            }
          if(this.curSelectedDepartment && !this.organizationloading) {
            // 重新定位到目前组织树中
              this.locationCurNode();
            }
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
    // 选择某一组织
    selectDepartment(departmentInfo) {
      this.curSelectedDepartment = departmentInfo;
      this.reqOrganizationDetail(true) // 获取部门组织详情
      this.reqOrganizationPeople()  // 获取部门人员信息
    },

    selectedOrganizationInfo(departmentInfo) {
      this.curSelectedDepartment = departmentInfo;
      if(!!this.curSelectedDepartment) {
        this.locationCurNode();
      }
      this.reqOrganizationDetail(true) // 获取部门组织详情
      this.reqOrganizationPeople()  //获取部门人员信息
    },
    // 获取部门组织详情
    // isCurDepartment //是否是当期组织还是上级组织
    reqOrganizationDetail(isCurDepartment) {
      let params = {
        dept_id: isCurDepartment? this.curSelectedDepartment.dept_id : this.curSelectedDepartment.parent_id
      }
      
      this.$client.getOrganizationDetail(params)
      .then(res => {
        console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.organizationDetailInfo = res.context;
          this.organizationloading = false;
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
    // 获取部门人员信息
    reqOrganizationPeople() {
      this.departmentUserListLoading = true;
      let params = {
        dept_id: this.curSelectedDepartment.dept_id
      }
      this.$client.getDeptPerson(params)
      .then(res => {
        console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.departmentUserList = res.context;
          this.competentUserOptions = this.bulidDepartmentManagerList(this.departmentUserList)
          this.userLoading = false;
          } else {
            this.userLoading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
          this.departmentUserListLoading = false;
      }).catch(err => {
        this.departmentUserListLoading = false;
      })
    },
    // 构建主管
    bulidDepartmentManagerList(departmentUserList) {

      let newCompetentUserOptions = [];
      departmentUserList.forEach((item,index) => {
        let obj = {
         id: String(item.id),
         name: item.name,
        }
        newCompetentUserOptions.push(obj)
      });

      return newCompetentUserOptions

    },
    // 回显添加编辑form
    bulidFormInfo() {
      this.superiorDeptName = !!this.organizationDetailInfo.parent_name? this.organizationDetailInfo.parent_name: '无';
      this.$refs.setOrganizationInfo.ruleForm.dept_id = this.organizationDetailInfo.dept_id;
      this.$refs.setOrganizationInfo.ruleForm.dept_name = this.organizationDetailInfo.dept_name;
      this.$refs.setOrganizationInfo.ruleForm.parent_id = this.organizationDetailInfo.parent_id;
      this.$refs.setOrganizationInfo.ruleForm.admin_type = String(this.organizationDetailInfo.admin_type);
      // this.$refs.setOrganizationInfo.ruleForm.func_type = this.organizationDetailInfo.func_type;
      this.organizationDetailInfo.func_type.forEach(item => {
        this.$refs.setOrganizationInfo.ruleForm.func_type.push(String(item))
      });

      this.$refs.setOrganizationInfo.ruleForm.describe = this.organizationDetailInfo.describe;
      this.$refs.setOrganizationInfo.ruleForm.manager_id = !!this.organizationDetailInfo.manager_id? this.organizationDetailInfo.manager_id : '';
      this.$refs.setOrganizationInfo.ruleForm.director_id = !!this.organizationDetailInfo.director_id? this.organizationDetailInfo.director_id : '';
    },
    // 打开设置组织弹窗
    openSetOrganizationInfoDialog(type) {
      this.curType = type;
      if(this.curType == 'edit') {
        this.superiorDeptName = "无"
        this.bulidFormInfo();
      }
      if(!!this.curSelectedDepartment.parent_id) {
        this.isFirstOrganization = false;
      }else{
        this.isFirstOrganization = true;
      }
      this.isShowSetOrganizationInfoDialog = true;
    },
    addOrganizationInfo(type) {
      this.curType = type;
      if(this.curType == 'add') {
        this.$refs.setOrganizationInfo.ruleForm.parent_id = this.curSelectedDepartment.dept_id;
        this.superiorDeptName = this.curSelectedDepartment.dept_name;
      }
      this.isFirstOrganization = false;
      this.isShowSetOrganizationInfoDialog = true;
    },
    // 添加、编辑保存组织
    saveAddEditOrganizationInfo(form) {
      let successrMessage = '';
      let params = {
        context: form
      }
      if (this.curType == "add") {
        successrMessage = "添加成功";
        this.$client
          .setOrganization(params)
          .then((res) => {
            if (res.head.result == "200") {
              this.loadOrganizationTree();
              this.reqOrganizationDetail(true);
              // 重新定位到目前组织树中
              this.locationCurNode();
              this.isShowSetOrganizationInfoDialog = false;
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
        .EditDeptmentOrganizationManager(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadOrganizationTree();
            this.reqOrganizationDetail(true);
            // 重新定位到目前组织树中
            this.locationCurNode();
            this.isShowSetOrganizationInfoDialog = false;
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
    // 更新排序组织、人员
    updateSoreEvent(tableInfo,type) {
      let params = {
        context:{
          parent_id: this.curSelectedDepartment.dept_id,
          details: tableInfo
        }
      };
       this.$client
        .changeUSerAndDeptSort(params)
        .then((res) => {
          if (res.head.result == "200") {
            if(type == "department") {
              // 排序成功重新加载组织树
              this.loadOrganizationTree();
              // 排序成功重新加载组织树详情
              this.reqOrganizationDetail(true);
              // 重新定位到目前组织树中
              this.locationCurNode();
              // // 转换显示是否排序
              let children = [];
              tableInfo.forEach(item => {
                this.curSelectedDepartment.children.forEach(zItem => {
                  if(item.id == zItem.dept_id) {
                    children.push(zItem)
                  }
                })
              });
              this.curSelectedDepartment.children = children
            }else if(type == "user") {
              // 排序成功更新一波
              this.reqOrganizationPeople()
              // let newDepartmentUserSort = [];
              // tableInfo.forEach(item => {
              //   this.departmentUserList.children.forEach(zItem => {
              //     if(item.id == zItem.id) {
              //       newDepartmentUserSort.push(zItem)
              //     }
              //   })
              // });
            }
            this.$message({
              showClose: true,
              message: "排序成功",
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
    // 删除部门信息
    suerDeleteDepartmentInfo() {
      let params = {
        dept_id: this.curSelectedDepartment.dept_id
      }
      this.$client
        .deleteOrganizationInfo(params)
        .then((res) => {
          if (res.head.result == "200") {
            // 排序成功重新加载组织树
            this.loadOrganizationTree();
            // 排序成功重新加载组织树详情
            this.reqOrganizationDetail(false);
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
    // 移除部门人员
    removedDepartmentUser(usreInfo) {
      let params = {
        dept_id: this.curSelectedDepartment.dept_id,
        user_id: usreInfo.id
      }
      this.$client
        .deleteDeptPerson(params)
        .then((res) => {
          if (res.head.result == "200") {
            // 删除成功重新加载组织树
            this.loadOrganizationTree();
            // 重新定位到目前组织树中刷新当前组织中的人数
            this.locationCurNode();

            this.departmentUserList.forEach((item,index) => {
              if(item.id == usreInfo.id) {
               this.departmentUserList.splice(index, 1) 
              }
            });
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
        })
        .catch((err) => {
        });
    },
    // 重新定位到目前组织树中
    locationCurNode() {
      let ids= [];
      ids.push(this.curSelectedDepartment.dept_id);
      setTimeout(() => {
        this.$refs.organizationTree.setSelecedCheckedKeys(ids);
      }, 60);
    },
    //重新定位到目前上一级组织树中
    locationParentNode() {
      let ids= [];
      ids.push(this.curSelectedDepartment.parent_id);
      this.$refs.organizationTree.setSelecedCheckedKeys(ids);
    },
    // 打开调整组织弹窗
    adjustOrganizationSet(selectedUserIds) {
      this.selectedUserIds = selectedUserIds;
      console.log(selectedUserIds)
      if(selectedUserIds.length > 0) {
        this.isShowAdjustOrganizationDialog = true;
      }else{
         this.$message({
          showClose: true,
          message: '请选择要调整部门的人员',
          type: "warning",
        });
      }
    },
    // 确定部门人员调整
    saveSelectedDepartment(departmentId) {
      let context = []
      this.selectedUserIds.forEach((item,index) => {
        let obj = {
          id: item,
          dept_id: this.curSelectedDepartment.dept_id,
          new_dept_id: departmentId
        };
        context.push(obj)
      });
      let params = {
        context: context
      };
      // console.log(params)
      // return
      this.$client
        .changeUserDept(params)
        .then((res) => {
          if (res.head.result == "200") {
            // 调整成功重新加载组织树
            this.loadOrganizationTree();
            // 重新定位到目前组织树中刷新当前组织中的人数
            this.locationCurNode();
            // 刷新当前人员列表
            this.reqOrganizationPeople()

            this.isShowAdjustOrganizationDialog = false;

          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
        });
    },
    // 第一级排序已开启
    haveFirstSore() {
      this.$refs.departmentUser.isShowadjustSort = false
    },
    // 第二级排序已开启
    haveSecondSore() {
      this.$refs.superiorDepartment.isShowadjustSort = false
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.organization-chart{
  width: 100%;
  height: 100%;
}
.organization-chart-manage {
  width: 100%;
  height: 100%;
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

.organization-chart-manage /deep/ .el-card__header {
  background-color: #F5F5F5;
  padding: 12px 20px;
}

.superior-department-content {
  margin-bottom: 30px;
}
</style>
-->