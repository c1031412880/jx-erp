<template>
  <div>
    <el-dialog :visible="dialogBool" :title="showTitle" :before-close="dialogClose" width="1060px"  >
      <div class="el-dialog-div">
        <el-tabs v-model="activeName">
          <el-tab-pane label="维修详情" name="first">
            <detail-maintain ref="detailInfo" :curChangeType="curChangeType"></detail-maintain>
          </el-tab-pane>
          <el-tab-pane label="配件出库" v-if="curChangeType === 'search'"  name="second">
            <parts-out ref="partsOut"></parts-out>
          </el-tab-pane>
          <el-tab-pane label="维修历史记录" v-if="curChangeType === 'search'" name="third">
            <change-record ref="changeRecord"></change-record>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-if="curChangeType !== 'search'" slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogClose">取 消</el-button>
        <el-button type="primary" size="small" @click="submitFormData">保 存</el-button>
      </div>
    </el-dialog>
  </div>
  
</template>

<script type="text/ecmascript-6">
import detailMaintain from "./base-info/detail-maintain"
import partsOut from "./base-info/parts-out"
import changeRecord from "./base-info/change-record"
export default {
  components: {
    detailMaintain,
    partsOut,
    changeRecord,
  },
  props: {
    dialogBool: Boolean,
    curChangeType: {
      type: String,
      default: 'add' //add添加  edit编辑  detail详情
    },
  },
  data() {
    return {
      activeName: 'first',
      showTitle:'添加',
    }
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
      this.showTitle = this.curChangeType == 'add' ? '添加' : this.curChangeType == 'edit' ? '编辑' : '详情'
    },
    // 关闭弹窗
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 提交
    submitFormData() {
      const getFormData = name => this.$refs[name].getData()
      const detailInfo = getFormData('detailInfo')
      Promise.all([detailInfo])
      .then(res => {
        console.log(res);
        let info = JSON.parse(JSON.stringify(res[0].formData))
        this.$emit('sure-save', info) 
        // setTimeout(() => {        
        //   this.$refs.detailInfo.resetData()
        // }, 30);
      })
      .catch(err => {
        err.target
        err.msg && this.$message.warning(err.msg)
      })
    },
    // 重置
    resetData(){
      setTimeout(() => {
        this.$refs['detailInfo'].resetData()
        if(this.curChangeType == 'search') {
          // this.$refs['repairlist'].resetData()  
          // this.$refs['growUp'].resetData()
        }
      },60)
    },
    // 编辑时数据回显  
    setData(val){
      setTimeout(() => {
        this.$refs['detailInfo'].setData(val)
        if(this.curChangeType == 'search') {
          this.$refs['partsOut'].setData(val)
          this.$refs['changeRecord'].setData(val)    
        }
      }, 300);
    },
    getShop() {
      this.$refs['detailInfo'].getShop()
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>