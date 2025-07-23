<!--  -->
<template>
  <div>
    <el-drawer
      title="高级筛选"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="dialogClose"
      size="650px"
    >
    <div class="advanced-filter">
      <el-form ref="form" :model="form"  label-width="80px">
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="厂牌:">
                <el-input v-model="form.engine_firm" placeholder="请输入厂牌" clearable></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="购买日期:">
              <el-date-picker
                v-model="form.d_buy"
                type="date"
                :format="'yyyy-MM-dd'"
                :value-format="'yyyy-MM-dd'"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属组织:">
              <get-department-select
                ref="tree"
                v-model="form.department_ids"
                :placeholder="'请选择所属组织'"
                :isContainEmp="false"
              ></get-department-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="demo-drawer__footer show-flex-box-r show-flex-center">
        <el-button icon="el-icon-refresh-left" @click="resetForm('form')">重置</el-button>
        <el-button icon="el-icon-search" type="primary" @click="onSubmit">查询</el-button>
      </div>
    </div>
    
    </el-drawer>
  </div>
</template>

<script>
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components:{
    getDepartmentSelect
  },
  data() {
    return {
      input_names: '',
      direction: 'rtl',
      fuelTypeOptions:[
        {
          value: '家用电器',
          label: '家用电器'
        }
      ],
      form:{
        engine_firm:'',
        d_buy:'',
        department_ids:[]
      },
    };
  },
  props: {
    drawer: Boolean,
  },

  watch: {
    drawer(bool) {
      if (bool === false) {
        this.$refs.tree.onClear()
        Object.assign(this.$data, this.$options.data());
      }
    }
  },

  methods: {
    // 修饰符回调
    dialogClose() {
      // element组件的修饰符关闭方法(使用自己的)
      this.$emit("update:drawer", false);
    },
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
      this.dialogClose();
    },
    resetForm(formName) {
      // 清空组织选中
       this.$refs.tree.onClear()
       Object.assign(this.$data, this.$options.data());
    }
  },
};
</script>
<style lang='scss' scoped>
.advanced-filter{
  padding: 0 40px;
}
.demo-drawer__footer{
  margin-top: 40px;
}
.advanced-filter /deep/ .el-date-editor{
  width: 180px;
}
</style>