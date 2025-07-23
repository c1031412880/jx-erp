<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="时间类型">
          <el-select v-model="form.time_config " filterable clearable placeholder="请选择">
            <el-option label="领用时间" :value="1"></el-option>
            <el-option label="提交时间" :value="2"></el-option>
            <el-option label="审批完成时间" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择盘点开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end_date-placeholder="选择盘点结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="车辆:">
          <get-vehicle-select-tree
            v-model="form.vehicle_id"
            :placeholder="'选择车辆'"
            :isShowCheckbox="false"
            :isExportMultiple="false"
            nodeKey="i_id"
          />
        </el-form-item>
        <el-form-item label="配件名称:">
          <el-input v-model="form.part_name" placeholder="请输入盘点标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="审批状态:">
          <el-select v-model="form.type" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value" v-bind="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button  @click="Reset" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onExport()" type="primary" v-if="$isPowerShow('export')">导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('add')" type="primary" v-if="$isPowerShow('add')">发起</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getVehicleSelectTree from "../../../../components/base/formModel/tree/get-vehicle-select-tree.vue";
export default {
  components: {
    getVehicleSelectTree
  },
  data() {
    return {
      date: [],
      form: {
        time_config: '',
        vehicle_id: '',
        start_date: '',
        end_date: '',
        part_name: '',
        state: 0
      },
      typeOptions: [
        {label: '全部', value: -1},
        {label: '审批中', value: 0},
        {label: '审批通过', value: 1},
        {label: '审批未通过', value: 2},
        {label: '已撤销', value: 3}
      ]
    };
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.start_date = this.date[0]
      this.form.end_date = this.date[1]
    },
    selectedTime() {
      // alert(JSON.stringify(this.form.call_time))
      if(!!this.date && this.date.length > 0) {
        this.form.start_date = this.$addTime(this.date)[0]
        this.form.end_date = this.$addTime(this.date)[1]
      }else{
        this.date = []
        this.form.start_date = ''
        this.form.end_date = ''
      }
    },
    onExport(){
      let info = this.$outFormData(this.form)
      console.log(this.form, info)
      this.$emit("on-export", info);
    },
    onSubmit() {
      let info = this.$outFormData(this.form)
      console.log(this.form, info)
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(){
      Object.assign(this.$data, this.$options.data())
      this.onSubmit()
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
