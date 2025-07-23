<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="会员姓名:">
          <el-input v-model="form.name" placeholder="搜索会员姓名" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="审核状态:">
          <el-select v-model="form.state" placeholder="请选择">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      form: {
        name:"",
        state:"",
      },
      stateOptions:[{
        value: 3,
        label: '已审核'
      }, {
        value: 4,
        label: '审核取消'
      }, {
        value: 2,
        label: '待审核'
      }, {
        value: 1,
        label: '待提交'
      }, {
        value: 5,
        label: '已撤销'
      }]
    };
  },
  mounted() {
  },
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
      this.form.name = "";
      // this.form.state = "";
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
