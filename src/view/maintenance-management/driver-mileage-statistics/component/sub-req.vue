<template>
  <el-form :inline="true" size="mini" :model="form" ref="form">
    <el-form-item label="开始日期">
          <el-date-picker
            v-model="form.start_time"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @change="selectedTime">
          </el-date-picker>   
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
            v-model="form.end_time"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
    <el-form-item label="驾驶员">
      <get-driver-select-tree
        ref="driverTree"
        v-model="form.driver_ids"
        :isShowCheckbox="true"
        :placeholder="'请选择所驾驶员'"
        :isExportMultiple="true"
        :key="key"
      ></get-driver-select-tree>
      <!-- <el-input v-model="form.driver_name" placeholder="请输入驾驶员名字" clearable></el-input> -->
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-refresh-right" @click="resetForm()">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onBtn('export1')" v-if="$isPowerShow('export')">导出表1</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onBtn('export2')" v-if="$isPowerShow('export')">导出表2</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import {getDate,debounce,throttle} from '@/utils/index'
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import {endGreaterStart} from "@/utils"
export default {
  components: {getDriverSelectTree},
  data() {
    return {
      month: [],
      form: {
        start_time: '',
        end_time: '',
        driver_ids: []
      },
      oldTime: 0,
      key: null
    }
  },
  // activated() {
  //   let params =  this.$route.params
  //   if (JSON.stringify(params) != '{}') {
  //     this.form.driver_ids = [params.name]
  //     let timeObj = getDate('thisMonth',new Date(params.month))
  //     this.month = this.$addTime([timeObj.startTime, timeObj.endTime])
  //     this.form.start_time = this.month[0]
  //     this.form.end_time = this.month[1]
  //     this.key = new Date().getTime()
  //   } else {
  //     this.onSetTime()
  //   }
  //   let time = new Date().getTime()

  //   if (time - this.oldTime > 2 * 1000) {
  //     this.onSubmit()
  //   }
  // },
  created() {
    window.eventOn.$on('driver-mileage-statistics', params => {
      this.form.driver_ids = [params.name]
      let timeObj = getDate('thisMonth',new Date(params.month))
      this.month = [timeObj.startTime, timeObj.endTime]
      this.form.start_time = this.month[0]
      this.form.end_time = this.month[1]
      this.onSubmit()
    })
  },
  mounted() {
    let params =  this.$route.params
    if (JSON.stringify(params) != '{}') {
      this.form.driver_ids = [params.name]
      let timeObj = getDate('thisMonth',new Date(params.month))
      this.month = [timeObj.startTime, timeObj.endTime]
      this.form.start_time = this.month[0]
      this.form.end_time = this.month[1]
    } else {
      this.onSetTime()
    }
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.month = [timeObj.startTime, timeObj.endTime]
      this.form.start_time = this.month[0]
      this.form.end_time = this.month[1]
    },
    onSubmit() {
      // 开始和结束时间都为空或都不为空才执行查询
      if ((!this.form.start_time && this.form.end_time) || (this.form.start_time && !this.form.end_time)) {
        this.$message({ message: "请填写完整的查询时间", type: "warning" });
        return;
      }  
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      if(this.form.end_time){
        info.end_time = this.form.end_time + ' 23:59:59'
      }

      this.$emit("on-ok", info);
    },
    resetForm() {
      Object.assign(this.$data.form, this.$options.data().form)
      this.onSetTime()
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 100);
    },
    onBtn(type) {
      this.$emit('on-' + type)
    },
    //判断开始结束时间
    selectedTime() {
      if(!this.form.start_time || !this.form.end_time){
        return
      }
      //endGreaterStart 开始小于结束返回true
      if( !endGreaterStart(this.form.start_time,this.form.end_time)){
        this.$message({ message: "结束时间不能早于开始时间，请重新选择!", type: "warning" });
        this.onSetTime()
      }
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>