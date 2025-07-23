<template>
  <el-dialog :visible="dialogBool" :title="showTitle" :before-close="dialogClose" width="820px" :close-on-click-modal="false" :append-to-body="appendToBody">
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="事故基本信息" name="first">
          <base-info ref="baseInfo" :curChangeType="curChangeType" :dialogBool="dialogBool"></base-info>
        </el-tab-pane>
        <el-tab-pane label="人伤" name="second" v-if="curChangeType != 'add'">
          <casualties-info ref="casualtiesInfo" :curChangeType="curChangeType"></casualties-info>
        </el-tab-pane>
        <el-tab-pane label="车损" name="third" v-if="curChangeType != 'add'">
          <car-damage-info ref="carDamageInfo" :curChangeType="curChangeType"></car-damage-info>
        </el-tab-pane>
        <el-tab-pane label="事故资料" name="fourth" v-if="curChangeType != 'add'">
          <accident-data ref="accidentData" :curChangeType="curChangeType"></accident-data>
        </el-tab-pane>
        <el-tab-pane label="理赔" name="five" v-if="curChangeType != 'add'">
          <claim-settlement ref="claimSettlement" :curChangeType="curChangeType"></claim-settlement>
        </el-tab-pane>
        <el-tab-pane label="事故费用" name="six" v-if="curChangeType != 'add'">
          <accident-cost ref="accidentCost" :curChangeType="curChangeType"></accident-cost>
        </el-tab-pane>
        <el-tab-pane label="事故处理" name="seven" v-if="curChangeType != 'add' && $isPowerShow('handle_acc')">
          <law-finish ref="lawFinish" :curChangeType="curChangeType"></law-finish>
        </el-tab-pane>
        <el-tab-pane label="事故教育" name="eight" v-if="curChangeType != 'add'">
          <accident-education ref="education" :curChangeType="curChangeType"></accident-education>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div slot="footer" class="dialog-footer" v-if="curChangeType != 'detail' && (['first','six','seven','eight'].includes(activeName))">
      <el-button @click="dialogClose" v-if="activeName ==  'first'">取 消</el-button>
      <el-button type="primary" @click="submitFormData('save')" v-if="curChangeType == 'edit'">仅保存</el-button>
      <el-button type="primary" @click="submitFormData('saveAndClose')">{{curChangeType == 'add'? '保 存':'保存并提交'}} </el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import baseInfo from '../main-info/base-info';
import casualtiesInfo from '../main-info/casualties-info.vue';
import carDamageInfo from '../main-info/car-damage-info.vue';
import accidentData from '../main-info/accident-data.vue';
import claimSettlement from '../main-info/claim-settlement.vue';
import lawFinish from '../main-info/law-finish.vue';
import accidentCost from '../main-info/accident-cost.vue';
import accidentEducation from '../main-info/accident-education';
export default {
  components: {
    baseInfo,
    casualtiesInfo,
    carDamageInfo,
    accidentData,
    claimSettlement,
    lawFinish,
    accidentCost,
    accidentEducation
  },
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
  },
  data() {
    return {
      selectedId: '', //当前操作的事故记录ID
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
        this.configAddStaffInfo();
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
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
        if(this.curChangeType != 'add') {
          this.$refs['casualtiesInfo'].resetData()  // 伤亡信息清除
          this.$refs['carDamageInfo'].resetData()  // 车损信息清除
          this.$refs['accidentData'].resetData()  // 事故资料信息清除
          this.$refs['claimSettlement'].resetData()  // 事故理赔清除
          this.$refs['accidentCost'].resetData()  // 事故费用清除
          this.$refs['lawFinish'].resetData()  // 结案信息清除
          this.$refs['education'].resetData()  // 事故教育
        }
      },60)
      
    },

    // 编辑时数据回显  
    setData(val){
      this.selectedId = val.i_id
      setTimeout(() => {
        this.$refs['baseInfo'].setData(val)
        this.$refs['casualtiesInfo'].setData(val)
        this.$refs['carDamageInfo'].setData(val)
        this.$refs['accidentData'].setData(val)
        this.$refs['claimSettlement'].setData(val)
        this.$refs['accidentCost'].setData(val)
        this.$refs['lawFinish'].setData(val)
        this.$refs['education'].setData(val)
        // if(this.curChangeType == 'detail') {
        // }
        
      }, 60);
    },
    submitFormData(type) {
      const getFormData = name => this.$refs[name].getData()
      let promiseAllArr = [];
      const baseInfo = getFormData('baseInfo')
      promiseAllArr.push(baseInfo)
      if(this.curChangeType == 'edit') {
        const accidentCost = getFormData('accidentCost')
        promiseAllArr.push(accidentCost)
        if(this.$isPowerShow('handle_acc')) {
          const lawFinish = getFormData('lawFinish')
          promiseAllArr.push(lawFinish)
        }
        const education = getFormData('education')
        promiseAllArr.push(education)

      }
      Promise.all(promiseAllArr)
      .then(res => {
        const accidentInfoSum = {
          baseInfo: res[0].formData,
          accidentCost: this.curChangeType == 'edit'? res[1].formData :{},
          lawFinish:  (this.curChangeType == 'edit' && this.$isPowerShow('handle_acc'))? res[2].formData: {},
          education: this.curChangeType == 'edit'? res[3].formData :{},
        }
        console.log(res)
        let approveStepList = (this.curChangeType == 'edit' && this.$isPowerShow('handle_acc'))? res[2].approveStepList: []
        // 合并信息
        let params = Object.assign({},accidentInfoSum.baseInfo, accidentInfoSum.accidentCost,accidentInfoSum.lawFinish,accidentInfoSum.education)

        if(params.i_result_mile === 1) {
          params.n_result_mile = null
        }
        // console.log(params)
        // return

        if(this.curChangeType == 'edit') {
          params.i_id = this.selectedId;
        }
        params.is_save_file = true, //web独有表示让后端知道标记不清除图片资料

        this.$emit('sure-save-info', params,type, approveStepList)
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
