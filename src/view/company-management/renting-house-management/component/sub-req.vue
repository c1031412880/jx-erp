<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="租房名称:">
          <el-input v-model="form.name" placeholder="搜索租房名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="房源状态:">
          <el-select v-model="form.state" placeholder="请选择房源状态">
            <el-option label="未出租" :value="1"></el-option>
            <el-option label="已出租" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="联系人:">
          <el-input v-model="form.person_name" placeholder="搜索联系人名称" clearable></el-input>
        </el-form-item> -->
        <el-form-item label="房源类型:">
          <tr-select-dictionaries v-model="form.type" :classKey="'房源类型'" :placeholder="'房源类型'"></tr-select-dictionaries>
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
      </el-row>
      <el-row>
        <el-form-item>
          <el-button class="el-icon-plus" @click="addJob()" type="primary" v-if="$isPowerShow('add')"
            >发布房源</el-button
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
        state: "",
        person_name: "",
        type: ""
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
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.form.name = "";
      this.form.state = "";
      this.form.person_name = "";
      this.form.type = "";
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 添加编辑
    addJob() {
      this.$emit("on-add", 'add');
    },
    deleteJob() {
      this.$emit("delete-Job");     
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.form.name = "";
      this.form.state = "";
      this.form.person_name = "";
      this.form.type = "";
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
