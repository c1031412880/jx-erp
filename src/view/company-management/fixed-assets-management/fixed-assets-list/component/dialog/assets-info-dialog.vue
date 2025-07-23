<template>
  <el-dialog
    :title="showTitle"
    width="1120px"
    
    :before-close="dialogClose"
    :visible="dialogBool">
    <div class="dialog-box">
      <el-tabs v-model="activeName">
        <el-tab-pane label="资产信息" name="first">
          <set-info ref="setInfo" :curEventType="curEventType"></set-info>
        </el-tab-pane>
        <el-tab-pane v-if="curEventType == 'check'" label="资产使用记录" name="second">
          <assets-use-record ref="useRecord"></assets-use-record>
        </el-tab-pane>
      </el-tabs>
    </div>
    <span v-if="activeName == 'first' && curEventType != 'check'" slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogClose">取 消</el-button>
      <el-button size="small" type="primary" @click="saveAssetsInfo">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import setInfo from "../base-info/set-info";
import assetsUseRecord from "../base-info/assets-use-record/index";
export default {
  components: {
    setInfo,
    assetsUseRecord
  },
  props: {
    dialogBool: Boolean,
    curEventType: { 
      type: String,
      default: 'add'
    },
  },
  data() {
    return {
      showTitle: '查看',
      activeName: 'first'
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool) {
        this.configTitle();
        this.$nextTick(() => {
          this.$refs['setInfo'].clearValid();
        })
      }else {
        this.$refs['setInfo'].resetData();
        Object.assign(this.$data, this.$options.data());
      } 
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 设置dialog标题
    configTitle() {
      switch (this.curEventType) {
        case "check":
          this.showTitle = '查看资产'
          break;
        case "edit":
          this.showTitle = '编辑资产'
          break;
        case "borrow":
          this.showTitle = '资产领用'
          break;
        case "back":
          this.showTitle = '资产归还'
          break;
      }
    },
    // 回显
    setData(val) {
      setTimeout(() => {      
        this.$refs.setInfo.setData(val)
        if(this.curEventType == 'check') {
          this.$refs.useRecord.setData(val.id)
        }
      }, 30);
    },
    saveAssetsInfo() {
      let info = this.$refs.setInfo.getData()
      Promise.all([info]).then(res => {
        this.$emit('sure-save-info', res[0].formData)
      }).catch(err => {
        err.target
        err.msg && this.$message.warning(err.msg)
      })
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>