<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    fullscreen
    :before-close="dialogClose"
    center
    append-to-body
  >
    <div class="personal-homepage">
      <el-row :gutter="30">
        <el-col :span="24">
          <div class="show-flex-box-c show-flex-center" style="margin-bottom: 40px;">
            <span style="margin-bottom: 10px;">
              <el-avatar :size="100" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg" :fit="'cover'"></el-avatar>
            </span>
            <strong style="margin-bottom: 10px; margin-left:40px; font-size: 18px;">杨空余<span style="font-size: 12px; margin-left:5px;color: #8DC0FF">已离职</span></strong>
            <span>会计</span>
          </div>
          <div class="" style="margin: 20px 50px; padding: 20px 0px; background: #F5F5F5;">
            <el-row :gutter="30">
              <el-col :span="8" class="show-flex-box-r show-flex-center">
                <span style="height: 50px; line-height: 50px;">离职前状态：正式</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r show-flex-center">
                <span style="height: 50px; line-height: 50px;">离职日期：2021-07-07</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r show-flex-center">
                <span style="height: 50px; line-height: 50px;">离职原因：个人原因</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r show-flex-center">
                <span style="height: 50px; line-height: 50px;">备注: ************</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r show-flex-center">
                <span style="height: 50px; line-height: 50px;">工作交接人：正式</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r show-flex-center">
                <span style="height: 50px; line-height: 50px;">离职审批单：<el-button type="text" @click="checkLeaveApproveDetail()">查看详情</el-button> </span>
              </el-col>
              <el-col :span="24" class="show-flex-box-r show-flex-center" style="">
                <div style="width: 95%;  height: 32px; line-height: 50px; border-top: 1px #D7D7D7 solid; text-align: center">
                  <span>离职交接安全监测  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ></span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="show-flex-box-r" style="margin: 0px 50px ; padding: 20px 0px;align-items: center;">
            <h3 class="show-flex-box-r" style="flex-shrink:0; align-items: center;">
              <em style="width: 6px;height: 22px; background: #409EFF; margin-right:10px"></em>
              <strong style="font-size: 20px;">个人档案</strong>
            </h3>
            <em style="flex-grow: 1; height: 2px; background: #F5F5F5; margin:0 25px;"></em>
            <strong style="color:#409EFF;flex-shrink:0;" @click="checkPersonalArchivesDetail()">详情</strong>
          </div>
          <div class="" style="margin: 20px 50px;">
            <el-row :gutter="30">
              <el-col :span="8" class="show-flex-box-r show-flex-center">
                <span style="height: 50px; line-height: 50px;">进单位时间：2021-06-29</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r show-flex-center">
                <span style="height: 50px; line-height: 50px;">部门：公交集团</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r show-flex-center">
                <span style="height: 50px; line-height: 50px;">工号：00001111</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r show-flex-center">
                <span style="height: 50px; line-height: 50px;">出身日期：1975-06-08</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r show-flex-center">
                <span style="height: 50px; line-height: 50px;">性别：男</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r show-flex-center">
                <span style="height: 50px; line-height: 50px;">工种属性：码农</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r show-flex-center">
                <span style="height: 50px; line-height: 50px;">用工形式：外包</span>
              </el-col><el-col :span="8" class="show-flex-box-r show-flex-center">
                <span style="height: 50px; line-height: 50px;">状态：离职</span>
              </el-col>
            </el-row>
          </div>
        </el-col>
         <el-col :span="24">
          <div class="show-flex-box-r" style="margin: 0px 50px ; padding: 20px 0px;align-items: center;">
            <h3 class="show-flex-box-r" style="flex-shrink:0; align-items: center;">
              <em style="width: 6px;height: 22px; background: #FEE151; margin-right:10px"></em>
              <strong style="font-size: 20px;">工作点滴</strong>
            </h3>
            <em style="flex-grow: 1; height: 2px; background: #F5F5F5; margin:0 25px;"></em>
          </div>
          <div class="" style="margin: 20px 50px;">
            <el-row :gutter="30">
              <el-col :span="6" class="show-flex-box-r show-flex-center">
                <div class="show-flex-box-c show-flex-center" style="font-size: 16px;">
                  <span style="margin-bottom: 40px;">0</span>
                  <span>发起审批</span>
                </div>
              </el-col>
              <el-col :span="6" class="show-flex-box-r show-flex-center" style="font-size: 16px;">
                <div class="show-flex-box-c show-flex-center">
                  <span style="margin-bottom: 40px;" >0</span>
                  <span>签到</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      </el-row>
      <div class="dialog-box">
        <leave-approve-form-dialog
          ref="leaveApproveFormDialog"
          :dialogBool.sync="leaveApproveFormDialogShow"
        ></leave-approve-form-dialog>
        <add-staff-dialog
          ref="addStaffDialog"
          :dialogBool.sync="addStaffDialogShow"
          :showCollapse="showCollapse"
          :curChangeType="curChangeType"
          :appendToBody="appendToBody"
        >
        </add-staff-dialog>
      </div>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
// import subReq from "./leave-staff-component/sub-req";
import leaveApproveFormDialog from "./leave-approve-form-dialog";
import addStaffDialog from "../../../dialog/add-staff-dialog.vue"
export default {
  components: {
    leaveApproveFormDialog,
    addStaffDialog
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      showTitle: "个人主页",
      loading: false,
      leaveApproveFormDialogShow: false,
      addStaffDialogShow: false,
      showCollapse: "first",
      curChangeType: "detail",
      appendToBody: true
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.configCircuitfInfo();
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 初始化信息
    configCircuitfInfo() {
      
    },
    // 查看离职审批详情
    checkLeaveApproveDetail() {
      this.leaveApproveFormDialogShow = true
    },

    // 查看档案详情
    checkPersonalArchivesDetail() {
      this.addStaffDialogShow = true
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
