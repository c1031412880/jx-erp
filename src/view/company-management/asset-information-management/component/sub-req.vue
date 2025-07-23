<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-row>
      <el-form-item label="资产编号：">
        <el-input @keyup.enter.native="onSubmit" v-model="form.material_code" placeholder="请输入内容" clearable></el-input>
      </el-form-item>
      <el-form-item label="资产名称：">
        <el-input @keyup.enter.native="onSubmit" v-model="form.material_name" placeholder="请输入内容" clearable></el-input>
      </el-form-item>
      <el-form-item label="规格型号：">
        <el-input @keyup.enter.native="onSubmit" v-model="form.specifications" placeholder="请输入内容" clearable></el-input>
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
        <el-select clearable v-model="form.state" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="resetForm()">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onBtn('add')">新建入库</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onBtn('delete')">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onBtn('import')">导入</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onBtn('export')">导出</el-button>
      </el-form-item>
    </el-row>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  props:{
    
  },
  components: { getDepartmentSelect },
  data() {
    return {
      options: [{value: '0',label: '闲置中'}, {value: '1',label: '使用中'}, {value: '2',label: '已报废'}],
      form: {
        material_code: '',
        material_name: '',
        specifications: '',
        dept_id: '',
        state: ''
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
      Object.assign(this.$data, this.$options.data());
      this.$refs.departmenTree.onClear()
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
