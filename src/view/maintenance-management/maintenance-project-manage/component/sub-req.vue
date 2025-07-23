<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-input v-model="form.c_name" placeholder="请输入维修项目名称" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit" :disabled="isSort"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetForm()" icon="el-icon-refresh-left" :disabled="isSort"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" :disabled="isSort" v-if="$isPowerShow('add')"
            >添加</el-button
          >
        </el-form-item>

         <el-form-item>
          <el-popconfirm
            @confirm="onBtn('delete')"
            title="确定删除选中的维修项目吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="primary" icon="el-icon-delete" size="mini" :disabled="isSort">删除</el-button>
          </el-popconfirm>
        </el-form-item>

         <el-form-item>
          <el-button type="primary" @click="onBtn('import')" icon="el-icon-download" :disabled="isSort" v-if="$isPowerShow('import')"
            >导入</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('export')" icon="el-icon-upload2" :disabled="isSort" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
        <el-form-item v-if="isShowSortButton">
          <el-button type="primary" @click="adjustSortSet" v-if="$isPowerShow('sort')">{{!isSort? '调整排序':'保存排序'}} </el-button>
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
    isShowSortButton:{
      type: Boolean,
      default: true,
    },
    curSelectedDepartment:[Object]
  },
  components: { getDepartmentSelect },
  data() {
    return {
      form: {
        c_name: ""
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
    // 重置
    resetForm() {
      this.form.c_name = "";
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 500);
    },
    // 添加编辑
    onBtn(com) {
      this.$emit("on-add", com);
    },
    // 调整排序
    adjustSortSet() {
      this.$emit("adjust-sort-set", this.isSort)
    },
  },
  watch:{
    curSelectedDepartment: {
      handler(newVal, oldVal){
        this.form.c_name = "" 
      },
      deep: true 
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
