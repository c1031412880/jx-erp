<template>
  <div class="sub-req">
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="姓名:">
          <get-user-select-tree
            ref="userTree"
            v-model="user_ids"
            placeholder="请选择人员"></get-user-select-tree>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary"
            @click="onSubmit" 
            icon="el-icon-search" 
            >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary" 
            @click="resetForm"  
            icon="el-icon-refresh-right"
            >重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="onBtn('export')"
            v-if="$isPowerShow('export')"
            class="el-icon-upload2"  
            >导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
import getUserSelectTree from 'components/base/formModel/tree/get-user-select-tree'
export default {
  components: { 
    getUserSelectTree,
  },

  data() {
    return {
      user_ids: '',
    }
  },
  mounted() {

  },
  methods: {
    // 查询
    onSubmit () {
      let info = this.$outFormData(this.user_ids)
      this.$emit("on-ok", info);
    },
    
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data())
      this.$refs.userTree.onClear()
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 100);
    },

    // 导出Excel
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.sub-req {
  margin-top: 10px;
}
</style>