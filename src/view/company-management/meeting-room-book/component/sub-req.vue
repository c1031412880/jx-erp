<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <div class="show-flex-box-r" style="justify-content: space-between;">
          <el-form-item label="预订日期:">
            <el-date-picker
              v-model="form.date"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :picker-options="pickerOptions"
              @change="selectedDate"
            >
            </el-date-picker>
          </el-form-item>
          <div>
            <span style="color:#909399;font-size:12px;">备注： 灰色表示过期 橙黄色代表已被预定 蓝色代表自己当前选中</span>
          </div>
        </div>
        
        <!-- <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>> -->
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
export default {
  data() {
    return {
      color1: '#3333',
      form: {
        date:"",
      },
      pickerOptions: {
        disabledDate(time) {
          // console.log(time)
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        },
      },
    };
  },
  mounted() {
    this.setNowDete();
    
  },
  methods: {
    setNowDete() {
      let timeObj = getDate('today');
      // console.log(timeObj)
      this.form.date = timeObj.startTime
      this.onSubmit();
    },
    selectedDate(val) {
      if(!!val) {
        this.form.date = val;
        this.onSubmit();
      }
      
    },
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
    // 重置
    resetForm() {
      this.form.c_name = "";
      this.$parent.restTableList();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
