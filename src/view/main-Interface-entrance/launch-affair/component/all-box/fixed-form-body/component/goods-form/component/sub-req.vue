<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-row>
      <el-form-item label="物品编号：">
        <el-input v-model="form.goods_code" placeholder="请输入物品编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="物品名称：">
        <el-input v-model="form.goods_name" placeholder="请输入物品名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="供应商：">
        <get-supplier-list 
          style="width:100%"
          v-model="form.supplier_id" 
          :placeholder="'请选择供应商'">
        </get-supplier-list>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="" @click="resetForm()">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onBtn('add')">确定</el-button>
      </el-form-item>
    </el-row>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getSupplierList from "@/components/base/formModel/select/get-supplier-list";
export default {
  props:{},
  components: { getSupplierList },
  data() {
    return {
      form: {
        goods_code: '',
        goods_name: '',
        supplier_id: ''
      },
    };
  },
  methods: {
    // 查询
    onSubmit() {
      let info = {...this.form};
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      this.$emit('on-clear')
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 500);
    },
    // 新建导出导入
    onBtn(com) {
      this.$emit("on-add", com);
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
