<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-form-item label="驾驶员">
        <get-driver-select-tree
          ref="driverTree"
          v-model="form.driver_ids"
          :isShowCheckbox="true"
          :placeholder="'请选择驾驶员'"
          :isExportMultiple="true"
          :isCheckStrictly="false"
        ></get-driver-select-tree>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="form.is_working" :true-label="0" :false-label="1">仅显示在职驾驶员</el-checkbox>
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
          type="" 
          @click="resetForm"
          icon="el-icon-refresh-right"
        >重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button 
          type="primary" 
          @click="onBtn('add')"
          v-if="$isPowerShow('add')" 
        >添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button 
          type="primary" 
          icon="el-icon-download" 
          v-if="$isPowerShow('export')" 
          @click="onBtn('export')">导出</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
export default {
  components: { 
    getDriverSelectTree
  },

  data() {
    return {
      form: {
        driver_ids: [],
        is_working: 0,
      },
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.onSubmit()
    })
  },
  methods: {
    // 查询
    onSubmit () {
      let info = this.$outFormData(this.form)
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      Object.assign(this.$data.form, this.$options.data().form)
      this.$refs.driverTree.onClear()
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 100);
    },
    // 事件抛出
    onBtn(type) {
      this.$emit(`on-${type}`, type);
    },
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>