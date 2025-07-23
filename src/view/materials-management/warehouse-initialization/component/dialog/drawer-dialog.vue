<!--  -->
<template>
  <div>
    <el-drawer
      title="高级筛选"
      :before-close="dialogClose"
      :visible.sync="drawer"
      :direction="direction"
      custom-class="demo-drawer"
      ref="drawer"
      size="40%"
    >
      <el-form>
        <el-row>
          <el-col :span="12">
            <el-form-item label="活动名称" label-width="100px">
              <el-input v-model="form.name1" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="活动名称" label-width="100px">
              <el-input v-model="form.name2" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24">
          <el-form-item label="活动区域" label-width="100px">
            <el-select v-model="form.name3" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="resetCondition">重 置</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name1: '',
        name2: '',
        name3: ''
      },
      direction: "rtl",
    };
  },
  props: {
    drawer: Boolean,
  },

  methods: {
    // 重置高级查询条件
    resetCondition(){
      this.form.name1 = '',
      this.form.name2 = '',
      this.form.name3 = '',
      this.dialogClose()
    },
    // 修饰符回调
    dialogClose() {
      // element组件的修饰符关闭方法(使用自己的)
      this.$emit("update:drawer", false);
    },
    submit(){
      this.$emit("on-submit-condition",this.form)
    }
  },
};
</script>
<style lang='scss' scoped>
.demo-drawer__footer{
  position: absolute;
  bottom: 0;
  margin-left: 20px;
  margin-bottom: 20px;
}
</style>