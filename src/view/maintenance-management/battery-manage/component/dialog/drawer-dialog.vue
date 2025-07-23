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
          <!-- <el-col :span="12">
            <el-form-item label="生产厂家:" prop="made">
                <get-select-dictionaries v-model="form.made" :classKey="'电瓶生产厂家'" :placeholder="'请选择生产厂家'"></get-select-dictionaries>
              </el-form-item>
          </el-col> -->
          <el-col :span="10">
            <el-form-item label="购买日期:">
              <el-date-picker
                v-model="form.buy_date"
                type="date"
                :format="'yyyy-MM-dd'"
                :value-format="'yyyy-MM-dd'"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="demo-drawer__footer show-flex-box-r show-flex-center">
        <el-button icon="el-icon-refresh-left" @click="resetForm()">重置</el-button>
        <el-button icon="el-icon-search" type="primary" @click="onSubmit">查询</el-button>
      </div>
    </div>
    
    </el-drawer>
  </div>
</template>

<script>
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  data() {
    return {
      direction: 'rtl',
      form:{
        buy_date:''
      },
    };
  },
  components:{
    getSelectDictionaries
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
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
      this.dialogClose();
    },
    resetForm() {
      this.form.buy_date = '';
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
.advanced-filter /deep/ .el-date-editor{
  width: 180px;
}
</style>