<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="表单管理：">
          <el-input v-model="form.form_name" placeholder="搜索表单模板"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit('query')">查询</el-button>
        </el-form-item>
        <el-form-item style="float: right; height:47px; display: flex;">
          <el-button type="primary" icon="" @click="onSubmit('setup')" v-if="$isPowerShow('add_form')">创建新表单</el-button>
        </el-form-item>
        <el-form-item style="float: right; height:47px; display: flex;">
          <el-button  icon="" @click="onSubmit('order')" v-if="$isPowerShow('edit_formgroup')">分组排序</el-button>
        </el-form-item>
        <el-form-item style="float: right; height:47px; display: flex;">
          <el-button  icon="" @click="onSubmit('newgroup')" v-if="$isPowerShow('add_formgroup')">新建分组</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  components: { },
  data() {
    return {
      drawerdialogVisible: false,
      form: {
        form_name: "",
      },
    };
  },
  methods: {
    onSubmit(type) {
      if(type == 'query') {
        let info = {};
        for (let i in this.form) {
          if (this.form[i]) {
            info[i] = this.form[i];
          }
        }
        this.$emit("on-ok", info);
      } else{
        this.$emit(`on-${type}`);
      }
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
