<template>
  <div class="sub-req">
    <el-form :inline="true" size="mini">
      <el-form-item>
        <el-select v-model="type" placeholder="快速选择日期" @change="onSetTime">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in options"
            :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="选择事故分析开始日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          end-placeholder="选择事故分析结束日期"
          @change="selectedTime">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button  @click="Reset" icon="el-icon-refresh-left">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import {getDate} from '@/utils/index'
export default {
  components: { getDriverSelectTree, getSelectDictionaries, getVehicleSelectTree},
  data() {
    return {
      form: {
        begin: "",
        end: "",
      },
      date: [],
      type: 'lastOneMonth',
      options: [
        {label: '近一个月', value: 'lastOneMonth'},
        {label: '近三个月', value: 'lastThreeMonth'},
        {label: '近半年', value: 'lastHalfYear'},
        {label: '近一年', value: 'lastOneYear'},
      ]
    };
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'lastOneMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.begin = this.date[0]
      this.form.end = this.date[1]
    },
    selectedTime() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.begin = this.date[0];
        this.form.end = this.date[1];
        this.type = ''
      }else{
        this.form.begin = '';
        this.form.end = '';
      }
    },
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
    Reset(){
      Object.assign(this.$data,this.$options.data())
      this.onSetTime()
      this.onSubmit()
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新
    refreshTableList() {
      this.Reset()
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.sub-req{
  background: #fff;
  border-radius 5px
  margin 10px 0;
  padding 18px 0 0 18px
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
</style>
