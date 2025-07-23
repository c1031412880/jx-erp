<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="保险种类:">
          <get-select-dictionaries  style="width: 150px;" v-model="form.type" :classKey="'保险类型'" placeholder="请选择保险种类"></get-select-dictionaries>
        </el-form-item>
        <!-- <el-form-item label="投保日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item> -->
        <el-form-item label="保险公司:">
          <get-select-dictionaries  style="width: 150px;" v-model="form.company" :classKey="'保险公司'" placeholder="请选择保险公司"></get-select-dictionaries>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="">
          <el-select v-model="form.date_type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="保险到期日期:">
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
      options: [
        {value: 1, label: "投保日期"},
        {value: 2, label: "保险到期日期"},
      ],
      date:[],
      form: {
        type: '',
        company: '',
        date_type: 1,
        start: '',
        end: ''
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
        this.form.start = this.date[0] + ' 00:00:00'
        this.form.end = this.date[1]
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
