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
    <div class="advanced-filter ">
      <el-form ref="form" :model="form"  label-width="80px">
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="座位数:" prop="seats_num">
              <el-input v-model="form.seats_num" placeholder="请输入座位数"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="核载数:" prop="permit_num">
              <el-input v-model="form.permit_num" placeholder="请输入核载数"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="排量(ml):" prop="displacement">
              <el-input v-model="form.displacement" placeholder="请输入排量(ml)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排放标准:" prop="standard">
              <get-select-dictionaries v-model="form.standard" :classKey="'排放标准'" :placeholder="'请选择排放标准'"></get-select-dictionaries>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="燃料类型:" prop="fuel">
              <get-select-dictionaries v-model="form.fuel" :classKey="'燃料类别'" :placeholder="'请选择燃料类型'"></get-select-dictionaries>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row> -->
      </el-form>

      <div class="demo-drawer__footer">
        <el-button icon="el-icon-refresh-left" @click="resetForm('form')">重置</el-button>
        <el-button icon="el-icon-search" type="primary" @click="onSubmit">查询</el-button>
      </div>
    </div>
    
    </el-drawer>
  </div>
</template>

<script>
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: { getSelectDictionaries },
  data() {
    return {
      input_names: '',
      direction: 'rtl',
      form:{
        seats_num:'',
        permit_num:'',
        displacement:'',
        standard:'',
        fuel:''
      },
    };
  },
  props: {
    drawer: Boolean,
  },

  watch: {
    drawer(bool) {
      if (bool === false) {
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
      let info = this.$outFormData(this.form)
      this.$emit("on-ok", info);
      this.dialogClose();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      // this.$parent.informationDialogOk();
      // setTimeout(() => {
      //   this.$message({ message: "重置成功", type: "success" });
      // }, 50);
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
</style>