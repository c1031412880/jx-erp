<template>
  <div class="charge-station-manage-box">
    <div class="charge-station-manage">
      <el-card class="box-card left-box">
        <div
          slot="header"
          class="clearfix show-flex-box-r"
          style="height: 37px; flex-wrap: nowrap; align-items:center;"
        >
          <span style="white-space:nowrap;">充电站管理</span>
        </div>
        <div class="show-flex-box-c">
          <div class="show-flex-box-r" style="margin-bottom:15px;flex-wrap: nowrap;" v-if="!!curSelectedDepartment">
            <el-button type="primary" size="mini" @click="openSetOrganizationInfoDialog('add')" v-if="$isPowerShow('save')">添加充电站</el-button>
            <el-button style="margin-left: 15px" type="primary" size="mini" :disabled="!!curSelectedDepartment.type" @click="openSetChargeEquDialog('add')" v-if="$isPowerShow('save')">添加充电桩</el-button>
            <div class="show-flex-box-c">

             <el-button type="danger" size="mini" style="margin-left: 10px;" v-if="$isPowerShow('del')" @click="visible = true">删除</el-button>
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
                  <p style="font-size: 18px; margin-bottom: 5px;" v-if="!curSelectedDepartment.type">当前充电站下有{{(!!curSelectedDepartment.children && curSelectedDepartment.children.length) || 0}}个充电桩。确认全部删除吗</p>
                  <p style="font-size: 18px; margin-bottom: 5px;" v-else>确认删除当前充电桩吗</p>
                  <span style="color:#F56C6C">是否确定删除？</span>
                </div>
              </div>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="suerDeleteChargeStation()">确定</el-button>
              </div>
              <!-- <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;" v-if="$isPowerShow('del')" @click="visible = true">删除</el-button> -->
            </el-popover>
            </div>
          </div>
          <charge-station-tree
            ref="organizationTree"
            :loading="organizationloading"
            :placeholder="placeholder"
            :organizationTreeList="organizationTreeList"
            :organizationTreeListLength="organizationTreeListLength"
            @on-tree="selectDepartment"
            @refresh-tree="refreshTreeList"
          ></charge-station-tree>
        </div>
      </el-card>
      <el-card class="box-card center-box" ref="centerBox" v-if="!!curSelectedDepartment">
        <div style="margin: 10px 0" slot="header">
          <span>基础信息</span>
        </div>
        <div class="department-detail show-flex-box-c">
          <div class="edit-charge-content" v-if="!!curSelectedDepartment.type">
            <edit-charge
              ref="editCharge"
              :competentUserOptions="classifyOptions"
              @save-add-edit-charge="saveAddEditProject"
             ></edit-charge>
          </div>
          <div v-else>
            <edit-charge-station
              ref="editChargeStation"
              @save-add-edit-organization="saveAddEditOrgClassifyInfo"
             ></edit-charge-station>
          </div>
        </div>
      </el-card>
      <el-card class="box-card center-box show-flex-box-r show-flex-center" v-else>
        <el-empty description="暂无充电站信息"></el-empty>
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
        ref="setChargeInfo"
        :dialogBool.sync="isShowSetInfoDialog"
        :curSelecedType="curSelecedType"
        :competentUserOptions="classifyOptions"
        @save-add-edit-charge="saveAddEditProject"
      ></set-info-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import chargeStationTree from "./component/charge-station-tree";
import setInfoDialog from "./component/set-info-dialog"
import addClassifyDialog from "./component/add-classify-dialog"
import editCharge from "./component/edit-charge"
import editChargeStation from "./component/edit-charge-station"

