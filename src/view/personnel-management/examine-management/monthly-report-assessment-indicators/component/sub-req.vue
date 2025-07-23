<template>
  <div>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item label="添加时间">
          <el-date-picker
            v-model="form.year"
            style="width: 100%;"
            type="year"
            value-format="yyyy"
            placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" v-if="$isPowerShow('add')" icon="el-icon-plus">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('remind')" v-if="$isPowerShow('remind')">提醒设置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props:{
  },
  components: {},
  data() {
    return {
      form: {
        year:'',
      },
      date: []
    };
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    // 查询
    onSubmit() {
      let info = this.form
      console.log(info);
      this.$emit("on-ok", info);
    },
    // 添加编辑
    onBtn(com) {
      this.$emit("on-add", com);
    },
    resetForm() {
      this.form.year = ''
      this.onSubmit()
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
