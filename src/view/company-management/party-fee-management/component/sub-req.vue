<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="党组织名称:">
          <el-input v-model="form.organ_name" placeholder="搜索党组织名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="缴纳月份:">
          <el-date-picker
            v-model="form.month"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="请选择缴纳月份">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="房源类型:">
          <tr-select-dictionaries v-model="form.type" :classKey="'房源类型'" :placeholder="'房源类型'"></tr-select-dictionaries>
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
        <el-form-item>
          <el-button @click="onBtn('import')" icon="el-icon-upload2" v-if="$isPowerShow('import')"
            >导入</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button class="el-icon-plus" @click="addInfo()" type="primary" v-if="$isPowerShow('add')"
            >新增党费</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button class="el-icon-plus" @click="setProportion()" type="primary" v-if="$isPowerShow('proportionSet')"
            >比例设置</el-button
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
        organ_name: "",
        month: "",
      },
    };
  },
  mounted() {
  },
  methods: {
    onBtn(type) {
      this.$emit(`onbtn-${type}`)
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
      this.form.organ_name = "";
      this.form.month = "";
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 添加编辑
    addInfo() {
      this.$emit("on-add", 'add');
    },
    // 设置比例
    setProportion() {
      this.$emit("on-set-proportion");
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.form.organ_name = "";
      this.form.month = "";
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
