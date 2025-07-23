<template>
  <el-dialog :visible="dialogBool" title="导入导出设置" width="540px" :before-close="dialogClose">
    <el-form inline size="mini">
      <el-row :gutter="24">
        <el-col :span="4">
          <el-form-item></el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item>
            <span>导入</span>
            <el-input-number :controls="false" v-model="setForm.in_number" placeholder="请输入标准值" clearable></el-input-number>
            <span>行数据需要记录到此表</span>
          </el-form-item>
          <el-form-item>
            <span>导出</span>
            <el-input-number :controls="false" v-model="setForm.out_number" placeholder="请输入标准值" clearable></el-input-number>
            <span>行数据需要记录到此表</span>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="setForm.checked">是否发送消息通知</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item></el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose()" size="mini">取 消</el-button>
      <el-button type="primary" size="mini">保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialogBool: Boolean
  },
  data() {
    return {
      setForm: {
        out_number: 1000,
        in_number: 1000,
        checked: true
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false)
    }
  }
}
</script>