<template>
  <div class="maintenance-organization-manage-box" ref="maintenanceOrganizationManageBox">
    <div class="maintenance-organization-manage">
      <el-card class="box-card left-box">
        <div
          slot="header"
          class="clearfix show-flex-box-r"
          style="height: 37px; flex-wrap: nowrap; align-items:center;"
        >
          <span style="white-space:nowrap;">维修组织</span>
          <el-button style="margin-left: 15px" type="primary" size="mini"
          @click="openSetOrganizationInfoDialog()" v-if="$isPowerShow('add')"
            >添加</el-button>
          <div v-if="curSelectedDepartment && organizationDetailInfo && curSelectedDepartment.type !=1 ">
            <el-popover
              placement="bottom"
              title="操作确认"
              width="400"
              v-model="visible">
              <div class="show-flex-box-r" style="">
                <span style="margin-right: 10px; color: #FF9900;" class="show-flex-box-r">
                  <i class="el-icon-question" style="font-size: 25px;"></i>
                </span>
                <div class="show-flex-box-c" v-if="curSelectedDepartment && organizationDetailInfo">
                  <p style="font-size: 18px; margin-bottom: 5px;"  v-if="curSelectedDepartment.type == 4">该维修车间下共关联了{{curSelectedDepartment.children.length}}个维修班组，{{organizationDetailInfo.emps.length}}个人员。是否确定删除？ 确定后 删除车间、班组信息，解除关联人员关系</p>
                  <p style="font-size: 18px; margin-bottom: 5px;" v-if="curSelectedDepartment.type == 5">该维修小组下共关联{{organizationDetailInfo.emps.length}}个人员。是否确定删除？ 确定后 删除班组信息，解除关联人员关系</p>
                  <span style="color:#F56C6C">是否确定删除？</span>
                </div>
              </div>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="suerDeleteDepartmentInfo()">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;" v-if="$isPowerShow('del')">删除</el-button>
            </el-popover>
          </div>
          
        </div>
        <div class="show-flex-box-c" :style="`height: ${treeBoxHeight}px`">
          <maintenance-organization-tree
            ref="organizationTree"
            :loading="organizationloading"
            :placeholder="placeholder"
            :organizationTreeList="organizationTreeList"
            :organizationTreeListLength="organizationTreeListLength"
            @on-tree="selectDepartment"
          ></maintenance-organization-tree>
        </div>
      </el-card>
      <el-card class="box-card center-box" ref="centerBox" v-if="!!curSelectedDepartment">
        <div style="margin: 5px 0" slot="header">
          <span>维修组织信息</span>
          <el-button style="margin-left: 15px" type="primary" size="mini"
          @click="editOrgInfo()" v-if="$isPowerShow('save')"
            >保存</el-button>
        </div>
        <div class="department-detail show-flex-box-c" v-loading="detailLoading">
          <el-form
            size="mini"
            ref="formData"
            label-width="130px"
            :model="formData"
            :rules="rules"
          >
            <el-form-item label="所属维修单元:"  prop="maintain_unit" v-if="curSelectedDepartment.type == 4" style="height: 25px">
              <get-department-select
                ref="baseTree"
                :isContainEmp="isContainEmp"
                :isShowCheckbox="false"
                :funcType="funcType"
                :placeholder="'选择维修单元'"
                v-model="maintain_unit"
                :isExportMultiple="false"
                @on-change="onSelectChange"
              ></get-department-select>
            </el-form-item>
            <el-form-item label="所属维修车间:"  prop="maintain_unit" v-if="curSelectedDepartment.type == 5" style="height: 25px">
              <el-select v-model="workshopId" clearable placeholder="请选择所属维修车间" v-loading="departLoading">
                <el-option
                  v-for="item in workshopDataOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="组织名称:" prop="name">
              <el-input v-model="formData.name" placeholder="请输入组织名称"></el-input>
            </el-form-item>
            <el-form-item label="组织属性:" prop="propety">
              <el-radio-group v-model="formData.propety" disabled>
                <el-radio :label="0"><span style="color:#606266">维修车间</span> </el-radio>
                <el-radio :label="1"><span style="color:#606266">维修班组</span></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <span slot="label" style="font-weight: 400;font-style: normal;color: rgba(102, 102, 102, 0.57);font-size: 13px;">说明:</span>
              <span style="font-weight: 400;font-style: normal;color: rgba(102, 102, 102, 0.57);font-size: 13px;">维修组织架构层级为维修单元-维修车间-维修班组。<br/>其中维修单元需要在组织架构管理中指定。</span>
            </el-form-item>
            <el-form-item>
              <span slot="label" style="font-weight: 400;font-style: normal;font-size: 14px;color: #606266;font-weight: 700;">人员:</span>
               <el-button style="margin-left: 15px" type="primary" size="mini"
                @click="openAddRelevanceUserPop()" v-if="$isPowerShow('add')"
                  >添加</el-button
                >
                <el-button style="margin-left: 15px" type="primary" size="mini"
                @click="deleteSelectedUserInfo()" v-if="$isPowerShow('del')"
                  >移除</el-button
                >
            </el-form-item>
            <div style="margin: 0px 80px;">
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
                :isFixedEmptyPlaceholder="false"
              >
                <template slot-scope="scope" slot="operation">
                    <el-popconfirm
                      @confirm="deleteRowInfo(scope.data)"
                      title="确定移除该人员吗？">
                      <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;">移除</el-button>
                    </el-popconfirm>
                </template>
              </tr-table>
            </div>

          </el-form>
        </div>  

      </el-card>
      <el-card class="box-card center-box show-flex-box-r show-flex-center" v-else>
          <el-empty description="现只支持维修车间、维修小组信息查看或修改"></el-empty>
      </el-card>
    </div>
    <div class="organization-chart-dialog">
      <set-organization-info
        ref="setOrganizationInfo"
        :dialogBool.sync="isShowSetOrganizationInfoDialog"
        :workshopDataOptions="workshopDataOptions"
        :departLoading="departLoading"
        @save-add-edit-organization="saveAddEditOrganizationInfo"
      ></set-organization-info>

      <!-- <add-relevance-user
        ref="addRelevanceUser"
        :dialogBool.sync="isShowAddRelevanceUserDialog"
        :loading="departmentUserloading"
        :departmentUserList="userList"
        @save-seleced-role-user="saveSelecedRoleUser"
      >
      </add-relevance-user> -->

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
import maintenanceOrganizationTree from "./component/maintenance-organization-tree";
import setOrganizationInfo from "./component/set-organization-info-dialog"
// import addRelevanceUser from "./component/add-relevance-user-dialog";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import addCorrelationUser from "@/view/system-user/role-management/component/dialog-component/add-correlation-user";

