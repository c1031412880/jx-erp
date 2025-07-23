<template>
  <el-form :inline="true" size="mini">
    <el-form-item label="日期:">
      <el-date-picker
        v-model="date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        @change="selectedTime">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="线路:" v-show="activeName === 'first'">
      <get-line-select-tree 
        ref="getLineSelectTree" 
        :isShowCheckbox="true" 
        v-model="form.line_ids" 
        placeholder="选择线路">
      </get-line-select-tree>
    </el-form-item>
    <el-form-item label="车辆:" v-show="activeName === 'second'">
      <get-vehicle-select-tree
        ref="vehicleTree"
        :placeholder="'选择车辆'"
        :isShowCheckbox="true"
        v-model="form.vehicle_ids">
      </get-vehicle-select-tree>
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
    <el-form-item label="分公司:" v-show="activeName === 'fourth'">
        <el-select v-model="form.dept_ids" placeholder="请选择" multiple>
          <el-option
            v-for="item in branchOffice"
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
      <el-button  @click="Reset" icon="el-icon-refresh-left">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button  @click="dow" icon="el-icon-refresh-left">导出</el-button>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import {getDate} from '@/utils/index'
export default {
  name: "sub-req",
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
    //这里存放数据",
    return {
      date: [],
      form: {
        start_time: '',
        end_time: '',
        line_ids: [],
        vehicle_ids: [],
        dept_ids: [],
        driver_ids: [],
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
    }
  },
  mounted() {
    this.onSetTime()
    this.GetDeptInfoCaches()
    this.onSubmit()
  },
  //方法集合",
  methods: {
    GetDeptInfoCaches() {
      this.$client.GetDeptInfoCaches({}).then(res => {
        if (res.head.result === '200') {
          this.branchOffice = res.context 
        }
      })
    },
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.start_time = this.date[0]
      this.form.end_time = this.date[1]
    },
    selectedTime() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.start_time = this.date[0];
        this.form.end_time = this.date[1]
      }else{
        this.form.start_time = '';
        this.form.end_time = '';
      }
    },
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      switch (this.activeName) {
        case 'first':
          info.query_type = 1
          break;
        case 'second':
          info.query_type = 2
          break;
        case 'third':
          info.query_type = 3
          break;
        case 'fourth':
          info.query_type = 4
          break;
      
        default:
          break;
      }
      this.$emit("on-ok", info);
    },
    dow() {
      this.$emit('on-dow')
    },
    // 重置
    Reset(){
      if(this.activeName === 'first') {
        this.form.line_ids = []
        this.$refs.lineTree.onClear()
      }else if(this.activeName === 'second') {
        this.form.vehicle_ids = []
        this.$refs.vehicleTree.onClear()
      }else if(this.activeName === 'third') {
        this.form.dept_ids = []
      }else if(this.activeName === 'fourth') {
        this.form.driver_ids = []
        this.$refs.driverTree.onClear()
      }
      this.onSetTime()
      this.onSubmit()
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
