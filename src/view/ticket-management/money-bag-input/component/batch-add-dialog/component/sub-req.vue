<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="选择日期:" prop="date">
            <el-date-picker
              v-model="form.date"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              type="date"
              placeholder="年-月-日"
              :clearable="false"
              @change="selectedDate"
            >
            </el-date-picker>
          </el-form-item>
      </el-row>

    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  data() {
    return {
      form: {
        date: "",
      },
    };
  },
  mounted() {},
  methods: {
    // 选择时间
    selectedDate(val) {
      this.$emit('on-ok', val)
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
