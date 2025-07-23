<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="会议室名称:">
          <el-input v-model="form.name" placeholder="搜索会议室名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="会议室负责人:">
          <el-input v-model="form.duty_name" placeholder="搜索会议室负责人" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否需要审批:">
          <el-select v-model="form.need_check" placeholder="请选择是否需要审批">
            <el-option
              v-for="item in conditionOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
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
          <el-button @click="addJob()" type="primary" v-if="$isPowerShow('add')"
            >添加会议室</el-button
          >
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary"  @click="deleteJob()" v-if="$isPowerShow('del')">删除会议室</el-button>
        </el-form-item> -->
      <!-- </el-row>
      <el-row> -->
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
      conditionOptions:[ //
        { value: 1, name: "无需审批" },
        { value: 0, name: "需要审批" }
      ],
      form: {
        name: '',
        duty_name: '',
        need_check: '',
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
      if(this.form.need_check === 0) {
        info.need_check = 0
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.form.name = "";
      this.form.duty_name = "";
      this.form.need_check = "";
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
      this.$parent.restTableList();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
