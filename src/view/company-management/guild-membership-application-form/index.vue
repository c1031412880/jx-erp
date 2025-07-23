<template>
  <div class="guild-membership-application-form">
    <div class="application-form-box show-flex-box-c">
      <h2>工会会员申请表</h2>
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <div class="show-flex-box-r show-flex-center">

          <div class="show-flex-box-r">
            <div class="show-flex-box-c" style="width: 350px;">
              <el-form-item label="会员姓名:" prop="user_id">
                <!-- <el-input v-model="form.name" placeholder="请输入姓名"></el-input> -->
                <get-department-select
                  ref="personalTree"
                  v-model="form.user_id"
                  :width="'220'"
                  :isShowCheckbox="false"
                  :placeholder="'请选择'"
                  :isContainEmp="true"
                  :show_all="true"
                  :isExportMultiple="false"
                  @on-change="selectedPersonal"
                ></get-department-select>
              </el-form-item>
              <el-form-item label="出生地点:" prop="address">
                <el-input v-model="form.address" placeholder="请输入出生地点"></el-input>
              </el-form-item>
              <el-form-item label="政治面貌:" prop="politics_status">
                <el-select v-model="form.politics_status" placeholder="请选择">
                  <el-option
                    v-for="item in politicsStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="籍贯:" prop="hometown">
                <el-input v-model="form.hometown" placeholder="请输入籍贯"></el-input>
              </el-form-item>
            </div>
            <div class="show-flex-box-c">
              <el-form-item label="联系电话:" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
              </el-form-item>
              <el-form-item label="民族:" prop="nation">
                <el-input v-model="form.nation" placeholder="请输入民族"></el-input>
              </el-form-item>
              <el-form-item label="学历:" prop="top_education">
                <el-input v-model="form.top_education" placeholder="请输入学历"></el-input>
              </el-form-item>
            </div>
            <div class="show-flex-box-c">
              <el-form-item label="出生日期:" prop="birthday">
                <el-date-picker
                  v-model="form.birthday"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="工资:" prop="wages">
                <el-input v-model="form.wages" @change="changeWages" placeholder="请输入工资" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.wages = $event.target.value"></el-input>
              </el-form-item>
              <el-form-item label="工作单位及职务:" prop="position">
                <el-input v-model="form.position" placeholder="请输入工作单位及职务"></el-input>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="show-flex-box-r show-flex-center">
          <div class="show-flex-box-c" style="width: 1050px;">
            <el-form-item label="家庭主要成员及其工作单位:" prop="home_position">
              <el-input
                v-model="form.home_position" 
                type="textarea"
                maxlength="200"
                :rows="4"
                show-word-limit
                placeholder="请输入家庭主要成员及其工作单位"></el-input>
            </el-form-item>
            <el-form-item label="个人工作简历:" prop="work_resume">
              <el-input
                v-model="form.work_resume" 
                type="textarea"
                maxlength="200"
                :rows="4"
                show-word-limit
                placeholder="请输入个人工作简历"></el-input>
            </el-form-item>
            <el-form-item label="备注:" prop="remark">
              <el-input
                v-model="form.remark" 
                type="textarea"
                maxlength="200"
                :rows="4"
                show-word-limit
                placeholder="请输入备注"></el-input>
            </el-form-item>
            <el-form-item label="上传附件:" prop="files">
               <multiple-files-upload :filesList="form.files" :acceptType="'.jpg,.jpeg,.doc,.docx,.pdf,.xls,.xlsx'" @upload-update-success="uploadUpdateSuccess"></multiple-files-upload>
            </el-form-item>
            <el-form-item label="流程:" prop="c_remark">
              <div class="show-flex-box-c">
                <!-- <approve-schedule :flow_id="flow_id" :isFlow="true"></approve-schedule> -->
                <el-select v-model="flow_id" clearable placeholder="请选择流程">
                  <el-option
                    v-for="item in flowListOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <div v-if="!!flow_id" style="margin-top: 30px;">
                  <approve-step :flow_id="flow_id" :isFlow="true" @on-users="saveOnUsers"></approve-step>
                </div>
                
              </div>
              
            </el-form-item>

          </div>
        </div>
      </el-form>
      <div class="show-flex-box-c" style="padding:20px 0; justify-content: flex-end;align-items: flex-end;">
        <span style="font-size:12px; color:#E6A23C;margin-right:15px;">提示： 先保存草稿再提交</span>
        <div class="show-flex-box-r" style="padding:20px 0; justify-content: flex-end;">
          <el-button type="primary" round @click="updatePlaybill('form','submit')" :disabled="!form.id || !flow_id">提 交</el-button>
          <el-button round @click="updatePlaybill('form', 'save')">保存草稿</el-button>
        </div>
        
      </div>

      <!-- <div class="show-flex-box-c show-flex-center">
        <div style="width: 100%;">流程</div>
        <div class="show-flex-box-r">
           <approve-schedule :flow_id="flow_id" :isFlow="true"></approve-schedule>
        </div>
      </div> -->
    </div>
    
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import multipleFilesUpload from "@/components/multiple-files-upload";
import approveSchedule from '@/components/approve-echo/approve-schedule.vue'
import approveStep from '@/components/approve-echo/approve-step.vue'
export default {
  name: "guild-membership-application-form",
  components: {
    getDepartmentSelect,
    multipleFilesUpload,
    approveSchedule,
    approveStep
  },
  data() {
    return {
      flowListOptions:[],
      politicsStatusOptions: [{
        value: '群众',
        label: '群众'
      }, {
        value: '团员',
        label: '团员'
      }, {
        value: '预备党员',
        label: '预备党员'
      }, {
        value: '党员',
        label: '党员'
      }],
      form:{
        id: '',
        flow_id:'',
        floe_code: '',
        name:'',
        user_id:'',
        address:'',
        politics_status: '',
        hometown: '',
        phone:'',
        nation: '',
        top_education:'',
        birthday: '',
        wages:'',
        position: '',
        home_position: '',
        work_resume:'',
        remark:'',
        files:[]
      },
      basicRules:{
        user_id: [
          { required: true, message: "请选择姓名", trigger: "change" },
        ],
        address: [
          { required: true, message: "请输入出生地点", trigger: "change" },
        ],
        politics_status: [
          { required: true, message: "请选择政治面貌", trigger: "change" },
        ],
        hometown: [
          { required: true, message: "请输入籍贯", trigger: "change" },
        ],
        phone: [
          { required: true, message: "请输入联系电话", trigger: "change" },
        ],
        nation: [
          { required: true, message: "请输入民族", trigger: "change" },
        ],
        top_education: [
          { required: true, message: "请输入学历", trigger: "change" },
        ],
        birthday: [
          { required: true, message: "请选择出生日期", trigger: "change" },
        ],
        position: [
          { required: true, message: "请输入工作单位及职务", trigger: "change" },
        ],
        home_position: [
          { required: true, message: "请输入家庭主要成员及其工作单位", trigger: "change" },
        ],
        work_resume: [
          { required: true, message: "请输入个人工作简历", trigger: "change" },
        ]
      },
      flow_id:'', //流程设计id
      approveStepList:[], //流程列表
      isFirstLoad: true
    };
  },
  mounted() {
    this.reqGetListFlowManage();
    this.reqCurByUserErpTradeMainManage();
    this.$nextTick(() => {
    });
  },
  methods: {
    // 选择人员带出人员基本信息
    selectedPersonal(val,node) {
      console.log(val,node)
      if(this.isFirstLoad) {
        this.isFirstLoad = false;
        return
      }
      if(val && val.length && !this.isFirstLoad) {
        let parmas = {
          id: val[0]
        }
        this.$client.getEmployeeManageDetail(parmas).then((res) => {
          if (res.head.result == "200") {
            // console.log(res)
            let staffInfo = res.context;
            if(staffInfo) {
              this.form.politics_status = staffInfo.political_landscape || '';
              this.form.hometown = staffInfo.native_place|| '';
              this.form.phone = staffInfo.phone || '';
              this.form.address = staffInfo.hj_address || '';
              this.form.nation = staffInfo.nation || '';
              this.form.top_education = staffInfo.qrz_xl || '';
              this.form.birthday = staffInfo.date_of_birth || '';
              // this.form.age = staffInfo.age || '';
              // this.form.school = staffInfo.c_school || '';
              // this.form.major = staffInfo.c_major || '';
              // this.form.phone = staffInfo.c_phone || '';
              // this.form.join_party = staffInfo.d_join_party || '';
              // this.form.live_temp_adrress = staffInfo.c_home_address || '';
              // this.form.account_area = staffInfo.c_account_area || '';
              this.$nextTick(() => {
                this.$refs.form.clearValidate();
              })
            }
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
        }).catch((err) => {});
      }
    },

    changeWages() {
      this.form.wages = Number(this.form.wages)
      if(!isNaN(this.form.wages)) {
        this.form.wages = this.form.wages.toFixed(2)
      }else{
        this.form.wages = ''
      }
      // console.log(this.form.wages)
    },
    // 获取流程列表
    reqGetListFlowManage() {
      let params = {
        object_id: 50,
        type: 2
      }
      this.$client.GetListFlowManage(params).then(res => {
        if(res.head.result == '200') {
          this.flowListOptions = res.context.list;
        }else{
          this.flowListOptions = [];
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    reqCurByUserErpTradeMainManage() {
      this.$client.GetByUserErpTradeMainManage().then(res => {
        if(res.head.result == '200') {
          let info = res.context
          if(!!info) {
            for (const key in this.form) {
              if (Object.hasOwnProperty.call(info, key)) {
                this.form[key] = info[key];
              }
            }
          }
          
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
   // 上传文件
    uploadUpdateSuccess(filesList) {
      this.form.files = filesList;
    },
    // 根据流程设计发起流程folw_code
    saveOnUsers(list) {
      this.approveStepList = list;
    },
    // 提交
    updatePlaybill(formName,type) {
      // if(type == 'submit') {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateSaveInfo(type);
          // this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
      // }else{
        // console.log(this.form)
        // 更新保存信息
        // this.updateSaveInfo(type);
      // }
    },
    // 更新保存信息
    updateSaveInfo(type) {
      let info = {...this.form}
      if(!info.id) {
        delete info.id
      }
      if(!info.flow_id) {
        delete info.flow_id
      }
      if(!info.floe_code) {
        delete info.floe_code
      }
      this.$client.CreateOrUpdateReqErpTradeMainManage({context: info}).then(res => {
        if(res.head.result == '200') {
          if(type == 'save') {
            this.form.id = res.context.id;
            this.$message({
              showClose: true,
              message: '草稿保存成功',
              type: "success",
            });
          }

          if(type == 'submit') {
            // this.updateSaveInfo('save')
            this.reqCurByUserErpTradeMainManage();
            setTimeout(() => {
              if(this.form.id) {
                this.submitApplyMembershipForm();
              }
            },100)
            
            
            // this.$message({
            //   showClose: true,
            //   message: '提交申请成功',
            //   type: "success",
            // });
          }
          
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 提交申请获取流程code和流程id
    submitApplyMembershipForm() {
      if(this.approveStepList.length) {
        let params = {
          context: this.approveStepList
        }
        this.$client.StartFlowRecord(params).then(res => {
          if(res.head.result == '200') {
            this.form.flow_id = res.context.id
            this.form.floe_code = res.context.code
            if(this.form.flow_id && this.form.floe_code) {
              this.canSubmitInfo();
            }
          }else{
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
    // 提交带流程的申请
    canSubmitInfo() {
       let params = {
         context:{
           id: this.form.id,
           flow_id: this.form.flow_id,
           floe_code: this.form.floe_code,
         }
       }
       this.$client.SubmitErpTradeMainManage(params).then(res => {
        if(res.head.result == '200') {
          this.$nextTick(() => {
            this.$refs.form.clearValidate();
            this.$refs.personalTree.onClear();
          })
          this.$message({
            showClose: true,
            message: '提交申请成功',
            type: "success",
          });
          Object.assign(this.$data, this.$options.data());
          this.reqGetListFlowManage();
          this.$nextTick(() => {
            this.$refs.form.clearValidate();
          })
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.guild-membership-application-form {
  width: 100%;
  height: 100%;
  >.application-form-box{
    width: 100%;
    >h2{
      width: 100%;
      padding: 15px 0 25px;
      text-align: center;
      font-size: 20px;
    }
  }
}

.guild-membership-application-form /deep/ .el-date-editor {
  width: 210px;
}
.guild-membership-application-form /deep/.el-select,.el-select--mini {
  width: 210px;
}
.guild-membership-application-form /deep/ .el-input,.el-input--mini{
  width: 210px;
}

.guild-membership-application-form /deep/ .el-textarea {
  width: 910px;
}
</style>
