<template>
  <el-dialog :visible="dialogBool" :title="showTitle" :before-close="dialogClose" width="650px"  :append-to-body="appendToBody">
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <base-info ref="baseInfo" :curChangeType="curChangeType" v-loading="detailLoading"></base-info>
        </el-tab-pane>
        <el-tab-pane label="安装车辆" name="second">
          <install-info ref="installInfo" :curChangeType="curChangeType" :containerVehicleRecode="containerVehicleRecode" v-loading="detailLoading"></install-info>
        </el-tab-pane>
        <el-tab-pane label="检验情况" name="third" v-if="curChangeType == 'detail'">
          <maintain-condition ref="maintainCondition" v-loading="detailLoading"></maintain-condition>
        </el-tab-pane>
        <el-tab-pane label="报废情况" name="fourth" v-if="curChangeType == 'detail'">
          <scrap-condition ref="scrapCondition" v-loading="detailLoading"></scrap-condition>
        </el-tab-pane>
        <el-tab-pane label="生命周期" name="six" v-if="curChangeType == 'detail'">
          <life-cycle ref="lifecycle" :containerLifeData="containerLifeData" v-loading="detailLoading"></life-cycle>
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
    containerVehicleRecode:[Array],
    containerLifeData:[Array]
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
      }else if(this.curChangeType == 'edit'){
        this.showTitle = '编辑'
      }else{
        this.showTitle = '详情'
      }
    },
    resetData(){
      setTimeout(() => {
        this.$refs['baseInfo'].resetData()  // 基础信息清除
        this.$refs['installInfo'].resetData()  // 安装车辆信息清除
        if(this.curChangeType == 'detail') {
          this.$refs['maintainCondition'].resetData()  // 大修情况信息清除
          this.$refs['scrapCondition'].resetData()  // 报废情况信息清除
          this.$refs['lifecycle'].resetData()  // 生命周期信息清除
        }
      },60)
      
    },
    // 编辑时数据回显  
    setData(val){
      this.selectedId = val.id
      setTimeout(() => {
        this.$refs['baseInfo'].setData(val)
        this.$refs['installInfo'].setData(val);
        if(this.curChangeType == 'detail') {
          this.$refs['maintainCondition'].setData(val)
          this.$refs['scrapCondition'].setData(val)
          this.$refs['lifecycle'].setData(val)
        }
        
      }, 60);
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    submitFormData() {
      const getFormData = name => this.$refs[name].getData()
      const baseInfo = getFormData('baseInfo')
      const installInfo = getFormData('installInfo')
      // console.log(installInfo)

      Promise.all([baseInfo,installInfo])
      .then(res => {
        const staffInfoSum = {
          baseInfo: res[0].formData,
          installInfo: res[1].formData,
        }
        // console.log(staffInfoSum)
        // 合并信息
        let params = Object.assign({},staffInfoSum.baseInfo)
        if(!!staffInfoSum.installInfo.type) {
          params.container_vehicle = staffInfoSum.installInfo
        }
        if(this.curChangeType == 'edit') {
          params.id = this.selectedId;
          if(!!staffInfoSum.installInfo.type)
          params.container_vehicle.container_id = this.selectedId
        }
        // 去空
        params = this.$outFormData(params)
        this.$emit('sure-save-info', params)
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
