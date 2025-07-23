<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="活动名称:">
          <el-input v-model="form.name" placeholder="搜索活动名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="开始时间:" prop="start_date">
          <el-date-picker
            v-model="form.start_date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择开始时间日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间:" prop="end_date">
          <el-date-picker
            v-model="form.end_date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择结束时间日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动类别:">
          <el-select v-model="form.type" clearable  placeholder="请选择活动类别">
            <el-option label="主题党日活动" :value="1"></el-option>
            <el-option label="日常活动" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动属性:">
          <el-select v-model="form.nature" clearable  placeholder="请选择活动属性">
            <el-option label="线上" :value="1"></el-option>
            <el-option label="线下" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态:">
          <el-select v-model="form.state" clearable placeholder="请选择审核状态">
            <el-option label="待审核" :value="1"></el-option>
            <el-option label="已通过" :value="2"></el-option>
            <el-option label="未通过" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('reset')" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button class="el-icon-plus" @click="addBut()" type="primary" v-if="$isPowerShow('add')"
            >新增活动</el-button
          >
        </el-form-item>
        <div style="float: right; height: 47px; display: flex">
          <i
            class="el-icon-refresh"
            style="margin-right: 15px; cursor: pointer"
            @click="refreshTableList()"
          ></i>
          <i
            class="el-icon-s-tools"
            style="cursor: pointer"
            @click="openSettingPage()"
          ></i>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      form: {
        name: "",
        start_date: "",
        end_date: "",
        type: "",
        nature: "",
        state: "",
      },
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
      if(info.end_date) {
        info.end_date = info.end_date + ' 23:59:59'
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm(type) {
      Object.assign(this.$data, this.$options.data());
      this.onSubmit();
      if(type == 'reset') {
        setTimeout(() => {
          this.$message({ message: "重置成功", type: "success" });
        }, 50);
      }
      
    },
    // 添加编辑
    addBut() {
      this.$emit("on-add", 'add');
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.resetForm();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
