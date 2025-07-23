<template>
  <div v-cloak>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item label="物资编号:" prop="begin">
         <el-input @keyup.enter.native="onSubmit" v-model="form.material_code" clearable></el-input>
        </el-form-item>
        <el-form-item label="物资名称:" prop="begin">
         <el-input @keyup.enter.native="onSubmit" v-model="form.material_name" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="商品条码:" prop="begin">
         <el-input @keyup.enter.native="onSubmit" v-model="form.barcode" clearable></el-input>
        </el-form-item> -->
        <el-form-item label="规格型号:" prop="begin">
         <el-input @keyup.enter.native="onSubmit" v-model="form.specification" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="onSave('save')">保存</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      date:[],
      form: {
        material_code: '',
        material_name:'',
        // barcode:'',
        specification:'',
        usable:'1',
      },
    };
  },
  mounted() {
  },
  methods: {
    // 查询
    onSubmit() {
      let info = {...this.form};
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 500);
    },
    // 添加编辑
    onBtn(com) {
      this.$emit("on-add", com);
    },
    onSave() {
      this.$emit("on-save");
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
