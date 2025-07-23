<!--
 * @Author: your name
 * @Date: 2021-09-24 10:11:07
 * @LastEditTime: 2021-09-24 15:03:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ErpWebVue\src\view\safe-manage\driver-violation\component\dialog\req.vue
-->
<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-input v-model="form.c_name" placeholder="请输入故障项目名称" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit" :disabled="isSort"
            >查询</el-button
          >
        </el-form-item>
        
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  props:{
    isSort:{
      type: Boolean,
      default: false,
    },
  
  },
  components: { getDepartmentSelect },
  data() {
    return {
      form: {
        c_name: "",
      },
    };
  },
  mounted() {},
  methods: {
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
  },
  watch:{
  
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
