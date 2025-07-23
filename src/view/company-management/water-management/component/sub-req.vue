<template>
  <div v-cloak>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item prop="begin">
          <el-date-picker
            v-model="form.read_date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit" :disabled="isSort"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetForm()" icon="el-icon-refresh-left" :disabled="isSort"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" :disabled="isSort">水费录入</el-button
          >
        </el-form-item>

         <!-- <el-form-item>
          <el-popconfirm
            @confirm="onBtn('delete')"
            title="确定删除选中的维修项目吗？">
            <el-button slot="reference" type="primary" icon="el-icon-delete" size="mini" :disabled="isSort" v-if="$isPowerShow('del')">删除</el-button>
          </el-popconfirm>
        </el-form-item> -->

         <el-form-item>
          <el-button type="primary" @click="onBtn('import')" icon="el-icon-download" :disabled="isSort"
            >导入</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('export')" icon="el-icon-upload2" :disabled="isSort">导出</el-button
          >
        </el-form-item>
        <el-form-item v-if="isShowSortButton">
          <el-button type="primary" @click="adjustSortSet" v-if="$isPowerShow('sort')">{{!isSort? '调整排序':'保存排序'}} </el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
// import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import {getDate} from '@/utils/index'
export default {
  props:{
    isSort:{
      type: Boolean,
      default: false,
    },
    isShowSortButton:{
      type: Boolean,
      default: true,
    },
    curSelectedDepartment:[Object]
  },
  components: { },
  data() {
    return {
      date:[],
      form: {
        read_date: [],
      },
      minDate: new Date(),
      maxDate: new Date(),
      pickerOptions: {
        disabledDate:(time)=> {
          let front = new Date(this.minDate.getTime() - 86400000 * 366)
          let end = new Date(this.maxDate.getTime() + 86400000 * 366)
          // console.log(!(front < time && time < end), formatDateTime(front),formatDateTime(time),formatDateTime(end))
          return !(front < time && time < end);
        },
        onPick:(obj)=> {
          console.log(obj)
          this.minDate = (!!obj && obj.minDate) || new Date()
          this.maxDate = (!!obj && obj.maxDate) || this.minDate
        }
      },
    };
  },
  mounted() {
    this.reqNextTime()
  },
  methods: {
    reqNextTime() {
      let time = getDate('lastOneMonth');
      // console.log(time)
      let day1 = new Date();
      this.form.read_date = [time.startTime, time.endTime];
      this.form.read_date = this.$addTime(this.form.read_date)
      this.minDate = new Date(day1.getTime() - 86400000 * 366)
      // console.log(this.date)
    },
    // 查询
    onSubmit() {
      let info = {...this.form};
      if(this.form.read_date && this.form.read_date.length > 0) {
        info.read_date = this.$addTime(this.form.read_date)
      }else{
        delete info.read_date
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.reqNextTime();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 500);
    },
    // 添加编辑
    onBtn(com) {
      this.$emit("on-add", com);
    },
    // 调整排序
    adjustSortSet() {
      this.$emit("adjust-sort-set", this.isSort)
    },
  },
  watch:{
    // curSelectedDepartment: {
    //   handler(newVal, oldVal){
    //     this.form.c_name = "" 
    //   },
    //   deep: true 
    // }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
