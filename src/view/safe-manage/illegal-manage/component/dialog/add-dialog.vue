<template>
  <el-dialog :visible="dialogBool" :title="showTitle" :before-close="dialogClose" width="620px" :close-on-click-modal="false" :append-to-body="appendToBody">
    <div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="违法信息" name="first">
          <base-info ref="baseInfo" :curChangeType="curChangeType"></base-info>
        </el-tab-pane>
        <el-tab-pane label="违法证据" name="second">
          <accident-data ref="accidentData" :curChangeType="curChangeType"></accident-data>
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
import accidentData from '../main-info/accident-data.vue';
export default {
  components: {
    baseInfo,
    accidentData,},
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
        this.$refs['accidentData'].resetData()  // 违法证据信息清除
      },60)
      
    },
    // 编辑时数据回显  
    setData(val){
      let info = JSON.parse(JSON.stringify(val))
      this.selectedId = info.i_id
      setTimeout(() => {
        this.$refs['baseInfo'].setData(info)
        this.$refs['accidentData'].setData(info)        
      }, 60);
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    submitFormData() {
      const getFormData = name => this.$refs[name].getData()
      const baseInfo = getFormData('baseInfo')
      // console.log(baseInfo)
      const accidentData = getFormData('accidentData')
      // console.log(accidentData)

      Promise.all([baseInfo,accidentData])
      .then(res => {
        const allInfoSum = {
          baseInfo: res[0].formData,
          accidentData: res[1].formData,
        }
        // 合并信息
        let params = Object.assign({},allInfoSum.baseInfo,allInfoSum.accidentData)
        // console.log(params)
        // return

        if(this.curChangeType == 'edit') {
          params.i_id = this.selectedId;
        }

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
