<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-row>
      <el-form-item label="资产编号：" v-if="!curType">
        <el-input v-model="form.assets_code" placeholder="请输入资产编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="资产名称：">
        <el-input v-model="form.assets_name" placeholder="请输入资产名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="资产状态：" v-if="!!curType">
        <!-- <get-select-dictionaries v-model="form.state" :classKey="'资产状态'" :placeholder="'请选择状态'"></get-select-dictionaries> -->
        <el-select v-model="form.state" clearable multiple collapse-tags placeholder="请选择资产状态">
          <el-option
            v-for="item in putOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getSupplierList from "@/components/base/formModel/select/get-supplier-list";
export default {
  props: {
    curType: {
      type: Boolean,
      default: false
    }
  },
  components: {
    getSelectDictionaries,
    getSupplierList
  },
  data() {
    return {
      form: {
        assets_code: '',
        assets_name: '',
        supplier_id: '',
        state: [],
      },
      putOptions: [
        {value: 0, label: '闲置中'},
        {value: 1, label: '使用中'},
        {value: 2, label: '已报废'},
        {value: 3, label: '待报废'},
        {value: 4, label: '审批中'},
      ],
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
