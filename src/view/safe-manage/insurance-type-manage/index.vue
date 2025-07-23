<template>
  <div class="insurance-type-manage-box" ref="insuranceTypeManageBox">
    <div class="insurance-type-manage">
      <el-card class="box-card left-box">
        <div
          slot="header"
          class="clearfix show-flex-box-r"
          style="height: 37px; flex-wrap: nowrap; align-items:center;">
          <span style="white-space:nowrap;">保险类型</span>
          <el-button 
            style="margin-left: 15px" 
            type="primary" size="mini"
            @click="openSetOrganizationInfoDialog()" 
            v-if="$isPowerShow('add')">添加</el-button>

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
          <insurance-type-tree
            ref="organizationTree"
            :loading="organizationLoading"
            :placeholder="placeholder"
            :organizationTreeList="organizationTreeList"
            :organizationTreeListLength="organizationTreeListLength"
            @on-tree="selectDepartment"
          ></insurance-type-tree>
        </div>
      </el-card>

      <el-card class="box-card center-box" ref="centerBox">
        <!-- <div style="margin: 5px 0" slot="header">
          <span>保险类型信息</span>
          <el-button 
          style="margin-left: 15px" 
          type="primary" size="mini"
          @click="editOrgInfo()" 
          v-if="$isPowerShow('save')"
            >保存</el-button>
        </div>
        <div class="department-detail show-flex-box-c" v-loading="detailLoading">
          <el-form
            size="mini"
            ref="formData"
            label-width="130px"
            :model="formData"
            :rules="rules">
            <el-form-item label="所属保险类型:"  prop="type" v-if="curSelectedDepartment.type == 4">
              <el-select v-model="formData.type" clearable placeholder="请选择所属维修车间" v-loading="departLoading">
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div> -->
      </el-card>

      <!-- <el-card class="box-card center-box show-flex-box-r show-flex-center" v-else>
        <el-empty description="现只支持保险类型、保险类型金额查看或修改"></el-empty>
      </el-card> -->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import insuranceTypeTree from "./component/insurance-type-tree";
export default {
  name: 'insurance-type-manage',
  components: {
    insuranceTypeTree
  },
  data() {
    return {
      treeBoxHeight:500,
      visible: false,
      placeholder: "请输入关键词",
      curSelectedDepartment:null,
      organizationDetailInfo: null,
      organizationLoading: false,
      organizationTreeList: [],
      organizationTreeListLength:0,
      detailLoading: false,
      formData: {
        type: '',
      },
      rules: {

      },
      typeList: []
    }
  },
  mounted() {
    this.setHead();
    this.loadOrganizationTree();
    this.loadMaintainDepart();
  },
  methods: {
    // 计算高度
    setHead() {
      setTimeout(() => {
        this.treeBoxHeight = this.$refs.insuranceTypeManageBox.offsetHeight - 120;
      }, 60);
    },
    // 获取组织tree信息
    loadOrganizationTree() {
      this.organizationLoading = true;
      this.$client.getMaintainTree()
      .then(res => {
        if (res.head.result == "200") {
          this.organizationTreeList = res.context;
          this.organizationTreeListLength = this.organizationTreeList.length; 
          this.organizationLoading = false;
          if( this.organizationTreeList.length == 0) {
              this.isFirstOrganization = true;
            }
          if(this.curSelectedDepartment && !this.organizationLoading) {
              // 重新定位到目前组织树中
              this.locationCurNode();
            }
          } else {
            this.organizationLoading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {

      })
    },
    // 重新定位到目前组织树中
    locationCurNode() {
      let ids= [];
      ids.push(this.curSelectedDepartment.i_id);
      this.$refs.organizationTree.setSelectedCheckedKeys(ids);
    },
    // 获取保险类型
    loadMaintainDepart() {
      this.departLoading = true;
      this.$client.getMaintainDepart()
      .then(res => {
        if(res.head.result == "200") {
          this.workshopDataOptions = this.buildDeptList(res.context);
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
    // 构建保险类型
    buildDeptList(arrayList) {
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
    // 选择某一组织
    selectDepartment(departmentInfo) {
      if(departmentInfo.type == 1 && !departmentInfo.can_edit) {
        this.curSelectedDepartment = null;
        this.$message({
          showClose: true,
          message: '请选择保险类型或保险金额类型',
          type: "warning",
        });
        return
      }
      this.curSelectedDepartment = departmentInfo;
      // this.reqOrganizationDetail(true) // 获取部门组织详情
      this.$nextTick(() => {
        // this.$refs.formData.clearValidate();
      });
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.insurance-type-manage-box
  height: 100%
  width: 100%
  .insurance-type-manage
    width: 100%
    height: 100%
    display: flex
    .box-card
      height: 100%
      overflow: auto
    .left-box
      margin: 0 5px 0 0
      width: 320px
      height: 100%
    .center-box
      flex: 1
      height: 100%
</style>