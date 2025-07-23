<template>
  <div class="sub-req">
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="发放类型:">
          <el-select v-model="form.type" placeholder="全部" clearable>
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="monthDate"
            type="monthrange"
            range-separator="~"
            start-placeholder="开始月份"
            end-placeholder="结束月份">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="onSubmit"
            icon="el-icon-search" 
            >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="resetForm"  
            icon="el-icon-refresh-right"
            >重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
import { formatDateTime } from "@/utils/index";
export default {
  components: { 
  },

  data() {
    return {
      form: {
        type: '0',
        begin_month: '',
        end_month: ''
      },
      monthDate: [],
      typeOptions: [
        { value: '0', name: '全部'},
        { value: '1', name: '工资'},
        { value: '2', name: '奖金'},
        { value: '3', name: '其他'},
      ]
    }
  },
  mounted() {

  },
  methods: {
    // 查询
    onSubmit () {
      if(!!this.monthDate.length) {
        this.form.begin_month = formatDateTime(new Date(this.monthDate[0]))
        this.form.end_month = formatDateTime(new Date(this.monthDate[1]))
      }
      // console.log(this.form);
      let info = Object.assign({}, this.form)
      this.$emit("on-ok", info);
    },
    
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data())
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 100);
    },
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.sub-req {
  margin-top: 10px;
}
</style>