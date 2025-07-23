<template>
  <div v-cloak>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item label="考核内容:">
         <el-input v-model="form.content" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus">添加</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-popconfirm
            @confirm="onBtn('delete')"
            title="确定删除选中的考核内容吗？">
            <el-button slot="reference" type="primary" icon="el-icon-delete" size="mini">删除</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('import')" icon="el-icon-download">导入</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-button type="success" @click="onBtn('save')">确认</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('close')">关闭</el-button>
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
        content:'',
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
    // 添加编辑
    onBtn(com) {
      this.$emit("on-add", com);
    },
    resetForm() {
      this.form.content = ''
      this.onSubmit()
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
