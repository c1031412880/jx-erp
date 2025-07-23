<template>
  <role-management-data-center/>
</template>
<script type="text/ecmascript-6">
  export default {
    name: "role-management",
  }
</script>
<!--
<template>
  <div class="role-management">
    <div class="role-management-content">
      <el-card class="box-card left-box">
        <div
          slot="header"
          class="clearfix show-flex-box-r"
          style="height: 37px; line-height: 37px; flex-wrap: nowrap; align-items:center;"
        >
          <span style="white-space:nowrap;">用户角色</span>
          <el-button style="margin-left: 10px; height: 30px" type="primary" size="mini"
          @click="openSetRoleDialog('group')" v-if="$isPowerShow('save_role')"
            >添加角色组</el-button
          >
          <el-button style="margin-left: 10px;height: 30px" type="primary" size="mini"
          @click="openSetRoleDialog('role')" v-if="$isPowerShow('save_role')"
            >添加角色</el-button
          >
        </div>
        <role-tree
          ref="roleTree"
          :loading="organizationloading"
          :placeholder="placeholder"
          :organizationTreeList="organizationTreeList"
          @on-tree="selectRoleTree"
          @bulid-rolegroup-options="bulidRoleGroupOptions"
        ></role-tree>
      </el-card>
      <el-card class="box-card center-box" ref="centerBox">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="!!curRoleType? '角色管理':'角色组管理'" name="first">
            <div>
              <role-info-set
               ref="roleInfoSet"
               :roleGroupOptions="roleGroupOptions"
               @save-add-edit-role="saveAddEditRole"
               @delete-role-info="deleteRoleInfo"
               @on-set="onSetGroupRoleAuth"
               ></role-info-set>
               <!-- :curRoleInfo="curRoleInfo" 
            </div>
          </el-tab-pane>
          <el-tab-pane :label="!!curRoleType? '角色数据分配':'角色组数据分配'" name="second" v-if="!!is_auth || curRoleType == 1|| curRoleType == 4">
            <role-data-distribution
              ref="roleDataDistribution"
              :curType="curType"
              :curRoleOrgIds="curRoleOrgIds"
              :curRoleGroupOrgIds="curRoleGroupOrgIds"
              :curRoleCircuitIds="curRoleCircuitIds"
              @save-role-data="saveRoleDataDistribution"
            ></role-data-distribution>
          </el-tab-pane>
          <el-tab-pane :label="!!curRoleType? '角色功能权限':'角色组功能权限'" name="third" v-if="!!is_auth || curRoleType == 1 || curRoleType == 4">
            <menu-tree
             ref="menuTree"
             :curRolePriIds="curRolePriIds"
             :group_id="group_id"
             @save-menu-function-authority="saveMenuFunctionAuthority"
             ></menu-tree>
          </el-tab-pane>
          <el-tab-pane :label="!!curRoleType? '角色用户分配':'角色组用户分配'" name="fourth" v-if="!!is_auth || !!curRoleType">
            <department-user
              :loading="roleUserloading"
              :departmentUserList="roleUserList"
              :curRoleType="curRoleType"
              :curRoleInfo="curRoleInfo"
              @open-selected-user="openSelectedUser"
              @delete-relevance-user="deleteRelevanceUser"
            ></department-user>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <div class="role-management-dialog">
      <set-role-info 
        ref="setRoleInfo"
        :curType="curType"
        :roleGroupOptions="roleGroupOptions"
        :dialogBool.sync="isShowSetRoleDialog"
        @save-add-edit-role="saveAddEditRole"
      ></set-role-info>
      <!-- <add-relevance-user
        ref="addRelevanceUser"
        :dialogBool.sync="isShowAddRelevanceUserDialog"
        :loading="departmentUserloading"
        :departmentUserList="departmentUserList"
        @save-seleced-role-user="saveSelecedRoleUser"
      >
      </add-relevance-user> 
      <add-correlation-user
        ref="addCorrelationUser"
        :dialogBool.sync="isShowCorrelationUserDialog"
        :loading="departmentUserloading"
        @save-selected-user="saveSelecedRoleUser"
      >
      </add-correlation-user>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import roleTree from "./component/role-tree";
