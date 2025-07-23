<template>
  <div class="scrap-condition" style="height: 400px; overflow-x: hidden">
    <el-form ref="elForm" :model="formData" :rules="rules" size="mini" label-width="90px">
      <el-form-item label="报废日期:" prop="scrap_date">
        <el-date-picker
          v-model="formData.scrap_date"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          disabled
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="报废原因:" prop="scrap_reason">
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 8}"
          placeholder="请输入报废原因"
          v-model="formData.scrap_reason"
          disabled
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  data() {
    return {
      formData: {
        scrap_date:"",
        scrap_reason: "",
      },
      rules:{}
    };
  },
  methods: {
    // 重置信息
    resetData() {
      this.formData = {};
    },
    // 设置数据
    setData(val) {
       for (const key in this.formData) {
        if (Object.hasOwnProperty.call(this.formData, key)) {
          // const element = this.formData[key];
          this.formData[key] = val[key]
          
        }
      }
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.scrap-condition /deep/ .el-input {
  width: 480px;
}

.scrap-condition /deep/ .el-input--mini {
  width: 480px;
}

.scrap-condition/deep/ .el-date-editor {
  width: 480px;
}
</style>
