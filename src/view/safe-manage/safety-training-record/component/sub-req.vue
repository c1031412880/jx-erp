<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-form-item label="培训(演练)日期:">
        <el-date-picker
          v-model="date"
          type="daterange"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="selectedDate">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="培训(演练)地点:">
        <!-- <tr-select-dictionaries
          v-model="form.place_id"
          :classKey="'培训(演练)地点'"
          :placeholder="'请选择培训(演练)地点'"
          :isMultiple="false"
        ></tr-select-dictionaries> -->
        <el-input
          v-model="form.place_name"
          clearable
          :placeholder="'请输入培训(演练)地点'"
        ></el-input>
      </el-form-item>
      <el-form-item label="培训(演练)名称:">
        <el-input v-model="form.name" clearable placeholder="请输入关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit"
          >查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right"
          >重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onBtn('add')" v-if="$isPowerShow('add')" type="primary" icon="el-icon-plu"
          >添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onBtn('del')" v-if="$isPowerShow('del')" type="primary" icon="el-icon-delete"
          >删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onBtn('export')" v-if="$isPowerShow('export')" type="primary" icon="el-icon-download"
          >导出</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onBtn('print')" v-if="$isPowerShow('print')" type="primary" icon="el-icon-tickets"
          >打印培训(演练)记录表</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
export default {
  components: {},
  data() {
    return {
      date: [],
      form: {
        start_time:'',
        end_time: '',
        place_name:'',
        name:'',
      },
    };
  },
  mounted() {
    this.setDate();
    this.onSubmit();
  },
  methods: {
    // 初始化时间
    setDate() {
      let timeObj = getDate('thisMonth')
      this.date = [timeObj.startTime + " 00:00:00", timeObj.endTime + " 23:59:59"]
      this.form.start_time = this.date[0];
      this.form.end_time = this.date[1];
    },
    // 修改时间
    selectedDate: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.start_time = this.date[0];
        this.form.end_time = this.date[1];
      }else{
        this.form.start_time = '';
        this.form.end_time = '';
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
      this.setDate();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 点击事件
    onBtn(type) {
      this.$emit("on-" + type, type);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
