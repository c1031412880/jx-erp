<template>
  <div class="maintenance-organization-manage-box">
    <div class="maintenance-organization-manage">
      <el-card class="box-card left-box">
        <div
          slot="header"
          class="clearfix show-flex-box-r"
          style="height: 37px; flex-wrap: nowrap; align-items: center"
        >
          <span style="white-space: nowrap">仓库组织</span>
          <el-button
            style="margin-left: 15px"
            type="primary"
            size="mini"
            @click="openSetOrganizationInfoDialog()"
            >添加</el-button
          >
          <div
            v-if="
              curSelectedDepartment &&
              organizationTreeList.is_house != 0
            "
          >
            <el-popover
              placement="bottom"
              title="操作确认"
              width="400"
              v-model="visible"
            >
              <div class="show-flex-box-r" style="">
                <span
                  style="margin-right: 10px; color: #ff9900"
                  class="show-flex-box-r"
                >
                  <i class="el-icon-question" style="font-size: 25px"></i>
                </span>
                <div
                  class="show-flex-box-c"
                  v-if="curSelectedDepartment && organizationDetailInfo"
                >
                  <p
                    style="font-size: 18px; margin-bottom: 5px"
                    v-if="curSelectedDepartment.type == 4"
                  >
                    该维修车间下共关联了{{
                      curSelectedDepartment.children.length
                    }}个维修班组，{{
                      organizationDetailInfo.emps.length
                    }}个人员。是否确定删除？ 确定后
                    删除车间、班组信息，解除关联人员关系
                  </p>
                  <p
                    style="font-size: 18px; margin-bottom: 5px"
                    v-if="curSelectedDepartment.type == 5"
                  >
                    该维修小组下共关联{{
                      organizationDetailInfo.emps.length
                    }}个人员。是否确定删除？ 确定后
                    删除班组信息，解除关联人员关系
                  </p>
                  <span style="color: #f56c6c">是否确定删除？</span>
                </div>
              </div>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="visible = false"
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="suerDeleteDepartmentInfo()"
                  >确定</el-button
                >
              </div>
              <el-button
                slot="reference"
                type="danger"
                size="mini"
                style="margin-left: 10px"

                >删除</el-button
              >
            </el-popover>
          </div>
        </div>
        <maintenance-organization-tree
          ref="organizationTree"
          :loading="organizationloading"
          :placeholder="placeholder"
          :organizationTreeList="organizationTreeList"
          :organizationTreeListLength="organizationTreeListLength"
          @on-tree="selectDepartment"
        ></maintenance-organization-tree>
      </el-card>
      <el-card
        class="box-card center-box"
        ref="centerBox"
        v-if="!!curSelectedDepartment"
      >
        <div style="margin: 5px 0" slot="header">
          <span>仓库详情</span>
          <!-- <el-button style="margin-left: 15px" type="primary" size="mini"
          @click="editOrgInfo()" v-if="$isPowerShow('save')"
            >保存</el-button> -->
          <el-button
            style="margin-left: 15px"
            type="primary"
            size="mini"
            @click="editOrgInfo('formData')"
            >保存</el-button
          >
          <el-button
            style="margin-left: 15px"
            type="primary"
            size="mini"
            @click="initialize()"
            >仓库初始化</el-button
          >
        </div>
        <div
          class="department-detail show-flex-box-c"
          v-loading="detailLoading"
        >
          <el-form
            size="mini"
            ref="formData"
            label-width="130px"
            :model="formData"
            :rules="rules"
          >
            <div class="show-flex-box-r">
               <el-form-item label=" 仓库名称:" prop="name">
              <el-input
                v-model="formData.name"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="仓库编号:"
    
              style="height: 25px"
            >
            <el-input
                v-model="formData.code"
            ></el-input>
            </el-form-item>
            </div>
             <div class="show-flex-box-r">
             <el-form-item
              label="所属维修单元:"
              prop="deptment_id"
              style="height: 25px"
            >
              <get-store-select
                ref="baseTree"
                :isContainEmp="isContainEmp"
                :isShowCheckbox="false"
                :funcType="funcType"
                :placeholder="'选择维修单元'"
                v-model="formData.deptment_id"
                :isExportMultiple="false"
                @on-change="onSelectChange"
              ></get-store-select>
            </el-form-item>
              <el-form-item label="仓库分类:">
                <get-select-dictionaries v-model="formData.type" :classKey="'仓库分类'" :placeholder="'请选择'" ></get-select-dictionaries>
              </el-form-item>
            </div>
             <div class="show-flex-box-r">
              <el-form-item label="启用状态:" prop="">
                <el-switch
                  v-model="formData.usable"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="1"
                  inactive-value="2"
                  style="margin-right:215px;"
                  >
                </el-switch>
              </el-form-item>
              <el-form-item label="初始化状态:" >
                <p v-if="formData.init==1" style="margin:0px;display:inline-block;" >已初始化</p>
                <p v-else style="margin:0px;display:inline-block;" >未初始化</p>
                 <!-- <el-button
            style="margin:0px;display:inline-block;" 
            type="primary"
            size="mini"
            @click="dialoginitialize = true"
            >仓库初始化</el-button 
          >-->
              </el-form-item>
            </div>
             <div class="show-flex-box-r">
              <el-form-item label="安全预警:" prop="">
                 <el-switch
            v-model="formData.warn"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="2"
            style="margin-right:215px;"
            >
          </el-switch>
              </el-form-item>
          <el-form-item
            label="初始化日期:"
            prop="initializedate"
            style="height: 25px"
            
          >
          <el-date-picker v-model="formData.init_date" format="yyyy-MM-dd  HH:mm:ss"
          :style="{width: '100%'}" placeholder="请选择日期" clearable ></el-date-picker>
          </el-form-item>
            </div>
             <div class="show-flex-box-r">
              <el-form-item label="是否默认:" prop="">
                 <el-switch
                    v-model="formData.is_default"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    :active-value="1"
                    :inactive-value="2"
                    style="margin-right:215px;"
                    >
                  </el-switch>
              </el-form-item>
            </div>
            <el-form-item>
              <span
                slot="label"
                style="
                  font-weight: 400;
                  font-style: normal;
                  font-size: 14px;
                  color: #606266;
                  font-weight: 700;
                "
                >关联人员:</span
              >
              <el-button
                style="margin-left: 15px"
                type="primary"
                size="mini"
                @click="openAddRelevanceUserPop()"
                >添加</el-button
              >
              <el-button
                style="margin-left: 15px"
                type="primary"
                size="mini"
                @click="deleteSelectedUserInfo()"
                >移除</el-button
              >
            </el-form-item>
            <div style="margin: 0px 80px">
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
                <template slot-scope="scope" slot="name">
                 <p v-if="scope.data.is_operater==2">{{scope.data.name}}</p>
                 <p v-else>{{scope.data.name}}<el-button type="warning" size="mini" style="margin-left:10px" round>管理员</el-button></p>
                </template>
                <template slot-scope="scope" slot="operation">
                  <el-popconfirm
                  v-if="scope.data.is_operater==2"
                    @confirm="setmanageer(scope.data)"
                    title="确定设置仓理员吗？"
                  >
                    <el-button
                      slot="reference"
                      type="text"
                      size="mini"
                      style="margin-left: 10px"
                      >设置仓理员</el-button
                    >
                  </el-popconfirm>
                   <el-popconfirm
                   v-else
                    @confirm="setmanageer(scope.data)"
                    title="确定设置仓理员吗？"
                  >
                    <el-button
                      slot="reference"
                      type="text"
                      size="mini"
                      style="margin-left: 10px"
                      >取消仓理员</el-button
                    >
                  </el-popconfirm>
                  <el-popconfirm
                    @confirm="deleteRowInfo(scope.data)"
                    title="确定移除该人员吗？"
                  >
                    <el-button
                      slot="reference"
                      type="text"
                      size="mini"
                      style="margin-left: 10px"
                      >移除</el-button
                    >
                  </el-popconfirm>
                </template>
              </tr-table>
            </div>
          </el-form>
        </div>
      </el-card>
      <el-card
        class="box-card center-box show-flex-box-r show-flex-center"
        v-else
      >
        <el-empty
          description="现只支持维修车间、维修小组信息查看或修改"
        ></el-empty>
      </el-card>
    </div>
    <el-dialog
      title="初始化日期"
      :visible.sync="dialoginitialize"
      width="30%"
      >
      <el-form size="mini" label-width="130px">
        <el-form-item label=" 初始化日期:" prop="name">
            <el-select v-model="formData.init" placeholder="请选择" clearable :style="{width: '100%'}" >
              <el-option v-for="(item, index) in initializelist"             
                :key="index"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialoginitialize = false">取 消</el-button>
      <el-button type="primary" @click="dialoginitialize = false">确 定</el-button>
      </span>
    </el-dialog>
    <div class="organization-chart-dialog">
      <set-organization-info
        ref="setOrganizationInfo"
        :dialogBool.sync="isShowSetOrganizationInfoDialog"
        :workshopDataOptions="workshopDataOptions"
        :departLoading="departLoading"
        @save-add-edit-organization="saveAddEditOrganizationInfo"
      ></set-organization-info>
    <!-- 
      <add-relevance-user
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
import jurisdiction from "@/view/401";
import getStoreSelect from 'components/base/formModel/tree/get-store-select'
import maintenanceOrganizationTree from "./component/maintenance-organization-tree";
import setOrganizationInfo from "./component/set-organization-info-dialog";
// import addRelevanceUser from "./component/add-relevance-user-dialog";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import addCorrelationUser from "@/view/system-user/role-management/component/dialog-component/add-correlation-user";
export default {
  name: "store-management",
  data() {
    return {
      init_date1:'',
      dater:new Date(),
      visible: false,
      userLoading: false,
      placeholder: "请输入关键词",
      organizationloading: false,
      detailLoading: false,
      dialoginitialize:false,
      initializelist:[
        { value: '1', name: "立即初始化" },
        { value: '0', name: "选择初始化日期" },
        { value: '2', name: "不初始化" },
      ],
      organizationTreeList: [],
      organizationTreeListLength: 0,
      departmentUserList: [],
      curType: "add",
      isShowSetOrganizationInfoDialog: false,
      isFirstOrganization: false,
      curSelectedDepartment: null,
      selectedUserIds: [], //选中需要调整的人员IDs
      organizationDetailInfo: null,
      isContainEmp: false,
      funcType: 2, // 功能类别 1 运营单元 2 维修单元 3 仓储单元
      workshopDataOptions: [], //车间列表
      deptment_id: "", //维修单元所属组织ID
      formData: {
        name: "",
        code:'',
        type:'',
        warn:'',
        deptment_id: [],
        propety: 0,
        init_date:'',
        init:'',
        id:'',
        is_default: 0
      },
      result:'',
      rules: {
        deptment_id: [
          {
            required: true,
            message: "请选择所属维修单元",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入组织名称",
            trigger: "blur",
          },
        ],
        propety: [
          {
            required: true,
            message: "请选择组织属性",
            trigger: "blur",
          },
        ],
        init_date: [
          {
            required: true,
            message: " ",
            trigger: "blur",
          },
        ],
      },
      showprice:'3',
      data: [], //人员列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "姓名",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "工号",
          prop: "work_id",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "岗位",
          prop: "positon",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "操作",
          prop: "operation",
          width: "180",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
      ],
      loading: false,
      TableHeight: 400,
      isShowAddRelevanceUserDialog: false,
      isShowCorrelationUserDialog: false,
      departmentUserloading: false,
      userList: [], //用户列表
      departLoading: false,
      workshopId: "",
      deleteUserIds: [], //要移除的用户
    };
  },
  components: {
    getStoreSelect,
    jurisdiction,
    maintenanceOrganizationTree,
    setOrganizationInfo,
    // addRelevanceUser,
    getDepartmentSelect,
    getSelectDictionaries,
    addCorrelationUser
  },
  mounted() {
    this.showprice = JSON.parse(localStorage.getItem('showprice'));
    // this.setHead();
    this.loadOrganizationTree();
    this.loadMaintainDepart();
  },
  methods: {
    // 计算高度
    setHead() {
      setTimeout(() => {
        // let h = this.$refs.centerBox.$el.offsetHeight;
        // this.TabelHeight = h - 163;
      }, 60);
    },
    // 获取维修车间
    loadMaintainDepart() {
      this.departLoading = true;
      this.$client.getMaintainDepart().then((res) => {
        if (res.head.result == "200") {
          this.workshopDataOptions = this.bulidDepatList(res.context);
          this.departLoading = false;
        } else {
          this.departLoading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      });
    },
    // 构建维修车间
    bulidDepatList(arrayList) {
      let list = [];
      arrayList.forEach((item) => {
        let obj = {
          id: item.node_id,
          name: item.node_name,
        };
        list.push(obj);
      });

      return list;
    },
    // 获取组织tree信息
    loadOrganizationTree() {
      this.organizationloading = true;
      this.$client
        .getDeptTreeWarehouse()
        .then((res) => {
          // console.log(JSON.stringify(res))
          if (res.head.result == "200") {
            this.organizationTreeList = res.context;
            this.organizationTreeListLength = this.organizationTreeList.length;
            this.organizationloading = false;
            if (this.organizationTreeList.length == 0) {
              this.isFirstOrganization = true;
            }
            if (this.curSelectedDepartment && !this.organizationloading) {
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
        })
        .catch((err) => {});
    },
    // 选择某一组织
    selectDepartment(departmentInfo) {
      if (departmentInfo.is_house ==0) {
        this.curSelectedDepartment = null;
        this.$message({
          showClose: true,
          message: "请选择仓库",
          type: "warning",
        });
        return;
      }
      this.curSelectedDepartment = departmentInfo;
      this.reqOrganizationDetail(true); // 获取部门组织详情
    },
    // 获取车间、小组详情
    // isCurDepartment //是否是当期组织还是上级组织
    reqOrganizationDetail(isCurDepartment) {
      this.detailLoading = true;
      let params = {
        id: isCurDepartment
          ? this.curSelectedDepartment.node_id
          : this.curSelectedDepartment.belong_id,
        type: isCurDepartment
          ? this.curSelectedDepartment.type
          : this.curSelectedDepartment.belong_type,
      };

      this.$client
        .getRecordWarehouse(params)
        .then((res) => {
          if (res.head.result == "200") {
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
        })
        .catch((err) => {
          this.detailLoading = false;
        });
    },
    // 构建表单回显
    bulidForm() {
      this.formData.deptment_id =''
      if (!!this.organizationDetailInfo) {
        this.formData.name =this.organizationDetailInfo.name
        this.formData.code =this.organizationDetailInfo.code
        this.formData.warn =this.organizationDetailInfo.warn.toString()
        this.formData.is_default =this.organizationDetailInfo.is_default
        setTimeout(() => {
          this.formData.deptment_id =this.organizationDetailInfo.deptment_id
        }, 60);
        if(this.organizationDetailInfo.type==null||this.organizationDetailInfo.type==''){
          this.formData.type = ''
        }else{this.formData.type =this.organizationDetailInfo.type}
        this.formData.usable =this.organizationDetailInfo.usable.toString()
        this.formData.id =this.organizationDetailInfo.id
        if(this.organizationDetailInfo.init==null){
          this.formData.init = '2'
        }else{
          this.formData.init =this.organizationDetailInfo.init.toString()
        }
        this.init_date1=this.organizationDetailInfo.init_date
        this.formData.init_date=this.organizationDetailInfo.init_date
        if(this.organizationDetailInfo.persons){
          this.data =this.organizationDetailInfo.persons
        }
        
      }
    },
    // 打开设置组织弹窗
    openSetOrganizationInfoDialog() {
      this.curType = "add";
      this.isShowSetOrganizationInfoDialog = true;
    },
    // 编辑
    editOrgInfo(formName) {
      this.curType = "edit";
      
         this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveAddEditOrganizationInfo(this.formData);
          } else {
            // console.log('error submit!!');
            return false;
          }
        });

    },
     // 初始化
    initialize() {
      this.$client
      .setInitWarehouse({id:this.curSelectedDepartment.node_id})
      .then((res) => {
        if (res.head.result == "200") {
          this.loadOrganizationTree();
          this.loadMaintainDepart();
          this.$message({
            showClose: true,
            message: "操作成功",
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
    // 添加、编辑保存组织
    saveAddEditOrganizationInfo(form) {
      let successrMessage = "";
      if (this.curType == "add") {
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
        if (this.organizationDetailInfo.type == 5) {
          form.deptment_id = [];
          form.deptment_id.push({ node_id: this.workshopId });
        }
      }
      let params = {
        context: form,
      };
      this.$client
        .setRecordWarehouse(params)
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
        context:this.curSelectedDepartment.node_id
      };
      this.$client
        .deleteRecordWarehouse(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.curSelectedDepartment = null;
            // 排序成功重新加载组织树和维修车间
            this.loadOrganizationTree();
            this.loadMaintainDepart();
            // 重新定位到目前上一级组织树中
            this.locationParentNode();
            this.visible = false;
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
            });
            // setTimeout(() => {
            //   this.curSelectedDepartment = null;
            // }, 300);
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
      let ids = [];
      ids.push(this.curSelectedDepartment.node_id);
      this.$refs.organizationTree.setSelecedCheckedKeys(ids);
    },
    //重新定位到目前上一级组织树中
    locationParentNode() {
      let ids = [];
      ids.push(this.curSelectedDepartment.belong_id);
      this.$refs.organizationTree.setSelecedCheckedKeys(ids);
    },
    // 分公司选择
    onSelectChange(vehs, nodes) {
      // this.formData.deptment_id = [];
      // if (nodes && nodes.length > 0) {
      //   nodes.forEach((item, index) => {
      //     delete item.children;
      //   });
      //   this.formData.deptment_id = nodes;
      // } else {
      //   this.formData.deptment_id = [];
      // }
    },
    // 添加用户弹窗
    openAddRelevanceUserPop() {
      this.isShowCorrelationUserDialog = true;
    },
    // 确定关联用户角色信息
    saveSelecedRoleUser(selectedUserIds) {
      let params = {
        context: {
          house_id: this.curSelectedDepartment.node_id,
          user_ids: selectedUserIds,
        },
      };
      this.$client
        .addPersonWarehouse(params)
        .then((res) => {
          if (res.head.result == "200") {
            // 重新获取角色人员列表
            this.reqOrganizationDetail(true);

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
        .catch((err) => {});
    },
    // 选中表格勾选框
    selectedUserList(userList) {
      this.deleteUserIds = [];
      userList.forEach((item, index) => {
        this.deleteUserIds.push(item.id);
      });
      console.log(JSON.stringify(this.deleteUserIds));
    },
    // 确定批量移除勾选用户
    deleteSelectedUserInfo() {
      if (this.deleteUserIds.length == 0) {
        this.$message({
          showClose: true,
          message: "请勾选至少一条要移除的人员",
          type: "warning",
        });
        return;
      }
      this.deleteRowInfo(null);
    },
    setmanageer(info){
      if(info.is_operater==2){  
        this.result =1
      }else{
         this.result =2
      }
      let params = {
        house_id: this.curSelectedDepartment.node_id,
        user_id: info.id,
        result:this.result
      };
        this.$client
        .setOperatorWarehouse(params)
        .then((res) => {
          if (res.head.result == "200") {
            // 重新获取角色人员列表
            this.reqOrganizationDetail(true);
            this.$message({
              showClose: true,
              message: "操作成功",
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
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 移除人员
    deleteRowInfo(info) {
      let params = {
        context: {
          house_id: this.curSelectedDepartment.node_id,
          user_id: this.deleteUserIds,
        },
      };
      if (!!info) {
        params.context.user_ids = [info.id];
      }else{
        params.context.user_ids=this.deleteUserIds
      }
      this.$client
        .deletePersonWarehouse(params)
        .then((res) => {
          if (res.head.result == "200") {
            // 重新获取角色人员列表
            this.reqOrganizationDetail(true);
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
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.maintenance-organization-manage-box {
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
