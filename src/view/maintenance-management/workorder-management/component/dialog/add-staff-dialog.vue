<template>
  <tr-dialog 
    ref="trDiaLog"
    :visible="dialogBool" 
    :title="showTitle" 
    @before-close="dialogClose"
    :width="'960px'"
    @change-full="changeBoxHeight"
    :appendToBody="appendToBody">
    <el-tabs v-model="activeName">
      <!-- <el-tab-pane label="基本信息" name="first">
        <span slot="label"><i style="color: #F56C6C">*</i> 基本信息</span>
        <base-info ref="baseInfo" :showCollapse="showCollapse" :curChangeType="curChangeType" @send-get-staff-age="getStaffAge" @change-worker-id="changeWorkerId" @change-personal-name="changePersonalName"></base-info>
      </el-tab-pane> -->
      <el-tab-pane label="工单信息" name="first">
        <div :style="{'height': boxHeight}">
          <archives-info ref="archivesInfo" :curChangeType="curChangeType" @on-close="dialogClose"></archives-info>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="项目派工" name="third">
        <span slot="label"><i style="color: #F56C6C">*</i> 用户信息</span>
        <user-info ref="userInfo" :curChangeType="curChangeType" @change-worker-id="changeWorkerId" @change-personal-name="changePersonalName"></user-info>
      </el-tab-pane> -->
      <el-tab-pane label="项目派工" name="fourth">
        <div :style="{'height': boxHeight}">
          <role-select ref="roleSelect" :curChangeType="curChangeType"></role-select>
        </div>
      </el-tab-pane>
      <el-tab-pane label="物料清单" name="two" >
        <div :style="{'height': boxHeight}">
          <bindinglist ref="binding" :curChangeType="curChangeType" :returnMaterials="returnMaterials"></bindinglist>
        </div>
      </el-tab-pane>
      <el-tab-pane label="维修资料" name="five">
        <div :style="{'height': boxHeight}">
          <certificate-info ref="certificateInfo" :curChangeType="curChangeType"></certificate-info>
        </div>
      </el-tab-pane>
      <el-tab-pane label="操作记录" name="six" >
        <div :style="{'height': boxHeight}">
          <grow-up-record ref="lifecycle1" :curChangeType="curChangeType"></grow-up-record>
        </div>
      </el-tab-pane>
      <el-tab-pane label="维修历史记录" name="seventh" >
        <div :style="{'height': boxHeight}">
          <change-record ref="repairlist" :curChangeType="curChangeType"></change-record>
        </div>
      </el-tab-pane>

    </el-tabs>
    <div slot="footer" class="dialog-footer" v-if="curChangeType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="warning" v-if="activeName == 'first' && order_state == 2 && state_child_name !== '转外修'" @click="outturnRepair">转外修</el-button>
      <el-button type="primary" v-if="activeName == 'first'" @click="submitFormData">保 存</el-button>
      <el-button type="primary" v-if="activeName == 'two'" @click="submitMateriel">保存并关闭</el-button>
      <el-button type="primary" v-if="activeName == 'fourth'" @click="addOrderItem">派工</el-button> <!-- &&order_state<3 -->
      <el-button type="primary" v-if="activeName == 'five'" @click="submitRepair">维修资料上传</el-button>
      <el-button type="primary" v-if="!isPassed" @click="completesubmit">完工申请</el-button>
    </div>

    <fixed-form-body 
      ref="fixedFormBody"
      :dialogBool.sync="fixedFormBodyShow" 
      :appendToBody="true"
      :isWorkOrder="true"
      @on-refresh="closeFormDialog" 
      :formId="5080" 
      :formName="'车辆外修联系单'"></fixed-form-body>
  </tr-dialog>
</template>

