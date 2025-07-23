<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    fullscreen
    :before-close="dialogClose"
    center
    append-to-body
  >
    <tr-page-header ref="trPageHeader" slot="title" :content="showTitle" @back="dialogClose"></tr-page-header>
    <div class="personal-homepage">
      <el-row :gutter="30">
        <el-col :span="24">
          <div class="show-flex-box-c show-flex-center" style="margin-bottom: 40px;">
            <span style="margin-bottom: 10px;">
              <!-- <el-avatar :size="100" :src="personalInfo.c_photo" :fit="'cover'"></el-avatar> -->
              <el-image
                style="width: 100px; height: 100px; border-radius: 50%"
                :src="personalInfo.c_photo"
                :preview-src-list="[personalInfo.c_photo]"
                fit="fit"></el-image>
            </span>
            <strong style="margin-bottom: 10px; margin-left:40px; font-size: 18px;">{{personalInfo.c_name}}<el-tag :type="`${homePageType == 'quitted'? 'danger':'info'}`" size="mini" style="margin-left:5px">{{homePageType == 'quitted'? '待离职': personalInfo.emp_state}}</el-tag></strong>
            <span style="margin-bottom: 5px;" v-if="homePageType == 'quitted'">{{personalInfo.department_name}} <el-tag type="" size="mini" style="margin-left:5px">主部门</el-tag></span>
            <span style="margin-bottom: 5px;">{{personalInfo.position_name}}</span>
            <span style="font-size: 12px; color: #909399" v-if="homePageType == 'quitted'">在{{personalInfo.company_name? personalInfo.company_name: personalInfo.company_name }}工作了{{personalInfo.work_day}}天</span>
          </div>
          <div class="" style="margin: 20px 50px; padding: 20px 0px; background: #F5F5F5;">
            <el-row :gutter="30">
              <!-- <el-col :span="8" class="show-flex-box-r show-flex-center">
                <span style="height: 50px; line-height: 50px;">离职前状态：{{personalInfo.c_job_type}}</span>
              </el-col> -->
              <el-col :span="8" class="show-flex-box-r show-flex-center">
                <span style="height: 50px; line-height: 50px;">离职日期：{{personalInfo.d_dimission_date}}</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r show-flex-center">
                <span style="height: 50px; line-height: 50px;">离职原因：{{personalInfo.c_dimission_reason}}</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r show-flex-center">
                <span style="height: 50px; line-height: 50px;">离职备注: {{personalInfo.c_dimission_remark}}</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r show-flex-center">
                <span style="height: 50px; line-height: 50px;">工作交接人：{{personalInfo.ex_handover_name}}</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r show-flex-center" v-if="!personalInfo.source">
                <span style="height: 50px; line-height: 50px;">离职审批单：<el-button type="text" @click="checkLeaveApproveDetail(personalInfo.leave_id)">查看详情</el-button> </span>
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
          <div class="" style="margin: 20px 80px; 20px; 50px;">
            <el-row :gutter="30">
              <el-col :span="8" class="show-flex-box-r">
                <span style="height: 50px; line-height: 50px;">进单位时间：{{personalInfo.d_join_company}}</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r">
                <span style="height: 50px; line-height: 50px;">主部门：{{personalInfo.department_main_name}}</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r">
                <span style="height: 50px; line-height: 50px;">工号：{{personalInfo.c_worker_id}}</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r">
                <span style="height: 50px; line-height: 50px;">出生日期：{{personalInfo.d_birthday}}</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r">
                <span style="height: 50px; line-height: 50px;">性别：{{personalInfo.c_gender}}</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r">
                <span style="height: 50px; line-height: 50px;">工种属性：{{personalInfo.c_work_kind}}</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r">
                <span style="height: 50px; line-height: 50px;">用工形式：{{personalInfo.c_employee_type}}</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r">
                <span style="height: 50px; line-height: 50px;">状态：{{personalInfo.emp_state}}</span>
              </el-col>
              <el-col :span="8" class="show-flex-box-r">
                <span style="height: 50px; line-height: 50px;">离职原因：{{personalInfo.c_dimission_reason}}</span>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="show-flex-box-r" style="margin: 0px 50px ; padding: 20px 0px;align-items: center;">
            <h3 class="show-flex-box-r" style="flex-shrink:0; align-items: center;">
              <em style="width: 6px;height: 22px; background: #FEE151; margin-right:10px"></em>
              <strong style="font-size: 20px;">成长记录</strong>
            </h3>
            <em style="flex-grow: 1; height: 2px; background: #F5F5F5; margin:0 25px;"></em>
          </div>
          <div class="" style="margin: 20px 50px;height: 260px;overflow-y: scroll; ">
            <div v-if="!!personalInfo.emp_lifes && personalInfo.emp_lifes.length > 0">
              <el-timeline>
                <el-timeline-item
                  :timestamp="item.date"
                  placement="top" v-for="(item,index) in personalInfo.emp_lifes"
                  :key="index"
                  :icon="'el-icon-timer'"
                  :color="'#6CB4FF'"
                  >
                  <el-card>
                    <!-- <h4 style="margin-bottom: 10px;">离职和交接申请</h4> -->
                    <p>{{item.content}}</p>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
            <div v-else>
              <el-empty description="暂无该员工成长记录"></el-empty>
            </div>
            

          </div>
        </el-col>
        <el-col :span="24" v-if="homePageType == 'quitted'">
          <div class="show-flex-box-r" style="margin: 0px 50px ; padding: 20px 0px;align-items: center;">
            <h3 class="show-flex-box-r" style="flex-shrink:0; align-items: center;">
              <em style="width: 6px;height: 22px; background: #FF943E; margin-right:10px"></em>
              <strong style="font-size: 20px;">考勤统计</strong>
            </h3>
            <em style="flex-grow: 1; height: 2px; background: #F5F5F5; margin:0 25px;"></em>
          </div>
          <div class="" style="margin: 20px 50px;">
            <el-row :gutter="30">
              <el-col :span="4" class="show-flex-box-r show-flex-center">
                <div class="show-flex-box-c show-flex-center" style="font-size: 16px;">
                  <span style="margin-bottom: 40px;">0</span>
                  <span>实际出勤天数</span>
                </div>
              </el-col>
              <el-col :span="4" class="show-flex-box-r show-flex-center" style="font-size: 16px;">
                <div class="show-flex-box-c show-flex-center">
                  <span style="margin-bottom: 40px;" >0</span>
                  <span>请假天数/小时</span>
                </div>
              </el-col>
              <el-col :span="4" class="show-flex-box-r show-flex-center" style="font-size: 16px;">
                <div class="show-flex-box-c show-flex-center">
                  <span style="margin-bottom: 40px;" >0</span>
                  <span>请假天数/小时</span>
                </div>
              </el-col>
              <el-col :span="4" class="show-flex-box-r show-flex-center" style="font-size: 16px;">
                <div class="show-flex-box-c show-flex-center">
                  <span style="margin-bottom: 40px;" >0</span>
                  <span>请假天数/小时</span>
                </div>
              </el-col>
              <el-col :span="4" class="show-flex-box-r show-flex-center" style="font-size: 16px;">
                <div class="show-flex-box-c show-flex-center">
                  <span style="margin-bottom: 40px;" >0</span>
                  <span>请假天数/小时</span>
                </div>
              </el-col>
              <el-col :span="4" class="show-flex-box-r show-flex-center" style="font-size: 16px;">
                <div class="show-flex-box-c show-flex-center">
                  <span style="margin-bottom: 40px;" >0</span>
                  <span>请假天数/小时</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="24" v-if="homePageType == 'quitted'">
          <div class="show-flex-box-r" style="margin: 0px 50px ; padding: 20px 0px;align-items: center;">
            <h3 class="show-flex-box-r" style="flex-shrink:0; align-items: center;">
              <em style="width: 6px;height: 22px; background: #15BC83; margin-right:10px"></em>
              <strong style="font-size: 20px;">当前剩余假期</strong>
            </h3>
            <em style="flex-grow: 1; height: 2px; background: #F5F5F5; margin:0 25px;"></em>
          </div>
          <div class="" style="margin: 20px 50px;">
            <el-row :gutter="30">
              <el-col :span="6" class="show-flex-box-r show-flex-center">
                <div class="show-flex-box-c show-flex-center" style="font-size: 16px;">
                  <span style="margin-bottom: 40px;">0</span>
                  <span>年假</span>
                </div>
              </el-col>
              <el-col :span="6" class="show-flex-box-r show-flex-center" style="font-size: 16px;">
                <div class="show-flex-box-c show-flex-center">
                  <span style="margin-bottom: 40px;" >0</span>
                  <span>调休</span>
                </div>
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
                  <span>发送日志</span>
                </div>
              </el-col>
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
import addStaffDialog from "../../../../staff-manage/component/dialog/add-staff-dialog"
export default {
  components: {
    leaveApproveFormDialog,
    addStaffDialog
  },
  props: {
    dialogBool: Boolean,
    homePageType:{
      type: String,
      default:'quitted'
    }
  },
  data() {
    return {
      showTitle: "个人主页",
      loading: false,
      personalInfo:{},
      leaveApproveFormDialogShow: false,
      addStaffDialogShow: false,
      showCollapse: "first",
      curChangeType: "detail",
      appendToBody: true,
      groupUpList: [
        {
          content: "离职和交接申请",
          timestamp: "2018-04-11",
        },
        {
          content: "调岗成功",
          timestamp: "2018-04-12",
        },
        {
          content: "转正成功",
          timestamp: "2018-04-13",
        },
        {
          content: "调岗成功",
          timestamp: "2018-04-14",
        },
        {
          content: "新入职",
          timestamp: "2018-04-15",
        }
      ],
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
    checkLeaveApproveDetail(id) {
      this.dialogClose()
      // this.leaveApproveFormDialogShow = true
      let detail_id = 1350, title = '离职退休申请'
      this.$router.push({
        path: `/news-details/${id}/${title}/${detail_id}`
      })
    },

    // 查看档案详情
    checkPersonalArchivesDetail() {
      // this.curChangeType = 'detail'
      this.$refs['addStaffDialog'].setData(this.personalInfo)
      this.addStaffDialogShow = true
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
