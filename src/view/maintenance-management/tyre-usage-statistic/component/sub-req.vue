<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="日期范围:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectedTime"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item  label="类型选择:">
          <el-select
            v-model="value"
            multiple
            placeholder="请选择"
            style="width: 260px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>         
        </el-form-item>
        
        <el-form-item label="轮胎型号:">
          <get-tyre-model
            v-model="form.model_ids"
          ></get-tyre-model>
        </el-form-item>

        <el-form-item>
          <el-button 
            @click="onSubmit"
            type="primary" 
            icon="el-icon-search" 
            >查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            @click="resetForm()"
            type="" 
            icon="el-icon-refresh-right"
            >重置</el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            @click="onBtn('export')"
            icon="el-icon-download" 
            >导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<script type="text/ecmascript-6">
import { getDate } from "@/utils/index";
import getTyreModel from "./get-tyre-model";
export default {

  components: { 
    getTyreModel,
  },

  data() {
    return {
      value: [],
      date: [],
      form: {
        begin_date: '',
        end_date: '',
        tyreCountState: [],
        model_ids: [],
      },
      options: [{
        value: '1',
        label: '报废'
      }, {
        value: '2',
        label: '修补'
      }, {
        value: '3',
        label: '翻新'
      }, {
        value: '4',
        label: '采购'
      }]
    }
  },
  mounted() {
     this.onSetTime()
     this.handler()
    },
  methods: {
    handler() {
      let info = this.$outFormData(this.form)
      if(info.tyreCountState.length == 0) {
        delete info.tyreCountState
      }
      this.$emit("on-out", info);
    },
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.begin_date = this.date[0]
      this.form.end_date = this.date[1]
    },
    selectedTime() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.begin_date = this.date[0]
        this.form.end_date = this.date[1]
      }else{
        this.form.begin_date = ''
        this.form.end_date = ''
      }
    },
    // 查询
    onSubmit () {
      let info = this.$outFormData(this.form)
      if(info.tyreCountState.length == 0) {
        delete info.tyreCountState
      }
      this.$emit("on-ok", info);
    },
    
    // 重置
    resetForm() {
      this.onSetTime()
      this.value = [];
      this.form.model_ids = [];
      this.form.tyreCountState = [];
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 100);
    },

    // 导出Excel
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
  },
  watch: {
    value(val) {
      this.form.tyreCountState = val
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>