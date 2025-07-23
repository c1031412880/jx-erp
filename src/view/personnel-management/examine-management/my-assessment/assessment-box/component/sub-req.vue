<template>
  <div v-cloak>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item label="考核模板名称:">
         <el-input v-model="form.exam_name" clearable></el-input>
        </el-form-item>
        <el-form-item label="考核类型" prop="exam_type">
          <get-select-dictionaries 
            style="width:100%"
            v-model="form.exam_type" 
            :classKey="'考核类型'" 
            :placeholder="'请选择考核类型'" 
          ></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="添加时间">
          <el-date-picker
            v-model="date"
            type="daterange"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
            range-separator="至"
            value-format="yyyy-MM-dd"
            @change="selectedTime"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="考核状态:">
          <el-select v-model="form.exam_state" clearable placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in stateList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  props:{
  },
  components: {
    getSelectDictionaries
  },
  data() {
    return {
      form: {
        exam_name:'',
        exam_type: '',
        start_time: '',
        end_time: '',
        exam_state: ''
      },
      date: [],
      stateList: [
        {
          id: 0,
          name: '未开始'
        },
        {
          id: 1,
          name: '考核中'
        },
        {
          id: 2,
          name: '待审核'
        },
        {
          id: 3,
          name: '待确认'
        },
        {
          id: 4,
          name: '申诉中'
        },
        {
          id: 5,
          name: '已确认'
        },
        {
          id: 6,
          name: '已结束'
        },
      ],
    };
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    // 修改时间
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.start_time = this.date[0];
        this.form.end_time = this.date[1] + ' 23:59:59'
      } else {
        this.form.start_time = "";
        this.form.end_time = "";
      }
    },
    // 查询
    onSubmit() {
      let info = {...this.form};
      this.$emit("on-ok", info);
    },
    // 添加编辑
    onBtn(com) {
      this.$emit("on-add", com);
    },
    resetForm() {
      this.date = []
      this.form.exam_name = ''
      this.form.exam_type = ''
      this.form.start_time = ''
      this.form.end_time = ''
      this.form.exam_state = ''
      this.onSubmit()
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
