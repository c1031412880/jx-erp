<template>
  <el-dialog :visible="dialogBool" :title="showTitle" :before-close="dialogClose" width="900px"  :append-to-body="appendToBody">
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <span slot="label"><i style="color: #F56C6C">*</i> 基本信息</span>
          <base-info ref="baseInfo" :showCollapse="showCollapse" :curChangeType="curChangeType" @send-get-staff-age="getStaffAge" @change-worker-id="changeWorkerId" @change-personal-name="changePersonalName"></base-info>
        </el-tab-pane>
        <el-tab-pane label="档案信息" name="second">
          <archives-info ref="archivesInfo" :curChangeType="curChangeType"></archives-info>
        </el-tab-pane>
        <el-tab-pane label="用户信息" name="third">
          <span slot="label"><i style="color: #F56C6C">*</i> 用户信息</span>
          <user-info ref="userInfo" :curChangeType="curChangeType" @change-worker-id="changeWorkerId" @change-personal-name="changePersonalName"></user-info>
        </el-tab-pane>
        <el-tab-pane label="角色选择" name="fourth">
          <span slot="label"><i style="color: #F56C6C">*</i> 角色选择</span>
          <role-select ref="roleSelect" :curChangeType="curChangeType"></role-select>
        </el-tab-pane>
        <el-tab-pane label="证件信息" name="five">
          <certificate-info ref="certificateInfo" :curChangeType="curChangeType"></certificate-info>
        </el-tab-pane>
        <el-tab-pane label="驾驶档案" name="six" v-if="showCollapse == 'second'">
          <driving-records ref="drivingRecords" :curChangeType="curChangeType"></driving-records>
        </el-tab-pane>
        <el-tab-pane label="变更记录" name="seventh" v-if="curChangeType == 'detail'">
          <change-record ref="changeRecord"></change-record>
        </el-tab-pane>
        <el-tab-pane label="成长记录" name="eighth" v-if="curChangeType == 'detail'">
          <grow-up-record ref="lifecycle"></grow-up-record>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer" v-if="curChangeType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="submitFormData">确 定</el-button>
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
export default {
  components: {baseInfo,userInfo,certificateInfo, drivingRecords, roleSelect, archivesInfo,changeRecord,growUpRecord},
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
  },
  methods: {
    configAddStaffInfo() {
      if(this.curChangeType == 'add') {
        this.showTitle = '添加';
        setTimeout(() => {
          this.$refs.baseInfo.setDate();
        },600)
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
        this.$refs['baseInfo'].resetData()  // 基础信息清除
        this.$refs['archivesInfo'].resetData()  // 档案信息清除
        this.$refs['userInfo'].resetData()  // 用户信息清除
        this.$refs['roleSelect'].resetData()  // 角色选择信息清除
        this.$refs['certificateInfo'].resetData()  // 证件图片信息清除
        if(this.showCollapse == 'second') {
          this.$refs['drivingRecords'].resetData()  // 驾驶档案信息清除
        }
        if(this.curChangeType === 'detail') {
          this.$refs['lifecycle'].resetData()  // 成长记录清除
        }
      },60)
      
    },
    // 编辑时数据回显  
    setData(val){
      this.selectedId = val.i_id
      setTimeout(() => {
        this.$refs['baseInfo'].setData(val)
        this.$refs['archivesInfo'].setData(val) 
        this.$refs['userInfo'].setData(val)
        this.$refs['roleSelect'].setData(val)
        this.$refs['certificateInfo'].setData(val)
        if(this.showCollapse == 'second') {
          this.$refs['drivingRecords'].setData(val)
        }
        if(this.curChangeType === 'detail') {
          this.$refs['lifecycle'].setData(val)
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
    submitFormData() {
      const getFormData = name => this.$refs[name].getData()
      const baseInfo = getFormData('baseInfo')
      // console.log(baseInfo)
      const archivesInfo = getFormData('archivesInfo')
      // console.log(archivesInfo)
      const userInfo = getFormData('userInfo')
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
        
        // if(params.role_ids.length == 0) {
        //   this.$message({
        //     showClose: true,
        //     message: '角色选择为必选项',
        //     type: "warning",
        //   });
        //   return
        // }
        // console.log(params)
        // return

        this.$emit('sure-save-staff-info', params)
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

</style>