import roleInfoSet from "./component/role-info-set";
import roleDataDistribution from "./component/role-data-distribution";
import menuTree from './component/menu-tree'
import departmentUser from "./component/department-user";
import setRoleInfo from "./component/dialog-component/set-role-info";
import addRelevanceUser from "./component/dialog-component/add-relevance-user";
import addCorrelationUser from "./component/dialog-component/add-correlation-user";

export default {
  name: "role-management",
  data() {
    return {
      visible: false,
      department_id: "",
      userLoading: false,
      placeholder: "请输入关键字",
      organizationloading: false,
      organizationTreeList: [],
      departmentUserloading: false,
      departmentUserList: [], //所有的用户
      roleUserList:[],
      roleUserloading: false,
      curType: 'group',
      isShowSetRoleDialog: false,
      isFirstOrganization: true,
      isShowAddRelevanceUserDialog: false, //选择角色人员弹窗
      isShowCorrelationUserDialog: false, //选择角色人员弹窗
      selectedUserIds:[],  //选中需要调整的人员IDs
      activeName:"first",
      curRoleType:'0', //	0角色组 1其他角色 2主管 3超级管理员 4集团管理员
      curRoleInfo: null, //当前选择的节点信息
      roleGroupOptions: [],
      curRoleOrgIds:[], //已关联组织架构IDs
      curRoleGroupOrgIds:[], //已关联角色组组织架构IDs
      curRoleCarIds:[], //已关联车辆IDs
      curRoleCircuitIds:[], //已关联线路IDs
      curRolePriIds:[], //已关联的角色公共权限ids
      is_auth: false, //角色组权限
      group_id: 0, //获取权限树参数
    };
  },
  components: {
    roleTree,
    roleInfoSet,
    roleDataDistribution,
    menuTree,
    departmentUser,
    setRoleInfo,
    addRelevanceUser,
    addCorrelationUser
  },
  mounted() {},
  methods: {
    // 获取角色、角色组详情
    selectRoleTree(roleTreeInfo) {
      // console.log(roleTreeInfo);
      this.$refs.setRoleInfo.ruleForm.i_group_id = !!roleTreeInfo.type ? roleTreeInfo.i_group_id : roleTreeInfo.i_id

      this.curRoleInfo = roleTreeInfo,
      this.curRoleType = roleTreeInfo.type;
      this.activeName="first";
      this.bulidSetRoleFrom(roleTreeInfo);  //构建角色组、角色信息数据回显
      this.curType = !!this.curRoleType ? 'role' : 'group'
      this.group_id = roleTreeInfo.i_group_id
      // 获取角色数据
      if(!!this.curRoleInfo) {
        // 获取角色数据 1：组织架构，2：线路，3：车辆
        if(this.curRoleType == 1 || this.curRoleType == 4 || !!this.is_auth) {
          this.curRoleOrgIds = []; //已关联组织架构IDs
          this.curRoleGroupOrgIds = []; //已关联组织架构IDs
          this.curRoleCarIds = []; //已关联车辆IDs
          this.curRoleCircuitIds =[]; //已关联线路IDs
          this.reqRoleDep();
          this.reqRoleVehicle();
          this.reqRoleLine();
            // 获取角色权限数据获取
          this.reqRolePriData()
        }
        // 获取角色关联的用户
        this.reqRolePerson()
      }
    },
    // 构建角色组、角色信息数据回显
    bulidSetRoleFrom(roleTreeInfo){
      this.$refs.roleInfoSet.ruleForm.i_id = roleTreeInfo.i_id;
      this.$refs.roleInfoSet.ruleForm.c_name = roleTreeInfo.c_name;
      this.$refs.roleInfoSet.ruleForm.c_remark = roleTreeInfo.c_remark;
      this.$refs.roleInfoSet.ruleForm.i_group_id = !!roleTreeInfo.i_group_id? roleTreeInfo.i_group_id : "";
      this.$refs.roleInfoSet.curRoleType = roleTreeInfo.type;
      this.$refs.roleInfoSet.curIsdel = roleTreeInfo.isdel;
      this.$refs.roleInfoSet.ruleForm.is_auth = !!roleTreeInfo.type ? 0 : roleTreeInfo.is_auth;
      this.is_auth = !!roleTreeInfo.type ? 0 : roleTreeInfo.is_auth;
      this.$refs.roleInfoSet.curGourpRoleNum =  !!roleTreeInfo.type ? 0 : roleTreeInfo.children.length;
    },
    // 接收角色组选项
    bulidRoleGroupOptions(roleGroupOptions) {
      this.roleGroupOptions = roleGroupOptions
    },
    // 角色组权限设置
    onSetGroupRoleAuth(val) {
      this.is_auth = val
    },
    //角色数组织架构据获取 
    reqRoleDep() {
      if(this.curType === 'role') {
        let params = {
          role_id: this.curRoleInfo.i_id,
        };
        this.$client.getRoleDepDataRoleManager(params)
        .then(res => {
          if (res.head.result == "200") {
            let context = res.context;
            if(context.length > 0) 
              this.curRoleOrgIds = this.bulidRoleDataListArr(context, 1);
              // let info = {
              //   group_id: this.curRoleInfo.i_group_id,
              // };
              // this.$client.GetGroupDeptByGroupId(info)
              // .then(res => {
              //   if (res.head.result == "200") {
              //       this.$refs.roleDataDistribution.setTreeData(res.context)
              //   } else {
              //     this.$message({
              //       showClose: true,
              //       message: res.head.describle,
              //       type: "error",
              //     });
              //   }
              // }).catch(err => {
        
              // })
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
        }).catch(err => {
  
        })
      }else {
        let params = {
          group_id: this.curRoleInfo.i_id,
        };
        this.$client.GetGroupDeptByGroupId(params)
        .then(res => {
          if (res.head.result == "200") {
              this.curRoleOrgIds = res.context;
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
    //角色数组车辆获取 
    reqRoleVehicle() {
      if(this.curType === 'role') {
        let params = {
          role_id: this.curRoleInfo.i_id,
        };
        this.$client.getRoleVehicleDataRoleManager(params)
        .then(res => {
          if (res.head.result == "200") {
            let context = res.context;
            if(context.length > 0) 
              this.curRoleCarIds = this.bulidRoleDataListArr(context,2);
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
    //角色数线路获取 
    reqRoleLine() {
      if(this.curType === 'role') {
        let params = {
          role_id: this.curRoleInfo.i_id,
        };
        this.$client.getRoleLineDataRoleManager(params)
        .then(res => {
          if (res.head.result == "200") {
            let context = res.context;
            if(context.length > 0) 
              this.curRoleCircuitIds = this.bulidRoleDataListArr(context,3);
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
    // 构建角色数选择资源keys
    bulidRoleDataListArr(arrList,type) {
      let subjectIds = [];
      if(arrList && arrList.length > 0) {
        arrList.forEach((item,index) => {
          let subject_id = '';
          switch (type) {
            case 1:
              subject_id = item.i_department_id
              break;
            case 2:
              subject_id = item.i_vehicle_id
              break;
            case 3:
              subject_id = item.i_line_id
              break;
          }
          subjectIds.push(subject_id)
        });
      }
      return subjectIds
    },
    // 获取角色关联的用户
    reqRolePerson() {
      if(this.curType === 'role') {
        let params = {
          role_id: this.curRoleInfo.i_id,
        };
        this.roleUserloading = true;
        this.$client.getRolePerson(params)
        .then(res => {
          if (res.head.result == "200") {
            this.roleUserList = res.context;
            this.roleUserloading = false;
            } else {
              this.roleUserloading = false;
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
        }).catch(err => {
  
        })
      }else {
        let params = {
          group_id: this.curRoleInfo.i_id,
        };
        this.roleUserloading = true;
        this.$client.GetGroupUserByGroupId(params)
        .then(res => {
          if (res.head.result == "200") {
            this.roleUserList = res.context;
            this.roleUserloading = false;
            } else {
              this.roleUserloading = false;
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
    // 角色权限数据获取
    reqRolePriData() {
      if(this.curType === 'role') {
        let params = {
          role_id: this.curRoleInfo.i_id,
        };
        this.$client.getRolePriData(params)
        .then(res => {
          if (res.head.result == "200") {
            // this.curRolePriIds = this.bulidRolePritArr(res.context);
            this.curRolePriIds = res.context;
            let lastLevelIds = []
            this.curRolePriIds.forEach(item => {
              if(item.indexOf('.') > -1) {
                lastLevelIds.push(item)
              }
              
            })
            // console.log('*******************************',this.curRolePriIds)
            // console.log('*******************************',lastLevelIds)
            // 回显示角色权限
            this.$refs.menuTree.setSelecedCheckedKeys(lastLevelIds)
            // let params = {
            //     group_id: this.curRoleInfo.i_group_id,
            //   };
            //   this.$client.GetGroupPrivilegeByGroupId(params)
            //   .then(res => {
            //     if (res.head.result == "200") {
            //       // 根据角色组设置角色可选
            //       setTimeout(() => {
            //         this.$refs.menuTree.setTreeData(res.context)
            //       }, 300);
            //     } else {
            //       this.$message({
            //         showClose: true,
            //         message: res.head.describle,
            //         type: "error",
            //       });
            //     }
            //   }).catch(err => {
        
            //   })
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
        }).catch(err => {
  
        })
      }else {
        let params = {
          group_id: this.curRoleInfo.i_id,
        };
        this.$client.GetGroupPrivilegeByGroupId(params)
        .then(res => {
          if (res.head.result == "200") {
            // this.curRolePriIds = this.bulidRolePritArr(res.context);
            this.curRolePriIds = res.context;
            let lastLevelIds = []
            this.curRolePriIds.forEach(item => {
              if(item.indexOf('.') > -1) {
                lastLevelIds.push(item)
              }
              
            })
            // console.log('*******************************',this.curRolePriIds)
            // console.log('*******************************',lastLevelIds)
            // 回显示角色权限
            this.$refs.menuTree.setSelecedCheckedKeys(lastLevelIds)
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
    // 构建角色权限数据获取keys
    bulidRolePritArr(arrList) {
      let ids = [];
      arrList.forEach((item,index)   => {
        ids.push(item.i_privilege_id)
      });
      return ids
    },

    // 打开添加角色弹窗
    openSetRoleDialog(type) {
      this.curType = type;
      this.isShowSetRoleDialog = true;
    },
    // 添加、编辑保存角色、角色组
    saveAddEditRole(form) {
      let successrMessage = '';
      if (!!form.i_id) {
        successrMessage = "编辑成功";
      } else {
        successrMessage = "添加成功";
      }
      let params = {
        context: form
      }
      if(this.curType == 'group') {
        if(!!form.i_id) {
          this.$client
          .EditRoleGroupRoleManager(params)
          .then((res) => {
            if (res.head.result == "200") {
              // 重新加载角色树
              this.reloadRoleTree();
              // 
              // if(!!form.i_id && !!form.i_group_id) {
              //   // 此为编辑角色、
              // }
              if(!!form.i_id) {
                // 此为编辑角色组、更新定位到本节点
                this.updateCurNode(form.i_id)
              }
              this.isShowSetRoleDialog = false;
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
        }else{
          this.$client
          .setRoleGroupInfo(params)
          .then((res) => {
            if (res.head.result == "200") {
              // 重新加载角色树
              this.reloadRoleTree();
              // 
              // if(!!form.i_id && !!form.i_group_id) {
              //   // 此为编辑角色、
              // }
              if(!!form.i_id) {
                // 此为编辑角色组、更新定位到本节点
                this.updateCurNode(form.i_id)
              }
              this.isShowSetRoleDialog = false;
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
      }else{
        if(!!form.i_id) {
          this.$client
          .EditRoleRoleManager(params)
          .then((res) => {
            if (res.head.result == "200") {
              // 重新加载角色树
              this.reloadRoleTree();
              if(!!form.i_id) {
                // 此为编辑角色、更新定位到本节点
                this.updateCurNode(form.i_id)
              }else{
                // 此为添加角色、更新定位到父节点
                this.updateCurNode(form.i_group_id)
              }
              this.isShowSetRoleDialog = false;
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
        }else{
          this.$client
          .setRoleInfo(params)
          .then((res) => {
            if (res.head.result == "200") {
              // 重新加载角色树
              this.reloadRoleTree();
              if(!!form.i_id) {
                // 此为编辑角色、更新定位到本节点
                this.updateCurNode(form.i_id)
              }else{
                // 此为添加角色、更新定位到父节点
                this.updateCurNode(form.i_group_id)
              }
              this.isShowSetRoleDialog = false;
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
         
      }
    },
    // 重新加载角色树
    reloadRoleTree() {
      this.$refs.roleTree.lodData();
    },
    // 更新节点信息
    updateCurNode(id) {
      let ids= [];
      ids.push(id);
      setTimeout(() => {
        this.$refs.roleTree.setSelecedCheckedKeys(ids);
      }, 60);
    },
    // 删除角色、角色组
    // id 要删除的ID  curRoleType角色、角色树类型  i_group_id当为角色时父级角色组
    deleteRoleInfo(id,curRoleType,i_group_id) {
      // alert(id)
      let params = {};
      if(!curRoleType) {
        params.group_id = id;
        this.$client
          .deleteRoleGroup(params)
          .then((res) => {
            if (res.head.result == "200") {
              this.$refs.roleTree.isFirstLoad = true;
              // 重新加载角色树
              this.reloadRoleTree();

              this.$message({
                showClose: true,
                message: "删除角色组成功",
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
      }else{
        params.role_id = id;
        this.$client
          .deleteRole(params)
          .then((res) => {
            if (res.head.result == "200") {
              // 重新加载角色树
              this.reloadRoleTree();
              // 此为添加角色、更新定位到父节点
              this.updateCurNode(i_group_id)
              this.$message({
                showClose: true,
                message: "删除角色成功",
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
      }

    },
    // 打开选择关联用户角色信息
    openSelectedUser() {
      this.isShowCorrelationUserDialog = true;
    },
    // 确定关联用户角色信息
    saveSelecedRoleUser(selectedUserIds) {
      if(this.curType === 'role') {
        let params ={
          context: {
            role_id: this.curRoleInfo.i_id,
            user_ids: selectedUserIds
          }
        };
        this.$client.addRolePerson(params)
          .then((res) => {
            if (res.head.result == "200") {
              // 重新加载角色树
              // this.reloadRoleTree();
              // 此为编辑角色、更新定位到本节点
              // this.updateCurNode(this.curRoleInfo.i_id);
              // 重新获取角色人员列表
              this.reqRolePerson();

              this.isShowCorrelationUserDialog = false;
              this.$message({
                showClose: true,
                message: "关联角色成功",
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
      }else {
        let params ={
          context: {
            group_id: this.curRoleInfo.i_id,
            user_ids: selectedUserIds
          }
        };
        this.$client.SetRoleGroupUser(params)
          .then((res) => {
            if (res.head.result == "200") {
              // 重新加载角色树
              // this.reloadRoleTree();
              // 此为编辑角色、更新定位到本节点
              // this.updateCurNode(this.curRoleInfo.i_id);
              // 重新获取角色人员列表
              this.reqRolePerson();

              this.isShowCorrelationUserDialog = false;
              this.$message({
                showClose: true,
                message: "关联角色成功",
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
      }
    },
    
    // 删除关联用户
    deleteRelevanceUser(selectedUserIds) {
      this.selectedUserIds = selectedUserIds;
      if(this.curType === 'role') {
        let params = {
          context:{
            ids:selectedUserIds
          }
        };
        this.$client
          .deleteRolePerson(params)
          .then((res) => {
            if (res.head.result == "200") {
              // 重新获取角色人员列表
              this.reqRolePerson();
              this.$message({
                showClose: true,
                message: "移除成功",
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
      }else {
        let params = {
          context:{
            user_ids:selectedUserIds,
            group_id: this.curRoleInfo.i_id
          }
        };
        this.$client
          .RemoveRoleUserGroupUser(params)
          .then((res) => {
            if (res.head.result == "200") {
              // 重新获取角色人员列表
              this.reqRolePerson();
              this.$message({
                showClose: true,
                message: "移除成功",
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
      }
    },
    // 保存角色数据分配
    saveRoleDataDistribution(context) {
      if(this.curType === 'role') {
        let params = {
          context:{
            i_role_id: this.curRoleInfo.i_id,
            i_subject_id: context.i_subject_id
          }
        }
        this.$client.setRoleDataDistribution(params, context.i_subject_type)
          .then((res) => {
            if (res.head.result == "200") {
              // 重新加载角色树
              this.reloadRoleTree();
              // 此为编辑角色、更新定位到本节点
              this.updateCurNode(this.curRoleInfo.i_id);
              this.$message({
                showClose: true,
                message: "保存成功",
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
      }else {
        let params = {
          context:{
            group_id: this.curRoleInfo.i_id,
            i_subject_id: context.i_subject_id
          }
        }
        this.$client.SetRoleGroupDept(params, context.i_subject_type)
          .then((res) => {
            if (res.head.result == "200") {
              // 重新加载角色树
              this.reloadRoleTree();
              // 此为编辑角色、更新定位到本节点
              this.updateCurNode(this.curRoleInfo.i_id);
              this.$message({
                showClose: true,
                message: "保存成功",
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
      }
    },

    //保存角色功能权限
    saveMenuFunctionAuthority(selectedIds) {
      if(this.curType === 'role') {
        let params = {
          context:{
            role_id: this.curRoleInfo.i_id,
            c_privileges: selectedIds
          }
        };
        this.$client.setRolePriData(params)
          .then((res) => {
            if (res.head.result == "200") {
              // 重新加载角色树
              this.reloadRoleTree();
              // 此为编辑角色、更新定位到本节点
              this.updateCurNode(this.curRoleInfo.i_id);
              this.$message({
                showClose: true,
                message: "保存成功",
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
      }else {
        let params = {
          context:{
            group_id: this.curRoleInfo.i_id,
            c_privileges: selectedIds
          }
        };
        this.$client.SetRoleGroupPrivilege(params)
          .then((res) => {
            if (res.head.result == "200") {
              // 重新加载角色树
              this.reloadRoleTree();
              // 此为编辑角色、更新定位到本节点
              this.updateCurNode(this.curRoleInfo.i_id);
              this.$message({
                showClose: true,
                message: "保存成功",
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
      }
    }
  },
  watch:{
    activeName() {
      if(this.activeName == 'second') {
        this.$refs.roleDataDistribution.type = '1';
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.role-management{
  width: 100%;
  height: 100%;
}
.role-management-content {
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

.role-management-content /deep/ .el-card__header {
  background-color: #F5F5F5;
  padding: 12px 20px;
}

.superior-department-content {
  margin-bottom: 30px;
}
</style>
-->