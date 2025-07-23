<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="党员姓名:">
          <el-input v-model="form.name" placeholder="请输入党员姓名" prefix-icon="el-icon-search" clearable></el-input>
        </el-form-item>
        <el-form-item label="人员类别:">
          <tr-select-dictionaries v-model="form.type" :classKey="'党员人员类别'" :placeholder="'人员类别'"></tr-select-dictionaries>
        </el-form-item>
        <el-form-item label="入党时间:">
          <el-date-picker
            v-model="form.join_party"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择结束日期">
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
          <el-button v-if="$isPowerShow('export')" @click="onBtn('export')" icon="el-icon-download"
            >导出</el-button
          >
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" v-if="$isPowerShow('add')">添加党员</el-button
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
import {getDate} from '@/utils/index'
export default {
  components: {},
  data() {
    return {
      form: {
        name: "",
        type: "",
        join_party: [],
      },
    };
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    selectedTime: function() {
      if(this.form.join_party && this.form.join_party.length>0) {
        this.form.join_party = this.$addTime(this.form.join_party)
      }},
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
    Reset(){
      Object.assign(this.$data.form, this.$options.data().form)
      this.onSubmit()
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
    // 打开自定义表头设置
    openSettingPage() {
      // this.Reset();
      this.$parent.openSettingPageEvent()
    },
    // 刷新
    refreshTableList() {
      this.Reset()
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
