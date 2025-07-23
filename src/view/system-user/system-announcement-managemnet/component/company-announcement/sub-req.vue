<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="发布时间:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="标题:">
          <el-input v-model="form.title" placeholder="请输入公告标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="公告类别" prop="type">
          <get-select-dictionaries v-model="form.type" style="width:100%" :classKey="'公告类别'" placeholder="请选择公告分类"></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="已读未读">
          <el-select v-model="form.is_read">
            <el-option :value="3" label="全部"></el-option>
            <el-option :value="1" label="已读"></el-option>
            <el-option :value="2" label="未读"></el-option>
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
          <el-button @click="addJob()" type="primary" v-if="$isPowerShow('add')"
            >添加</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import { formatTime} from '@/utils/index'
export default {
  components: { getSelectDictionaries },
  data() {
    return {
      date:[],
      form: {
        title:"",
        start: "",
        end: "",
        type: "",
        is_read: 3
      },
    };
  },
  mounted() {
    this.onSubmit();
  },
  methods: {
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        // console.log(this.date)
        this.form.start = this.date[0];
        this.form.end = formatTime(new Date(this.date[1]));
      }else{
        this.form.start = '';
        this.form.end = '';
      }
    },
    // 查询
    onSubmit() {
      if(!!this.date && this.date.length > 0) {
        this.date = this.$addTime(this.date);
        this.form.start = this.date[0] + ' 00:00:00'
        this.form.end = this.date[1]

        let start = new Date(this.form.start).getTime()
        let end = new Date(this.form.end).getTime()
        let day = (end - start) / (24 * 60 * 60 * 1000)
        if (day > 365) {
          this.$message({ message: `发布时间范围不可超过一年`, type: "warning" });
          return false
        }
      }else{
        this.date = []
        this.form.start = ''
        this.form.end = ''
      }
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
      this.form.title = "";
      this.form.start = "";
      this.form.end = "";
      this.date = [];
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 添加编辑
    addJob() {
      this.$emit("on-add", 'add');
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
