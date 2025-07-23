<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="保养类型:">
          <get-select-dictionaries  style="width:100%" v-model="form.type" :classKey="'保养类型'" placeholder="请选择保险种类"></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="保养日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="add()" type="primary" v-if="!disabled_show" icon="el-icon-plus">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn()" type="primary"  icon="el-icon-download">导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components:{
    getSelectDictionaries
  },
  props: ["disabled_show"],
  data() {
    return {
      options:[
        {value: 1, label: "一保"},
        {value: 2, label: "二保"}
      ],
      date:[],
      form: {
        type: '',
        maintain_date_start: '',
        maintain_date_end: ''
      },
    };
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
    // 查询
    onSubmit() {
      if(!!this.date && this.date.length > 0) {
        this.date = this.$addTime(this.date);
        this.form.maintain_date_start = this.date[0] + ' 00:00:00'
        this.form.maintain_date_end = this.date[1]
      }else{
        this.date = []
        this.form.maintain_date_start = ''
        this.form.maintain_date_end = ''
      }
      
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      if(this.form.state === 0) {
        info.state = 0
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.form.name = "";
      Object.assign(this.$data, this.$options.data());
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 导出
    onBtn() {
      this.$emit("on-export");
    },
    // 添加
    add() {
      this.$emit("on-add");
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
