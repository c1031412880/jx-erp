<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="全部表单"></el-form-item>
        <el-form-item style="float: right; height:47px; display: flex;">
          <el-button type="primary" icon="el-icon-plus" @click="onSubmit('setup')" v-if="$isPowerShow('add_form')">创建新表单</el-button>
        </el-form-item>
        <el-form-item style="float: right; height:47px; display: flex;">
          <el-button  icon="" @click="onSubmit('order')" v-if="$isPowerShow('edit_formgroup')">分组排序</el-button>
        </el-form-item>
        <el-form-item style="float: right; height:47px; display: flex;">
          <el-button  icon="" @click="onSubmit('newgroup')" v-if="$isPowerShow('add_formgroup')">新建分组</el-button>
        </el-form-item>
        <el-form-item  style="float: right; height:47px; display: flex;">
          <el-input prefix-icon="el-icon-search" clearable v-model="form.form_name" placeholder="搜索表单模板"></el-input>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {  
  data() {
    return {
      drawerdialogVisible: false,
      disabled: false,
      form: {
        form_name: "",
      },
    };
  },
  watch: {
    'form.form_name'(newValue) {
      if (!newValue) {
        this.disabled = false
        this.$parent.loadData()
      }else {
        this.disabled = true
        this.onSubmit('ok')
      }
    }
  },
  methods: {
    onSubmit(type) {
      this.$emit(`on-${type}`, this.form, this.disabled);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
/deep/ .el-form-item__label {
  font-size 18px;
  color #333333;
  line-height 25px
  font-weight 700 
  margin-left 10px
}
</style>
