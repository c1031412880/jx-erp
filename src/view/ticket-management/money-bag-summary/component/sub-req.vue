<template>
  <div class="sub-req-box">
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-form-item label="日期:">
        <el-date-picker
          v-model="date"
          type="daterange"
          :clearable="false"
          range-separator="至"
          start-placeholder="选择开始日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          end-placeholder="选择结束日期"
          :picker-options="pickerOptions"
          @change="selectedTime">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="车辆:" v-show="activeName === 'second'">
        <get-vehicle-select-tree
          ref="vehicleTree"
          :placeholder="'选择车辆'"
          :isShowCheckbox="true"
          v-model="form.vehicle_ids">
        </get-vehicle-select-tree>
      </el-form-item>
      <el-form-item label="线路:" v-show="activeName === 'first'">
        <get-line-select-tree
          ref="lineTree"
          :placeholder="'选择线路'"
          :isShowCheckbox="true"
          v-model="form.line_ids">
        </get-line-select-tree>
      </el-form-item>
      <el-form-item label="驾驶员:" v-show="activeName === 'third'">
        <get-driver-select-tree
          ref="driverTree"
          v-model="form.driver_ids"
          :width="'160'"
          :isShowCheckbox="true"
          :placeholder="'请选择驾驶员'"
          :isExportMultiple="true"
        ></get-driver-select-tree>
      </el-form-item>
      <el-form-item label="分公司:">
        <el-select v-model="form.dept_ids" placeholder="请选择" multiple>
          <el-option
            v-for="item in branchOffice"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="线路汇总方式:"  v-show="activeName === 'first'">
        <el-select v-model="form.line_type" placeholder="请选择">
          <el-option
            v-for="item in lineTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期汇总方式:">
        <el-select v-model="form.date_type" placeholder="请选择">
          <el-option
            v-for="item in dateTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        <el-button  @click="Reset('form')" icon="el-icon-refresh-left">重置</el-button>
        <el-button @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')">导出</el-button>
        <!-- <el-button @click="onBtn('import')" icon="el-icon-download" v-if="$isPowerShow('import') && activeName === 'first'">导入</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate, formatTime} from '@/utils/index'
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
export default {
  components: {
    getLineSelectTree,
    getDriverSelectTree,
    getVehicleSelectTree
  },
  props: {
    activeName:{
      type: String,
      default:'first'
    }
  },
  data() {
    return {
      date:[],
      form: {
        start_time: '',
        end_time: '',
        vehicle_ids: [],
        line_ids: [],
        driver_ids: [],
        dept_ids: [],
        line_type: 1,
        date_type: 1,
      },
      branchOffice: [],
      minDate: new Date(),
      maxDate: new Date(),
      pickerOptions: {
        disabledDate:(time)=> {
          let front = new Date(this.minDate.getTime() - 86400000 * 366)
          let end = new Date(this.maxDate.getTime() + 86400000 * 366)
          return !(front < time && time < end);
        },
        onPick:(obj)=> {
          this.minDate = (!!obj && obj.minDate) || new Date()
          this.maxDate = (!!obj && obj.maxDate) || this.minDate
        }
      },
      lineTypeOptions: [
        {value: 1, label: '按线路'},
        {value: 2, label: '按线路+分公司'},
      ],
      dateTypeOptions: [
        {value: 1, label: '直接汇总'},
        {value: 2, label: '逐日汇总'},
      ],
    }
  },
  mounted() {
    let info = this.$route.params
    if(info.start_time && info.end_time) {
      return false
    }
    this.onSetTime()
    this.GetDeptInfoCaches()
    this.onSubmit()
  },
  methods: {
    GetDeptInfoCaches() {
      this.$client.GetDeptInfoCaches({}).then(res => {
        if (res.head.result === '200') {
          this.branchOffice = res.context 
        }
      })
    },
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.start_time = this.date[0];
        this.form.end_time = this.date[1] + ' 23:59:59';
      } else {
        this.form.start_time = "";
        this.form.end_time = "";
      }
    },
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.start_time = this.date[0]
      this.form.end_time = this.date[1] 
    },
    onSubmit() {
      let info = this.$outFormData(this.form)
      switch (this.activeName) {
        case 'second':
          info.line_type = 3
          break;
        case 'third':
          info.line_type = 4
          break;
      
        default:
          break;
      }
      this.$emit("on-ok", info);
    },
    Reset() {
      this.onSetTime()
      this.form.dateType = 1
      this.form.dept_ids = []
      if(this.activeName === 'first') {
        this.form.vehicle_ids = []
        this.form.lineType = 1
        this.$refs.vehicleTree.onClear()
      }else if(this.activeName === 'second') {
        this.form.line_ids = []
        this.$refs.lineTree.onClear()
      }else if(this.activeName === 'third') {
        this.form.driver_ids = []
        this.$refs.driverTree.onClear()
      }
      this.onSetTime()
      this.onSubmit()
    },
    onBtn(com) {
      let info = this.$outFormData(this.form)
      switch (this.activeName) {
        case 'second':
          info.line_type = 3
          break;
        case 'third':
          info.line_type = 4
          break;
      
        default:
          break;
      }
      this.$emit("on-" + com, info);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>