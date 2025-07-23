<template>
  <el-dialog :visible="dialogBool" :title="showTitle" :before-close="dialogClose" width="80%" top="80px" :append-to-body="appendToBody">
    <div class="el-dialog-div" >
      <el-tabs v-model="activeName">
        <!-- <el-tab-pane label="基本信息" name="first">
          <span slot="label"><i style="color: #F56C6C">*</i> 基本信息</span>
          <base-info ref="baseInfo" :showCollapse="showCollapse" :curChangeType="curChangeType" @send-get-staff-age="getStaffAge" @change-worker-id="changeWorkerId" @change-personal-name="changePersonalName"></base-info>
        </el-tab-pane> -->
        <el-tab-pane label="工单信息" name="first">
          <archives-info ref="archivesInfo" :curChangeType="curChangeType" @send-vehicle-name="updateVehicleName"></archives-info>
        </el-tab-pane>
        <!-- <el-tab-pane label="项目派工" name="third">
          <span slot="label"><i style="color: #F56C6C">*</i> 用户信息</span>
          <user-info ref="userInfo" :curChangeType="curChangeType" @change-worker-id="changeWorkerId" @change-personal-name="changePersonalName"></user-info>
        </el-tab-pane> -->
        <!-- <el-tab-pane v-show="false" label="项目派工" name="fourth">
          <role-select ref="roleSelect" :curChangeType="curChangeType"></role-select>
        </el-tab-pane> -->
        <el-tab-pane label="物料清单" name="six" >
          <grow-up-record ref="lifecycle" :curChangeType="curChangeType"></grow-up-record>
        </el-tab-pane>
        <el-tab-pane label="维修资料" name="five">
          <certificate-info ref="certificateInfo" :curChangeType="curChangeType"></certificate-info>
        </el-tab-pane>
        <el-tab-pane label="操作记录" v-if="curChangeType=='detail'" name="seventh" >
          <grow-up ref="growUp" :curChangeType="curChangeType"></grow-up>
        </el-tab-pane>
        <el-tab-pane v-if="curChangeType=='detail'" label="维修历史记录" name="eight" >
          <change-record ref="repairlist" :curChangeType="curChangeType"></change-record>
        </el-tab-pane>

      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer" v-if="curChangeType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" v-if="activeName == 'first'&&curChangeType != 'edit'" @click="submitFormData('first')">保存并继续添加</el-button>
      <el-button type="primary" v-if="activeName == 'first'" @click="submitFormData('six')">保存并关联物料清单</el-button>
      <el-button type="primary" v-if="activeName == 'first'" @click="submitFormData">保存并关闭</el-button>
      <!-- <el-button type="primary" v-if="activeName == 'fourth'" @click="addOrderItem('six')">保存并继续添加</el-button>
      <el-button type="primary" v-if="activeName == 'fourth'" @click="addOrderItem">保存并关闭</el-button> -->
      <el-button type="primary" v-if="activeName == 'five'" @click="submitRepair">维修资料上传</el-button>
      <el-button type="primary" v-if="activeName == 'six'" @click="submitMateriel('five')">保存并继续添加</el-button>
      <el-button type="primary" v-if="activeName == 'six'" @click="submitMateriel">保存并关闭</el-button>
      <!-- <el-button type="primary" v-if="order_state==2" @click="completesubmit">完工申请</el-button> -->
    </div>
  </el-dialog>
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
import growUp from '../staff-info/grow-up';
export default {
  components: {growUp,baseInfo,userInfo,certificateInfo, drivingRecords, roleSelect, archivesInfo,changeRecord,growUpRecord},
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
    }
  },
  data() {
    return {
      work_code:'',
      order_state:'',
      selectedId: '',
      activeName: 'first',
      showTitle:'添加',
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
      }
    },
    activeName(bool) {
      if (bool === 'six') {
        this.$refs['lifecycle'].selectedTime()
      }
      if(bool==='five'){
         this.$refs.certificateInfo.order_id =data.order_id
      }
    },
  },
  methods: {
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
    // 更新物料清单的车辆信息
    updateVehicleName(vehicleName) {
      this.$refs.lifecycle.formData.vehicle_name = vehicleName
    },
      //跟新数据
    addMessage(data){ 
      this.$refs.certificateInfo.order_id =data.order_id
      // this.$refs.roleSelect.formData.order_id =data.order_id
      // this.$refs.roleSelect.formData.dept_id =data.maint_dept
      // this.$refs.roleSelect.formData.vehicle_number =data.vehicle_info.vehicle_number
      // this.$refs.roleSelect.formData.vehicle_name =data.vehicle_info.vehicle_name
      // this.$refs.roleSelect.formData.work_code =data.work_code
      this.$refs.lifecycle.formData.vehicle_name =data.vehicle_info.vehicle_name
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
        // this.$refs['baseInfo'].resetData()  // 
        this.$refs['archivesInfo'].resetData()  // 
        // this.$refs['userInfo'].resetData()  // 
        // this.$refs['roleSelect'].resetData()  //
        this.$refs['certificateInfo'].resetData()  // 
        this.$refs['lifecycle'].resetData()  //
        if(this.curChangeType == 'detail') {
          this.$refs['repairlist'].resetData()  
          this.$refs['growUp'].resetData()
        }
        if(this.showCollapse == 'second') {
          // this.$refs['drivingRecords'].resetData()  
        }
      },60)
      
    },
    // 编辑时数据回显  
    setData(val){
      this.order_state = val.state
      this.selectedId = val.i_id
      this.work_code =val.work_code
      setTimeout(() => {
         this.$refs['lifecycle'].setData(val)
        // this.$refs['baseInfo'].setData(val)
        this.$refs['archivesInfo'].setData(val) 
        // this.$refs['userInfo'].setData(val)
        // this.$refs['roleSelect'].setData(val)
        this.$refs['certificateInfo'].setData(val) 
        if(this.curChangeType == 'detail') {
          this.$refs['repairlist'].setData(val)
          this.$refs['growUp'].setData(val)
        }
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
    //物料清单
    submitMateriel(type) {
      const getFormData = name => this.$refs[name].getData()
      const lifecycle = getFormData('lifecycle')
      // const roleSelect = getFormData('roleSelect')
      // console.log(lifecycle)
      Promise.all([lifecycle])
      .then(res => {
        const staffInfoSum = {
          lifecycle: res[0].formData,
        }
        // 合并员工信息
        let params = Object.assign({})
        if(typeof(type)==='string'){
           this.activeName = type
        }else{
          this.activeName = null
        }
        
        this.$set(params, 'leave_nums', staffInfoSum.lifecycle)
        this.$set(params, 'activeName', this.activeName)
        this.$set(params, 'work_code', this.work_code)
        this.$emit('sure-save-Materiel', params)  
      })
      .catch(err => {
        err.target
        err.msg && this.$message.warning(err.msg)
      })
    },
    submitRepair() {
      const getFormData = name => this.$refs[name].getData()
      // const baseInfo = getFormData('baseInfo')
      // console.log(baseInfo)
      const archivesInfo = getFormData('archivesInfo')
      // console.log(archivesInfo)
      // const userInfo = getFormData('userInfo')
      // console.log(userInfo)
      // const roleSelect = getFormData('roleSelect')
      // console.log(roleSelect)
      const certificateInfo = getFormData('certificateInfo')
      // console.log(certificateInfo)
      let drivingRecords = null;
      if(this.showCollapse == 'second') {
        drivingRecords = getFormData('drivingRecords') //驾驶档案
        console.log(drivingRecords)
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

        if(this.curChangeType == 'edit') {
          params.i_id = this.selectedId;
        }
      
        // console.log(params)
        // return
        this.$set(params, 'activeName', this.activeName)
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
      // console.log(baseInfo)
      const archivesInfo = getFormData('archivesInfo')
      // console.log(archivesInfo)
      // const userInfo = getFormData('userInfo')
      // console.log(userInfo)
      const roleSelect = getFormData('roleSelect')
      console.log(roleSelect)
      const certificateInfo = getFormData('certificateInfo')
      // console.log(certificateInfo)
      let drivingRecords = null;
      if(this.showCollapse == 'second') {
        drivingRecords = getFormData('drivingRecords') //驾驶档案
        console.log(drivingRecords)
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

        if(this.curChangeType == 'edit') {
          params.i_id = this.selectedId;
        }
      
        // console.log(params)
        // return

        this.$emit('sure-save-complete-info', params)
      })
      .catch(err => {
        err.target
        err.msg && this.$message.warning(err.msg)
      })
    },
    submitFormData(type) {
      const getFormData = name => this.$refs[name].getData()
      // const baseInfo = getFormData('baseInfo')
      // console.log(baseInfo)
      const archivesInfo = getFormData('archivesInfo')
      // console.log(archivesInfo)
      // const userInfo = getFormData('userInfo')
      // console.log(userInfo)
      // const roleSelect = getFormData('roleSelect')
      console.log(roleSelect)
      // const certificateInfo = getFormData('certificateInfo')
      // console.log(certificateInfo)
      let drivingRecords = null;
      if(this.showCollapse == 'second') {
        drivingRecords = getFormData('drivingRecords') //驾驶档案
        console.log(drivingRecords)
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

        if(this.curChangeType == 'edit') {
          params.i_id = this.selectedId;
        }
      
        // console.log(params)
        // return
        if(typeof(type)==='string'){
           this.activeName = type
        }else{
          this.activeName = null
        }
        this.$set(params, 'activeName', this.activeName)
        this.$emit('sure-save-staff-info', params)
      if(type == "first"){
        this.$refs['archivesInfo'].resetData1() 
      }
      })
      .catch(err => {
        err.target
        err.msg && this.$message.warning(err.msg)
      })
    },
    addOrderItem(type) {
      const getFormData = name => this.$refs[name].getData()
      // const baseInfo = getFormData('baseInfo')
      // console.log(baseInfo)
      // const archivesInfo = getFormData('archivesInfo')
      // console.log(archivesInfo)
      // const userInfo = getFormData('userInfo')
      // console.log(userInfo)
      const roleSelect = getFormData('roleSelect')
      console.log(roleSelect)
      // const certificateInfo = getFormData('certificateInfo')
      // console.log(certificateInfo)
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

        if(this.curChangeType == 'edit') {
          params.i_id = this.selectedId;
        }
      
        // console.log(params)
        // return
          if(typeof(type)==='string'){
           this.activeName = type
        }else{
          this.activeName = null
        }
        this.$set(params, 'activeName', this.activeName)
        this.$emit('add-order-Item', params)


      })
      .catch(err => {
        err.target
        err.msg && this.$message.warning(err.msg)
      })
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .el-dialog-div {
  height: 70vh;
  overflow: auto;
}
</style>