<script type="text/ecmascript-6">
import baseInfo from '../staff-info/base-info';
import userInfo from '../staff-info/user-info.vue';
import certificateInfo from '../staff-info/certificate-info.vue';
import drivingRecords from '../staff-info/driving-records.vue';
import roleSelect from '../staff-info/role-select.vue';
import archivesInfo from '../staff-info/archives-info.vue';
import changeRecord from '../staff-info/change-record.vue';
import growUpRecord from '../staff-info/grow-up-record';
import bindinglist from '../staff-info/binding-list';
import fixedFormBody from '@/view/main-Interface-entrance/launch-affair/component/all-box/fixed-form-body';
export default {
  components: {baseInfo,userInfo,certificateInfo, drivingRecords, roleSelect, archivesInfo,changeRecord,growUpRecord,bindinglist,fixedFormBody},
  props: {
    dialogBool: Boolean,
    curChangeType: {
      type: String,
      default: 'add' //add添加  edit编辑  detail详情
    },
    showCollapse:{
      type: String,
      default: 'first' // first普通员工 second驾驶员
    },
    appendToBody:{
      type: Boolean,
      default: false
    },
    returnMaterials:{
      type: [Number, String],
      default: 1
    },
  },
  data() {
    return {
      work_code:'',
      order_state:'',
      state_child_name:'',
      activeName: 'first',
      showTitle:'添加',
      boxHeight: '70vh',
      fixedFormBodyShow: false,
      info: '',
      isPassed: false
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.resetData();
        Object.assign(this.$data, this.$options.data());
      }else{
        this.activeName = 'first';
        this.configAddStaffInfo();
        this.$refs.trDiaLog.fullscreen = true
        this.boxHeight = document.body.clientHeight - (this.curChangeType != 'detail' ? 195 : 125) + 'px'
      }
    },
    activeName(bool) {
      if (bool === 'two') {
        this.$refs['binding'].selectedTime()
      }
      if(bool==='five'){
        //  this.$refs.certificateInfo.order_id =data.order_id
      }
    },
  },
  methods: {
    changeBoxHeight() {
      this.boxHeight = this.boxHeight === '70vh' ? document.body.clientHeight - (this.curChangeType != 'detail' ? 195 : 125) + 'px' : '70vh';
    },
    configAddStaffInfo() {
      if(this.curChangeType == 'add') {
        this.showTitle = '添加';
        // 获取档案编号
        if(this.showCollapse == 'second') {
          this.reqRecordNumber();
        }
      }else if(this.curChangeType == 'edit'){
        this.showTitle = '编辑'
      }else{
        this.showTitle = '详情'
      }
      // 驾驶员固定岗位ID是  i_position_id = 0
      setTimeout(() => {
        if(this.showCollapse == 'second') {
          this.$refs.baseInfo.formData.i_position_id = 0
        }
      }, 300);
    },
      //跟新数据
    addMessage(data){ 
      this.$refs.certificateInfo.order_id =data.order_id
      // this.$refs.roleSelect.formData.order_id =data.order_id
      // this.$refs.roleSelect.formData.dept_id =data.maint_dept
      // this.$refs.roleSelect.formData.vehicle_number =data.vehicle_info.vehicle_number
      // this.$refs.roleSelect.formData.vehicle_name =data.vehicle_info.vehicle_name
      // this.$refs.binding.formData.work_code =data.work_code
      this.$refs.binding.formData.vehicle_name =data.vehicle_info.vehicle_name
      // this.$refs.roleSelect.this.formData.maint_dept_name =data.maint_dept_name
    },
    // 获取档案编号
    reqRecordNumber() {
      this.$client.getRecordNumber()
      .then(res => {
        if(res.head.result == '200') {
          setTimeout(() => {
            this.$refs.drivingRecords.formData.c_da_code = res.context;
          },30)
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    resetData(){
      setTimeout(() => {
        this.$refs['binding'].resetData() 
        // this.$refs['baseInfo'].resetData()  // 基础信息清除
        this.$refs['archivesInfo'].resetData()  // 档案信息清除
        // this.$refs['userInfo'].resetData()  // 用户信息清除
        this.$refs['roleSelect'].resetData()  // 角色选择信息清除
        this.$refs['certificateInfo'].resetData()  // 证件图片信息清除
        this.$refs['lifecycle1'].resetData()  // 生命周期
        this.$refs['repairlist'].resetData()  // 生命周期
        if(this.showCollapse == 'second') {
          this.$refs['drivingRecords'].resetData()  // 驾驶档案信息清除
        }
      },60)
      
    },
     //物料清单
    submitMateriel(type) {
      const getFormData = name => this.$refs[name].getData()
      const binding = getFormData('binding')
      // const roleSelect = getFormData('roleSelect')
      Promise.all([binding])
      .then(res => {
        const staffInfoSum = {
          binding: res[0].formData,
        }
        // 合并员工信息
        let params = Object.assign({})
        if(typeof(type)==='string'){
           this.activeName = type
        }else{
          this.activeName = null
        }
        
        this.$set(params, 'leave_nums', staffInfoSum.binding)
        this.$set(params, 'activeName', this.activeName)
        this.$set(params, 'work_code', this.work_code)

        this.$emit('sure-save-Materiel', params)  
      })
      .catch(err => {
        err.target
        err.msg && this.$message.warning(err.msg)
      })
    },
    // 编辑时数据回显  
    setData(val, type){
      this.order_state = val.state
      this.state_child_name = val.state_child_name
      this.work_code =val.work_code
      this.isPassed = type ? true : false
      this.info = {
        id: val.id,
        work_code: val.work_code || '',
        driver_id: val.driver_id || '',
        vehicle_id: val.vehicle_id || '',
        repair_time: val.repair_time || '',
        repair_describe: val.repair_describe || '',
      }
      setTimeout(() => {
        this.$refs['binding'].setData(val)
         this.$refs['lifecycle1'].setData(val)
        // this.$refs['baseInfo'].setData(val)
        this.$refs['archivesInfo'].setData(val) 
        // this.$refs['userInfo'].setData(val)
        this.$refs['roleSelect'].setData(val)
        this.$refs['certificateInfo'].setData(val) 
        this.$refs['repairlist'].setData(val)
        if(this.showCollapse == 'second') {
          this.$refs['drivingRecords'].setData(val)
        }
      }, 60);
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 获取员工年龄
    getStaffAge(age) {
      this.$refs.archivesInfo.staffAge = age
    },
    // 监听员工编号
    changeWorkerId(workerId,type) {
      // alert(workerId)
      if(type == 'base') {
        this.$refs.userInfo.formData.c_worker_id = workerId
      }else if(type == 'user'){
        this.$refs.baseInfo.formData.c_worker_id = workerId
      }
    },
    changePersonalName(name,type) {
      // alert(name)
      if(type == 'base') {
        this.$refs.userInfo.formData.c_name = name
      }else if(type == 'user'){
        this.$refs.baseInfo.formData.c_name = name
      }
    },
    submitRepair() {
      const getFormData = name => this.$refs[name].getData()
      // const baseInfo = getFormData('baseInfo')
      const archivesInfo = getFormData('archivesInfo')
      // const userInfo = getFormData('userInfo')
      const roleSelect = getFormData('roleSelect')
      const certificateInfo = getFormData('certificateInfo')
      let drivingRecords = null;
      if(this.showCollapse == 'second') {
        drivingRecords = getFormData('drivingRecords') //驾驶档案
      }

      Promise.all([baseInfo,archivesInfo,userInfo,roleSelect,certificateInfo,this.showCollapse == 'second'? drivingRecords: null])
      .then(res => {
        const staffInfoSum = {
          // baseInfo: res[0].formData,
          // archivesInfo: res[1].formData,
          // userInfo: res[2].formData,
          // roleSelect: res[3].formData,
          certificateInfo: res[4].formData
          // drivingRecords: this.showCollapse == 'second'? res[5].formData : {},
        }
        // 合并员工信息
        let params = Object.assign([],staffInfoSum.baseInfo,staffInfoSum.archivesInfo,staffInfoSum.userInfo,staffInfoSum.roleSelect,staffInfoSum.certificateInfo,staffInfoSum.drivingRecords)
        console.log(params,'fsdfgdsgfdgsdfgsdgfdsfgdfg');
        
        this.$emit('sure-save-repair-info', params)
      })
      .catch(err => {
        err.target
        err.msg && this.$message.warning(err.msg)
      })
    },
    completesubmit() {
      const getFormData = name => this.$refs[name].getData()
      // const baseInfo = getFormData('baseInfo')
      const archivesInfo = getFormData('archivesInfo')
      // const userInfo = getFormData('userInfo')
      const roleSelect = getFormData('roleSelect')
      const certificateInfo = getFormData('certificateInfo')
      let drivingRecords = null;
      if(this.showCollapse == 'second') {
        drivingRecords = getFormData('drivingRecords') //驾驶档案
      }

      Promise.all([baseInfo,archivesInfo,userInfo,roleSelect,certificateInfo,this.showCollapse == 'second'? drivingRecords: null])
      .then(res => {
        const staffInfoSum = {
          // baseInfo: res[0].formData,
          archivesInfo: res[1].formData,
          // userInfo: res[2].formData,
          // roleSelect: res[3].formData,
          // certificateInfo: res[4].formData
          // drivingRecords: this.showCollapse == 'second'? res[5].formData : {},
        }
        // 合并员工信息
        let params = Object.assign([],staffInfoSum.baseInfo,staffInfoSum.archivesInfo,staffInfoSum.userInfo,staffInfoSum.roleSelect,staffInfoSum.certificateInfo,staffInfoSum.drivingRecords)
        this.$emit('sure-save-complete-info', params)
      })
      .catch(err => {
        err.target
        err.msg && this.$message.warning(err.msg)
      })
    },
    submitFormData() {
      const getFormData = name => this.$refs[name].getData()
      // const baseInfo = getFormData('baseInfo')
      const archivesInfo = getFormData('archivesInfo')
      // const userInfo = getFormData('userInfo')
      const roleSelect = getFormData('roleSelect')
      const certificateInfo = getFormData('certificateInfo')
      let drivingRecords = null;
      if(this.showCollapse == 'second') {
        drivingRecords = getFormData('drivingRecords') //驾驶档案
      }

      Promise.all([baseInfo,archivesInfo,userInfo,roleSelect,certificateInfo,this.showCollapse == 'second'? drivingRecords: null])
      .then(res => {
        const staffInfoSum = {
          baseInfo: res[0].formData,
          archivesInfo: res[1].formData,
          userInfo: res[2].formData,
          roleSelect: res[3].formData,
          certificateInfo: res[4].formData,
          drivingRecords: this.showCollapse == 'second'? res[5].formData : {},
        }
        // 合并员工信息
        let params = Object.assign({},staffInfoSum.baseInfo,staffInfoSum.archivesInfo,staffInfoSum.userInfo,staffInfoSum.roleSelect,staffInfoSum.certificateInfo,staffInfoSum.drivingRecords)
        this.$emit('sure-save-staff-info', params)
      })
      .catch(err => {
        err.target
        err.msg && this.$message.warning(err.msg)
      })
    },
    addOrderItem() {
      const getFormData = name => this.$refs[name].getData()
      // const baseInfo = getFormData('baseInfo')
      const archivesInfo = getFormData('archivesInfo')
      // const userInfo = getFormData('userInfo')
      const roleSelect = getFormData('roleSelect')
      const certificateInfo = getFormData('certificateInfo')
      let drivingRecords = null;
      if(this.showCollapse == 'second') {
        drivingRecords = getFormData('drivingRecords') //驾驶档案
        console.log(drivingRecords)
      }

      Promise.all([baseInfo,archivesInfo,userInfo,roleSelect,certificateInfo,this.showCollapse == 'second'? drivingRecords: null])
      .then(res => {
        const staffInfoSum = {
          roleSelect: res[3].formData,
        }
        // 合并员工信息
        let params = Object.assign([],staffInfoSum.baseInfo,staffInfoSum.archivesInfo,staffInfoSum.userInfo,staffInfoSum.roleSelect,staffInfoSum.certificateInfo,staffInfoSum.drivingRecords)
        this.$emit('add-order-Item', params)
      })
      .catch(err => {
        err.target
        err.msg && this.$message.warning(err.msg)
      })
    },
    // 打开外修联系单
    outturnRepair() {
      this.fixedFormBodyShow = true
      setTimeout(() => {
        this.$refs.fixedFormBody.initFormData(this.info)
      }, 300);
    },
    // 提交外修单
    closeFormDialog() {
      this.fixedFormBodyShow = false
      this.dialogClose()
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
