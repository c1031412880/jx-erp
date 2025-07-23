<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="月份:">
          <el-date-picker
            v-model="form.month"
            type="month"
            style="width:120px"
            value-format="yyyy-MM"
            :clearable="false"
            :picker-options="pickerOptions"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="人员名称:">
          <el-input v-model="form.user_name" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onImport" icon="el-icon-upload2" v-if="$isPowerShow('import')"
            >导入</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onClear" v-if="$isPowerShow('clear') && groupId"
            >清空</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import { formatDate } from "@/utils/index";
export default {
  props: {
    groupId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          let year = new Date().getFullYear()
          let month = new Date().getMonth()
          if (month == 0) {
            year = year -1
            month = 12
          }
          return time.getTime() < new Date(year + '-' + month).getTime()
        }
      },
      form: {
        user_name:"",
        month: formatDate(new Date(), 'yyyy-MM')
      },
    };
  },
  mounted() {
  },
  methods: {
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    onImport() {
      this.$emit("on-import");
    },
    onClear() {
      this.$emit("on-clear");
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
