<template>
  <el-form :inline="true" size="mini">
    <el-form-item>
      <!-- <el-date-picker
        v-model="date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        end-placeholder="结束日期"
        @change="selectedTime">
      </el-date-picker> -->
      <el-date-picker
      v-model="form.month"
      format="yyyy-MM"
      value-format="yyyy-MM"
      type="month"
      placeholder="选择月">
    </el-date-picker>
    </el-form-item>
    <el-form-item>
      <get-vehicle-select-tree v-model="form.vehicle_ids" v-if="whichPage == 2" :isShowCheckbox="true" placeholder="选择车辆"></get-vehicle-select-tree>
    </el-form-item>
    <el-form-item>
      <get-line-select-tree ref="getLineSelectTree" v-model="form.line_ids" v-if="whichPage == 1"  :isShowCheckbox="true"  placeholder="选择线路"></get-line-select-tree>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button  @click="Reset" icon="el-icon-refresh-left">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button  @click="dow">导出</el-button>
    </el-form-item>
    <template v-if="whichPage == 2">
      <el-form-item>
        <el-button  @click="onImport">导入</el-button>
      </el-form-item>
      <el-form-item v-show="isEdit">
        <el-button
          type="primary" 
          @click="onAll('edit')" 
          >批量编辑</el-button>
      </el-form-item>
      <el-form-item v-show="!isEdit">
        <el-button
          type="primary" 
          @click="onAll('save')" 
          >批量保存</el-button>
      </el-form-item>
    </template>

  </el-form>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import {getDate,formatDate} from '@/utils/index'
export default {
  name: "sub-req",
  components: {getVehicleSelectTree, getLineSelectTree},
  props: {
    whichPage: {
      type: Number,
      default: 1
    }
  },
  data() {
    //这里存放数据",
    return {
      date: '',
      form: {
        vehicle_id: '',
        line_id: '',
        month: formatDate(new Date,'yyyy-MM')
      },
      isEdit: true
    }
  },
  mounted() {
    // this.onSetTime()
    this.onSubmit()
  },
  //方法集合",
  methods: {
    onSetTime(type = 'thisMonth') {
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
    dow() {
      this.$emit('on-dow')
    },
    // 重置
    Reset(){
      Object.assign(this.$data,this.$options.data())
      this.$refs.getLineSelectTree.onClear()
      this.onSetTime()
      this.onSubmit()
    },
    onAll(type) {
      this.$emit(`on-all-${type}`);
    },
    onImport() {
      this.$emit("on-import");
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
