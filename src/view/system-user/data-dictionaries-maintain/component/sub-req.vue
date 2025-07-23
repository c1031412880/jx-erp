<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit" :disabled="isSort">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" :disabled="isSort">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm
          @confirm="onBtn('delete')"
          title="确定删除选中的字典吗？">
          <el-button slot="reference" type="primary" icon="el-icon-delete" size="mini" :disabled="isSort">删除</el-button>
        </el-popconfirm>
      </el-form-item>
      <el-form-item v-if="isShowSortButton">
        <el-button type="primary" @click="adjustSortSet">{{!isSort? '调整排序':'保存排序'}} </el-button>
      </el-form-item>
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
      this.$emit("on-ok");
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
      this.$emit(`on-${com}`);
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
