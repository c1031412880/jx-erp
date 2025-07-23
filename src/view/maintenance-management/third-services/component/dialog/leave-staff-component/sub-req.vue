<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-input v-model="form.c_name" placeholder="员工姓名" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
           <get-department-select
            ref="tree"
            v-model="form.i_department_base"
            :isContainEmp="isContainEmp"
            @on-change="onSelectChange"
          ></get-department-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="form.d_dimission_date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择离职日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button  @click="Reset" icon="el-icon-refresh-left"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-download"
            >导出</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: { getDepartmentSelect },
  data() {
    return {
      isContainEmp: false, //是否显示部门下的人员
      date: [],
      form: {
        c_name: "",
        i_department_base: [],
        d_dimission_date: '',
      },
    };
  },
  mounted() {
  },
  methods: {
    onSelectChange(vehs, nodes) {
      // alert(JSON.stringify(nodes))
      if (nodes && nodes.length > 0) {
        // nodes.forEach((item, index) => {
        //   delete item.children;
        // });
        // this.ruleForm.reminders = nodes;
      } else {
        // this.ruleForm.reminders = [];
      }
    },
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i] && this.form[i].length > 0) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(){
      this.form.c_name = "",
      this.form.i_department_base = [],
      this.form.d_dimission_date = '',
      this.onSubmit()
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
