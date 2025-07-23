<template>
  <el-dialog :visible="dialogBool" :title="showTitle" :before-close="dialogClose" width="820px"  :append-to-body="appendToBody">
    <div>
      <el-tabs v-model="activeName"  >
        <el-tab-pane label="报修信息" name="first">
          <base-info ref="baseInfo" :curChangeType="curChangeType" :dialogBool="dialogBool" v-loading="detailLoading" :isAccidentCorrelation="isAccidentCorrelation" :isCheckout="isCheckout" :isAccidentDetail="isAccidentDetail" :isAccidentEdit="isAccidentEdit"></base-info>
        </el-tab-pane>
        <el-tab-pane label="进厂检验"  name="second" v-if="(curChangeType != 'edit'&&curChangeType!='add'&&curChangeType !='addtrue'&&dialogBool) || (curChangeType == 'addtrue' && isAccidentDetail) || (curChangeType == 'addtrue' && isCheckout)">
          <install-info ref="installInfo" 
            :curChangeType="curChangeType" 
            :isAccidentDetail="isAccidentDetail" 
            :isCheckout="isCheckout" 
            v-loading="detailLoading"
            @on-close="getLoadData"></install-info>
        </el-tab-pane>
        <el-tab-pane label="车辆维修记录" name="third" v-if="(curChangeType != 'edit'&&curChangeType!='add'&&curChangeType !='addtrue') || (curChangeType == 'addtrue' && isAccidentDetail)">
          <maintain-condition ref="maintainCondition" v-loading="detailLoading"></maintain-condition>
        </el-tab-pane>
        <!-- <el-tab-pane label="报废情况" name="fourth" v-if="curChangeType == 'detail'">
          <scrap-condition ref="scrapCondition" v-loading="detailLoading"></scrap-condition>
        </el-tab-pane>
        <el-tab-pane label="生命周期" name="six" v-if="curChangeType == 'detail'">
          <life-cycle ref="lifecycle" :containerLifeData="containerLifeData" v-loading="detailLoading"></life-cycle>
        </el-tab-pane> -->
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer" v-if="(curChangeType == 'edit'||curChangeType == 'add'||(curChangeType == 'addtrue'&& !isAccidentDetail)) && !isCheckout">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="submitFormData">确 定</el-button>
    </div>
    <div slot="footer" class="dialog-footer" v-if="curChangeType == 'checkout' || (curChangeType == 'addtrue' && isCheckout)">
      <el-button v-show="state != 8" :disabled="disabled" @click="clickFormData(2)">检验未通过</el-button>
      <el-button @click="dialogClose">取 消</el-button>
      <el-button v-show="state != 8" type="primary" :disabled="disabled" @click="clickFormData(1)">确定维修</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import baseInfo from '../main-info/base-info';
