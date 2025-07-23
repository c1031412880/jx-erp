<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="场站名称:">
          <el-input v-model="form.name" placeholder="搜索场站名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="场站状态:">
          <el-select v-model="form.state" clearable placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
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
            >新增</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="deleteJob()" v-if="$isPowerShow('del')">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="exportInfo()" v-if="$isPowerShow('export')">导出</el-button>
        </el-form-item>
      </el-row>
      <!-- <el-row>
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
      </el-row> -->
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      options: [{
        value: 0,
        label: '启用'
      }, {
        value: 1,
        label: '停用'
      }],
      form: {
        name:"",
        state:"",
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
      if(this.form.state === 0) {
        info.state = 0
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.form.name = "";
      this.form.state = "";
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
    // 导出场站信息
    exportInfo() {
      this.$emit('on-export')
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.form.name = "";
      this.form.state = "";
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
