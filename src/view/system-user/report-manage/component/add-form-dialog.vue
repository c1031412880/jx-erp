<template>
  <el-dialog
    width="60%"
    
    title="添加查询变量"
    :visible.sync="dialogBool"
    :before-close="dialogClose"
    append-to-body>
    <el-form label-width="120px">
      <el-form-item label="变量名称">
        <el-input v-model="form.prop"></el-input>
      </el-form-item>
      <el-form-item label="显示名称">
        <el-input v-model="form.label"></el-input>
      </el-form-item>
      <el-form-item label="输入方式">
        <el-select v-model="form.tag" @change="tagChange">
          <el-option v-for="item in formConfig.tagList" :key="item.tag" :value="item.tag" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="附属参数" v-show="tagList.length">
        <el-select v-model="form.props">
          <el-option v-for="item in tagList" :key="item.value" v-bind="item"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import formConfig from "./formConfig";
export default {
  name: "add-form-dialog",
  data() {
    return {
      form: {
        prop: '',
        label: '',
        tag: '',
        props: ''
      },
      formConfig,
      tagList: []
    }
  },
  props: {
    dialogBool: Boolean,
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    tagChange(tag) {
      this.tagList = formConfig.tagDataMap[tag] || []
    },
    ok() {
      this.$emit('ok', this.form)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