import installInfo from '../main-info/install-info.vue';
import maintainCondition from '../main-info/maintain-condition.vue';
import scrapCondition from '../main-info/scrap-condition.vue';
import lifeCycle from '../main-info/life-cycle';
export default {
  components: {
    baseInfo,
    installInfo,
    maintainCondition,
    scrapCondition,
    lifeCycle},
  props: {
    dialogBool: Boolean,
    curChangeType: {
      type: String,
      default: 'add' //add添加  edit编辑  detail详情
    },
    appendToBody:{
      type: Boolean,
      default: false
    },
    detailLoading:{
      type: Boolean,
      default: false
    },
    containerVehicleRecode:{
      type:Array
    },
    containerLifeData:[Array],
    isAccidentCorrelation:{
      type: Boolean,
      default: false
    },
    isAccidentDetail:{
      type: Boolean,
      default: false
    },
    isCheckout:{
      type: Boolean,
      default: false
    },
    isAccidentEdit:{
      type: Boolean,
      default: false
    },
    state: '',
  },
  data() {
    return {
      // containerVehicleRecode:'',
      selectedId: '',
      activeName: 'first',
      showTitle:'添加',
      disabled: false
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
  mounted() {

  },
  methods: {
    configAddStaffInfo() {
      if(this.curChangeType == 'add') {
        this.showTitle = '添加';
      }else if(this.curChangeType == 'addtrue'){
        if(this.isAccidentDetail) {
          this.showTitle = '详情'
        }
        if(this.isAccidentEdit) {
          this.showTitle = '编辑'
        }
        if(this.isCheckout) {
          this.showTitle = '检验'
        }
      }else if(this.curChangeType == 'edit'){
        this.showTitle = '编辑'
      }else if(this.curChangeType == 'checkout'){
        this.showTitle = '检验'
      }else{
        this.showTitle = '详情'
      }
    },
    resetData(){
      setTimeout(() => {
        this.$refs['baseInfo'].resetData()
        if(this.curChangeType == 'checkout'||this.curChangeType == 'detail' || (this.curChangeType == 'addtrue' && this.isCheckout) || (this.curChangeType == 'addtrue' && this.isAccidentDetail)){
          this.$refs['installInfo'].resetData()
        }  // 基础信息清除
          // 安装车辆信息清除
        if(this.curChangeType == 'detail' || (this.curChangeType == 'addtrue' && this.isAccidentDetail)) {
          this.$refs['maintainCondition'].resetData()  // 大修情况信息清除
          // this.$refs['scrapCondition'].resetData()  // 报废情况信息清除
          // this.$refs['lifecycle'].resetData()  // 生命周期信息清除
        }
      })
      
    },
    // 编辑时数据回显  
    setData(val){
      this.selectedId = val.id
      setTimeout(() => {
        this.$refs['baseInfo'].setData(val)
         if(this.curChangeType == 'checkout'||this.curChangeType == 'detail' || (this.curChangeType == 'addtrue' && this.isCheckout) || (this.curChangeType == 'addtrue' && this.isAccidentDetail)){
          this.$refs['installInfo'].setData(val);
        }
       
        if(this.curChangeType == 'detail' || (this.curChangeType == 'addtrue' && this.isAccidentDetail)) {
          this.$refs['maintainCondition'].setData(val)
          // this.$refs['scrapCondition'].setData(val)
          // this.$refs['lifecycle'].setData(val)
        }
        
      }, 60);
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 确定检验、和检验未通过
    clickFormData(val) {
      const getFormData = name => this.$refs[name].getData()
      const installInfo = getFormData('installInfo')
      Promise.all([installInfo])
      .then(res => {
        const staffInfoSum = {
          installInfo: res[0].formData,
        }
        // 合并信息
        let params = Object.assign({},staffInfoSum)
        if(this.curChangeType == 'edit' || (this.curChangeType == 'addtrue' && !!params.id)) {
          this.$emit('sure-edit-info', params)
        }else{
          // if(val == 1 && params.installInfo.estimate_amount >= 2000) {
          //   let form = this.$refs.baseInfo.getAllInfo()
          //   this.$refs.installInfo.initiateApprovalHandel(form)
          // }else {
            this.$emit('sure-checkout-info', params, val)
          // }
        }
      })
      .catch(err => {
        err.target
        err.msg && this.$message.warning(err.msg)
      })
    },
    
  
    submitFormData() {
      const getFormData = name => this.$refs[name].getData()
      const baseInfo = getFormData('baseInfo')
      // const installInfo = getFormData('installInfo')
      // console.log(installInfo)

      Promise.all([baseInfo])
      .then(res => {
        const staffInfoSum = {
          baseInfo: res[0].formData,
          // installInfo: res[1].formData,
        }
        // console.log(staffInfoSum)
        // 合并信息
        let params = Object.assign({},staffInfoSum.baseInfo)
        // if(!!staffInfoSum.installInfo.type) {
        //   params.tyre_vehicle = staffInfoSum.installInfo
        // }

        // console.log(this.curChangeType,params)
        // return 
        if(this.curChangeType == 'edit' || (this.curChangeType == 'addtrue' && !!params.id)) {
          this.$emit('sure-edit-info', params)
          // if(!!staffInfoSum.installInfo.type)
          // params.tyre_vehicle.tyre_id = this.selectedId
        }else{
          params = this.$outFormData(params)
          this.$emit('sure-save-info', params)
        }
      })
      .catch(err => {
        err.target
        err.msg && this.$message.warning(err.msg)
      })
    },
    // 关闭弹窗并请求数据
    getLoadData() {
      this.disabled = true
      this.dialogClose()
      this.$emit('on-load')
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.base-info /deep/ .el-date-editor {
  width: 250px;
}
.base-info /deep/.el-select,.el-select--mini {
  width: 250px;
}
.base-info /deep/ .el-input,.el-input--mini{
  width: 250px;
}

.base-info /deep/ .el-textarea {
  width: 620px;
}


</style>

