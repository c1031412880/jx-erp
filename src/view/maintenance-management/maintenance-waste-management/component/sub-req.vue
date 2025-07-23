<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="回收日期:">
           <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectedTime"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="回收项目:">
          <el-select v-model="form.type" clearable placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('add')" type="primary" icon="el-icon-plus" v-if="$isPowerShow('add')"
            >添加</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" type="primary" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('import')" type="primary">导入</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
export default {
  data() {
    return {
      date:[],
      typeOptions:[
        {
          value: 0,
          label: '全部'
        }, 
        {
          value: 1,
          label: '废电瓶'
        }, 
        {
          value: 2,
          label: '废机油'
        }, 
        {
          value: 3,
          label: '废轮胎'
        }, 
        {
          value: 4,
          label: '废铁'
        },
        {
          value: 5,
          label: '废机油壶'
        },
        {
          value: 6,
          label: '废铅酸蓄电池'
        },
        {
          value: 7,
          label: '废机油滤芯'
        },
      ],
      form: {
        date_start: "",
        date_end: "",
        type: 0,
      },
    };
  },
  mounted() {
    //  this.onSetTime()
     this.onSubmit()
  },
  methods: {
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.date_start = this.date[0]
      this.form.date_end = this.date[1]
    },
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.form.date_start = this.date[0];
        this.form.date_end = this.date[1];
      }else{
        this.form.date_start = '';
        this.form.date_end = '';
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
      Object.assign(this.$data, this.$options.data());
      this.onSetTime()
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 添加编辑
    onBtn(type) {
      this.$emit(`on-${type}`, 'add');
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