export default {
  name: "maintenance-organization-manage",
  data() {
    return {
      treeBoxHeight:500,
      visible: false,
      userLoading: false,
      placeholder: "请输入关键词",
      organizationloading: false,
      detailLoading: false,
      organizationTreeList: [],
      organizationTreeListLength:0,
      departmentUserList: [],
      curType: 'add',
      isShowSetOrganizationInfoDialog: false,
      isFirstOrganization: false,
      curSelectedDepartment:null,
      selectedUserIds:[],  //选中需要调整的人员IDs
      organizationDetailInfo: null,
      isContainEmp: false,
      funcType: 2, // 功能类别 1 运营单元 2 维修单元 3 仓储单元
      workshopDataOptions:[], //车间列表
      maintain_unit:'', //维修单元所属组织ID
      formData: {
        name: '',
        maintain_unit:[],
        propety: 0,
      },
      rules: {
         maintain_unit: [{
          required: true,
          message: '请选择所属维修单元',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '请输入组织名称',
          trigger: 'blur'
        }],
        propety: [{
          required: true,
          message: '请选择组织属性',
          trigger: 'blur'
        }]
      },
      data:[], //人员列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "姓名",
          prop: "c_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "工号",
          prop: "c_worker_id",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "岗位",
          prop: "position_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
      ],
      loading: false,
      TableHeight:400,
      isShowAddRelevanceUserDialog: false,
      isShowCorrelationUserDialog: false,
      departmentUserloading: false,
      userList: [], //用户列表
      departLoading: false,
      workshopId: "",
      deleteUserIds:[], //要移除的用户
    };
  },
  components: {
    maintenanceOrganizationTree,
    setOrganizationInfo,
    // addRelevanceUser,
    getDepartmentSelect,
    addCorrelationUser
  },
  mounted() {
    this.setHead();
    this.loadOrganizationTree()
    this.loadMaintainDepart()
  },
  methods: {
    // 计算高度
    setHead() {
      setTimeout(() => {
        this.treeBoxHeight = this.$refs.maintenanceOrganizationManageBox.offsetHeight - 110;
        // let h = this.$refs.centerBox.$el.offsetHeight;
        // this.TabelHeight = h - 163;
      }, 60);
    },
    // 获取维修车间
    loadMaintainDepart() {
      this.departLoading = true;
      this.$client.getMaintainDepart()
      .then(res => {
        if(res.head.result == "200") {
          this.workshopDataOptions = this.bulidDepatList(res.context);
          this.departLoading = false;
        }else {
            this.departLoading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      })
    },
    // 构建维修车间
    bulidDepatList(arrayList) {
      let list = [];
      arrayList.forEach(item => {
        let obj = {
          id: item.i_id,
          name: item.c_name,
        };
        list.push(obj)
      });

      return list
    },
    // 获取组织tree信息
    loadOrganizationTree() {
      this.organizationloading = true;
      this.$client.getMaintainTree()
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
      if(departmentInfo.type == 1 && !departmentInfo.can_edit) {
        this.curSelectedDepartment = null;
        this.$message({
          showClose: true,
          message: '请选择维修车间或维修小组',
          type: "warning",
        });
        return
      }
      this.curSelectedDepartment = departmentInfo;
      this.reqOrganizationDetail(true) // 获取部门组织详情
      this.$nextTick(() => {
        this.$refs.formData.clearValidate();
      });
    },
    // 获取车间、小组详情
    // isCurDepartment //是否是当期组织还是上级组织
    reqOrganizationDetail(isCurDepartment) {
      this.detailLoading = true;
      let params = {
        i_id : isCurDepartment? this.curSelectedDepartment.i_id : this.curSelectedDepartment.belong_id,
        type: isCurDepartment? this.curSelectedDepartment.type : this.curSelectedDepartment.belong_type
      }
      
      this.$client.getMaintainOrgDetail(params)
      .then(res => {
        if (res.head.result == "200") {
          console.log(res.context)
          this.organizationDetailInfo = res.context;
          this.bulidForm(); //构建表单回显
          this.detailLoading = false;
          } else {
            this.detailLoading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {
        this.detailLoading = false;
      })
    },
    // 构建表单回显
    bulidForm() {
      if(!!this.organizationDetailInfo) {
        this.formData.id = this.organizationDetailInfo.i_id;
        this.formData.name = this.organizationDetailInfo.c_name;
        if(this.organizationDetailInfo.type == 4) {
          this.formData.maintain_unit = this.organizationDetailInfo.maintain_unit;
        }
        this.organizationDetailInfo.type == 4? this.formData.propety = 0 : this.formData.propety = 1;
        if(this.organizationDetailInfo.maintain_unit.length > 0 && this.organizationDetailInfo.type == 4) {
          setTimeout(() => {
            this.maintain_unit = this.organizationDetailInfo.belong_id
            // this.$refs.baseTree.departmentCheck(this.organizationDetailInfo.maintain_unit)
          }, 60);
        }
        if(this.organizationDetailInfo.type == 5) {
          this.formData.maintain_unit = [];
          this.formData.maintain_unit.push({i_id: this.organizationDetailInfo.belong_id})
          this.workshopId = this.organizationDetailInfo.belong_id
        }
        this.data = this.organizationDetailInfo.emps
      }
    },
    // 打开设置组织弹窗
    openSetOrganizationInfoDialog() {
      this.curType = "add";
      this.isShowSetOrganizationInfoDialog = true;
    },
    // 编辑
    editOrgInfo() {
      this.curType = "edit";
      this.saveAddEditOrganizationInfo(this.formData)
    },
    // 添加、编辑保存组织
    saveAddEditOrganizationInfo(form) {
      let successrMessage = '';
      if (this.curType == "add") {
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
         if(!form.name){
            this.$message({
                showClose: true,
                message: '请填写组织名称',
                type: "warning",
              });
            return
          }
          if(this.organizationDetailInfo.type == 5 && !this.workshopId){
            this.$message({
                showClose: true,
                message: '请选择所属的维修车间',
                type: "warning",
              });
            return
          }
          if(this.organizationDetailInfo.type == 4 && !this.formData.maintain_unit.length){
            this.$message({
                showClose: true,
                message: '请选择所属维修单元',
                type: "warning",
              });
            return
          }

        if(this.organizationDetailInfo.type == 5 && !!this.workshopId) {
          form.maintain_unit = [];
          form.maintain_unit.push({i_id: this.workshopId})
        }
        
      }
      let params = {
        context: form
      }
      this.$client
        .addMaintainOrg(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadOrganizationTree();
            this.loadMaintainDepart();
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
    },

    // 删除维修组织
    suerDeleteDepartmentInfo() {
      let params = {
        context: {
          i_id: this.curSelectedDepartment.i_id,
          type: this.curSelectedDepartment.type
        }
      }
      this.$client
        .deleteMaintainOrg(params)
        .then((res) => {
          if (res.head.result == "200") {
            // 排序成功重新加载组织树和维修车间
            this.loadOrganizationTree();
            this.loadMaintainDepart();
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
      ids.push(this.curSelectedDepartment.belong_id);
      this.$refs.organizationTree.setSelecedCheckedKeys(ids);
    },
    // 分公司选择
    onSelectChange(vehs, nodes) {
     this.formData.maintain_unit = [];
      if (nodes && nodes.length > 0) {
        nodes.forEach((item, index) => {
          delete item.children;
        });
        this.formData.maintain_unit = nodes
      } else {
        this.formData.maintain_unit = [];
      }
    },
    // 添加用户弹窗
    openAddRelevanceUserPop() {
      this.isShowCorrelationUserDialog = true;
    },
    // 确定关联用户角色信息
    saveSelecedRoleUser(selectedUserIds) {
      let params ={
        context: {
          i_type: this.curSelectedDepartment.type == 4? 1 : this.curSelectedDepartment.type == 5? 2 : '',
          i_main_id: this.curSelectedDepartment.i_id,
          i_person_id: selectedUserIds
        }
      };
       this.$client
          .addMaintainOrgEmp(params)
          .then((res) => {
            if (res.head.result == "200") {
              // 重新获取角色人员列表
              this.reqOrganizationDetail(true) 

              this.isShowCorrelationUserDialog = false;
              this.$message({
                showClose: true,
                message: "关联人员成功",
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
    // 选中表格勾选框
    selectedUserList(userList) {
      this.deleteUserIds = [];
      userList.forEach((item,index) => {
        this.deleteUserIds.push(item.i_id)
      });
      console.log(JSON.stringify(this.deleteUserIds))
    },
    // 确定批量移除勾选用户
    deleteSelectedUserInfo() {
      if(this.deleteUserIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选至少一条要移除的人员',
          type: "warning",
        });
        return
      }
      this.deleteRowInfo(null)
    },
    // 移除人员
    deleteRowInfo(info) {
      let params = {
        context: {
          type: this.curSelectedDepartment.type == 4? 1 : this.curSelectedDepartment.type == 5? 2 : '',
          i_main_id: this.curSelectedDepartment.i_id,
          id:[]
        }
      };
      if(!!info) {
        params.context.id[0] = info.i_id
      }else{
        params.context.id = this.deleteUserIds
      }
      this.$client.deleteMaintainOrgEmp(params)
      .then(res => {
        if (res.head.result == "200") {
          // 重新获取角色人员列表
          this.reqOrganizationDetail(true) 
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
.maintenance-organization-manage-box{
  width: 100%;
  height: 100%;
}
.maintenance-organization-manage {
  width: 100%;
  height: 100%;
  display: flex;

  .box-card {
    height: 100%;
    overflow: auto;
  }

  .left-box {
    // flex: 0 0 23vw;
    margin: 0 5px 0 0;
    // width: 23vw;
    width: 320px;
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
  width: 250px;
}

.maintenance-organization-manage /deep/ .el-card__header {
  background-color: #F5F5F5;
  padding: 12px 20px;
}

.superior-department-content {
  margin-bottom: 30px;
}
</style>
