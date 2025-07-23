<template>
  <div v-cloak>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item label="项目名称:">
         <el-input v-model="form.content" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit" :disabled="isSort">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-right" :disabled="isSort">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" :disabled="isSort">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-popconfirm
            @confirm="onBtn('delete')"
            title="确定删除选中的工资项目吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="primary" icon="el-icon-delete" size="mini" :disabled="isSort">删除</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item  v-if="isShowSortButton">
          <el-button type="primary" @click="adjustSortSet">{{!isSort? '调整排序':'保存排序'}} </el-button>
          <el-button @click="onSubmit" v-if="isSort">取消</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props:{
    isSort:{
      type: Boolean,
      default: false,
    },
    isShowSortButton:{
      type: Boolean,
      default: true,
    },
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
    // 调整排序
    adjustSortSet() {
      this.$emit("adjust-sort-set", this.isSort)
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
