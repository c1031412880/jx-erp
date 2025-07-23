<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-form-item label="资产编号：">
      <el-input @keyup.enter.native="onSubmit" v-model="form.assets_code" placeholder="请输入内容" clearable></el-input>
    </el-form-item>
    <el-form-item label="资产名称：">
      <el-input @keyup.enter.native="onSubmit" v-model="form.assets_name" placeholder="请输入内容" clearable></el-input>
    </el-form-item>
    <el-form-item label="规格型号：">
      <el-input @keyup.enter.native="onSubmit" v-model="form.model" placeholder="请输入内容" clearable></el-input>
    </el-form-item>
    <el-form-item label="使用部门：">
      <get-department-select
        ref="departmenTree"
        v-model="form.dept_id"
        :isShowCheckbox="false"
        :placeholder="'请选择部门'"
        :isContainEmp="false"
        :isExportMultiple="false"
      ></get-department-select>
    </el-form-item>
    <el-form-item label="资产状态：">
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
      <el-button type="primary" icon="el-icon-search" v-if="$isPowerShow('search')" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-refresh-right" v-if="$isPowerShow('search')" @click="resetForm()">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-s-tools" v-if="$isPowerShow('set')" @click="onBtn('set')">报废提醒设置</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getSupplierList from "@/components/base/formModel/select/get-supplier-list";
export default {
  components: { getDepartmentSelect, getSelectDictionaries, getSupplierList },
  data() {
    return {
      form: {
        assets_code: '',
        assets_name: '',
        model: '',
        dept_id: '',
        supplier_id: '',
        state: [0,1,3,4],
      },
      putOptions: [
        {value: 0, label: '闲置中'},
        {value: 1, label: '使用中'},
        {value: 2, label: '已报废'},
        {value: 3, label: '待报废'},
        {value: 4, label: '审批中'},
      ],
    }
  },
  mounted() {

  },
  methods: {
    onSubmit() {
      let info = {}
      for(let key in this.form) {
        if(this.form[key] || this.form[key] == '0') info[key] = this.form[key]
      }
      this.$emit("on-ok", info);
    },
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      this.$refs.departmenTree.onClear()
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 500);
    },
    onBtn(type) {
      this.$emit('on-' + type)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>