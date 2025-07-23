<template>
  <div>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item label="检查项目名称:">
         <el-input v-model="form.check_name" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" v-if="$isPowerShow('add')">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-popconfirm
            @confirm="onBtn('delete')"
            title="确定删除选中的检查内容吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="primary" icon="el-icon-delete" size="mini">删除</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('import')" icon="el-icon-download" v-if="$isPowerShow('import')">导入</el-button>
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
        check_name:'',
      },
    };
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    // 查询
    onSubmit() {
      let info = {...this.form};
      this.$emit("on-ok", info);
    },
    // 添加编辑导入导出
    onBtn(com) {
      this.$emit("on-add", com);
    },
    resetForm() {
      this.form.check_name = ''
      this.onSubmit()
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
