<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="考核名称:">
          <el-input v-model="form.c_name" placeholder="搜索考核名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="考核时间:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
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
        <el-form-item>
          <el-button @click="addInfo()" type="primary"
            >添加</el-button
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
      date:[],
      form: {
        c_name:"",
        beign: "",
        end: "",
      },
    };
  },
  mounted() {
  },
  methods: {
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date);
        this.form.begin = this.date[0];
        this.form.end = this.date[1];
      }else{
        this.form.begin = '';
        this.form.end = '';
      }
    },
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
      this.$parent.restTableList();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 添加编辑
    addInfo() {
      this.$emit("on-add", 'add');
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
