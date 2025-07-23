<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="荣誉类型:">
            <!-- <el-input v-model="form.name" placeholder="请输入荣誉类型" style="width: 500px"></el-input> -->
            <el-select v-model="form.name" clearable placeholder="请选择">
              <el-option
                v-for="item in nameOptions"
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
          <el-button class="el-icon-plus" @click="addJob()" type="primary" v-if="$isPowerShow('add')"
            >添加荣誉</el-button
          >
        </el-form-item>
      </el-row>
      <!-- <el-row>
        <el-form-item>
          <el-button class="el-icon-plus" @click="addJob()" type="primary" v-if="$isPowerShow('add')"
            >添加荣誉</el-button
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
      </el-row> -->
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      nameOptions:[{
        value: '组织',
        label: '组织'
      }, {
        value: '党员',
        label: '党员'
      }],
      form: {
        name: "",
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
      this.$parent.restTableList();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 添加编辑
    addJob() {
      this.$emit("on-add", 'add');
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.form.name = "";
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