export default {
  name: "charge-station-manage",
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
      curType: 'add', //添加充电站
      curSelecedType: 'add', //添加充电桩
      isShowSetInfoDialog: false,
      // isFirstOrganization: false,
      curSelectedDepartment:null, //当前选中的维修组织树节点
      isShowAddClassifyDialog: false, // 添加项目分类弹窗
      loading: false,
      selectedProjectIds:[], //勾选中要删除的维修项目ID
    };
  },
  components: {
    chargeStationTree,
    addClassifyDialog,
    setInfoDialog,
    editCharge,
    editChargeStation
  },
  mounted() {
    this.loadOrganizationTree();
    this.reqStationDropList();
  },
  methods: {
    // 获取充电站列表
    reqStationDropList() {
      this.$client.getStationDropList().then(res => {
        if(res.head.result  == '200') {
          this.classifyOptions = res.context
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 刷新充电站
    refreshTreeList() {
      this.organizationloading = true;
      this.loadOrganizationTree();
      // 重新定位到目前组织树中
      this.locationCurNode();
      setTimeout(() => {
        this.$message({
          showClose: true,
          message: '刷新成功',
          type: "success",
        });
      }, 600);
    },
    // 获取组织tree信息
    loadOrganizationTree() {
      this.organizationloading = true;
      this.$client.getChargeStationTreeDataBase()
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
    // 选择某一组织
    selectDepartment(departmentInfo) {
      this.visible = false;
      this.curSelectedDepartment = departmentInfo;
      if(!!this.curSelectedDepartment.type) {
        this.curSelecedType = 'edit';
        this.reqPileChargeStation()
      }else{
        this.curType = 'edit';
        this.reqStationChargeStation()
      }
    },
    // 获取充电桩信息
    reqPileChargeStation() {
      let params = {
        id: this.curSelectedDepartment.id
      }
      this.$client.getPileChargeStation(params).then(res => {
        if (res.head.result == "200") {
          this.$refs.editCharge.setFormData(res.context)
        }else{
          this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
        }
      })
    },
    // 获取充电站信息
    reqStationChargeStation() {
      let params = {
        id: this.curSelectedDepartment.id
      }
      this.$client.getStationChargeStation(params).then(res => {
        if (res.head.result == "200") {
          // console.log(res)
          this.$refs.editChargeStation.setFormData(res.context)
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 添加充电桩
    saveAddEditProject(form) {
      let successrMessage = '';
      if (this.curSelecedType == "add") {
        successrMessage = "添加成功";
      } else {
        // form.id = this.curSelectedDepartment.id
        successrMessage = "编辑成功";
      }
      let params = {
        context: form
      }
      this.$client
        .addPileChargeStation(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadOrganizationTree();
            if(!!this.curSelectedDepartment.type) {
              if(form.id != this.curSelectedDepartment.id ) {
                this.curSelectedDepartment.id = form.id;
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
    // 打开充电站管理弹窗
    openSetOrganizationInfoDialog(type) {
      this.curType = type;
      this.isShowAddClassifyDialog = true;
    },
    // 添加、编辑保存充电站信息
    saveAddEditOrgClassifyInfo(form) {
      let successrMessage = '';
      if (this.curType == "add") {
        successrMessage = "添加成功";
      } else {
        // form.id = this.curSelectedDepartment.id
        successrMessage = "编辑成功";
      }
      let params = {
        context: form
      }
      this.$client
        .addStationChargeStation(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadOrganizationTree();
            this.reqStationDropList()
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
    // 打开添加设置充电桩
    openSetChargeEquDialog(type) {
      this.curSelecedType = type;
      this.$refs.setChargeInfo.ruleForm.station_id = this.curSelectedDepartment.id
      this.isShowSetInfoDialog = true;
    },
    // 删除充电桩 充电站
    suerDeleteChargeStation() {
      let params = {
        id : this.curSelectedDepartment.id,
        type: this.curSelectedDepartment.type,
      }
      this.$client
        .deleteChargeStation(params)
        .then((res) => {
          if (res.head.result == "200") {
            // 排序成功重新加载组织树
            this.loadOrganizationTree();
            if(!!this.curSelectedDepartment.type) {
              // 重新定位到目前上一级组织树中
              this.locationParentNode()
            }else{
              if(this.organizationTreeList.length > 0) {
                this.curSelectedDepartment = this.organizationTreeList[0];
                this.locationCurNode();
              }
            }
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
      ids.push(this.curSelectedDepartment.pid);
      this.$refs.organizationTree.setSelecedCheckedKeys(ids);
    },
   
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.charge-station-manage-box{
  width: 100%;
  height: 100%;
}
.charge-station-manage {
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
    width: 330px;
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

.charge-station-manage /deep/ .el-card__header {
  background-color: #F5F5F5;
  padding: 12px 20px;
}

.superior-department-content {
  margin-bottom: 30px;
}
</style>
