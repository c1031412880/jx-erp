<template>
  <div>
    <table-sub-req
      :isShowAdvancedFiltering="true"
      @reset-form="resetAdvancedFilteringForm"
      @onBtn="onBtn"
    >
      <!-- 第一行插槽 -->
      <span slot='firstLine'>
        <el-form-item label="添加时间:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="模板名称1:">
          <el-input v-model="form.c_name" placeholder="搜索模板名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="模板名称1:">
          <el-input v-model="form.c_name" placeholder="搜索模板名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="模板名称1:">
          <el-input v-model="form.c_name" placeholder="搜索模板名称" clearable></el-input>
        </el-form-item>
      </span>
      <!-- 第二行左边插槽 -->
      <span slot='secondLineLeft'>
        <el-form-item label="模板名称1:">
          <el-input v-model="form.c_name" placeholder="搜索模板名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="模板名称1:">
          <el-input v-model="form.c_name" placeholder="搜索模板名称" clearable></el-input>
        </el-form-item><el-form-item label="模板名称1:">
          <el-input v-model="form.c_name" placeholder="搜索模板名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="模板名称1:">
          <el-input v-model="form.c_name" placeholder="搜索模板名称" clearable></el-input>
        </el-form-item>
      </span>
       <!-- 第二行右边边插槽 -->
      <span slot='secondLineRight'>
      </span>

      <!-- 弹窗插槽 -->
      <div slot='drawerDialogContent'>
        <el-form :inline="true" size="mini" label-width="120px">
          <el-row class="show-flex-box-r">
            <el-form-item label="模板名称1:">
              <el-input v-model="form.c_name" placeholder="搜索模板名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="模板名称1:">
              <el-input v-model="form.c_name" placeholder="搜索模板名称" clearable></el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </div>
      
    </table-sub-req>
  </div>
</template>

<script type="text/ecmascript-6">
import tableSubReq from '@/components/tableHeadercustomSetting/table-sub-req'
export default {
  components:{
    tableSubReq
  },
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
    // com 参数  submit查询 reset重置 add添加  delete删除 import导入 export导出 refresh刷新 custom-header打开自定义设置表头
    onBtn(com) {
      // 查询需要带参数特殊处理
      if(com == 'submit') {this.onSubmit()}
      else if(com == 'reset'){this.resetForm()}
      else if(com == 'refresh'){this.refreshTableList()}
      else{this.$emit(`on-${com}`);}
    },
    // 查询
    onSubmit() {
      let info = this.$outFormData(this.form)
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.form.c_name = "";
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
     // 刷新列表
    refreshTableList() {
      this.form.c_name = "";
    
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 300);
    },
    // 重置高级筛选弹窗
    resetAdvancedFilteringForm() {

    },
    // 添加编辑
    addInfo() {
      this.$emit("on-add", 'add');
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
