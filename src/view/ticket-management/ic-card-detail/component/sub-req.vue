<template>
  <div class="sub-req-box">
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item label="日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择结束日期"
            :picker-options="pickerOptions"
            @change="selectedTime">
          </el-date-picker>
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
        <el-form-item label="车辆:">
          <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
          >
          </get-vehicle-select-tree>
        </el-form-item>
        <el-form-item label="线路:">
          <get-line-select-tree
              ref="lineTree"
              :placeholder="'选择线路'"
              :isShowCheckbox="true"
              v-model="form.line_ids"
            >
            </get-line-select-tree>
        </el-form-item>
        <el-form-item label="驾驶员:">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.driver_ids"
            :width="'160'"
            :isShowCheckbox="true"
            :placeholder="'请选择驾驶员'"
            :isExportMultiple="true"
          ></get-driver-select-tree>
        </el-form-item>
        <el-form-item label="支付类型:">
          <el-select v-model="form.con_types" clearable multiple collapse-tags placeholder="请选择支付类型">
            <el-option
              v-for="item in payOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button  @click="Reset('form')" icon="el-icon-refresh-left"
            >重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="chartSet" type="text">{{chartChange ? '收回图表' : '展开图表'}}</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import {formatDateTime} from '@/utils/index'
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";

export default {
  components: {getVehicleSelectTree,getLineSelectTree,getDriverSelectTree},
  data() {
    return {
      date:[],
      branchOffice: [],
      chartChange: true,
      form: {
        start_time: '',
        end_time: '',
        dept_ids: [],
        vehicle_ids: [],
        line_ids: [],
        driver_ids: [],
        con_types: [],
      },
      payOptions: [
        {value: '实体卡', label: '实体卡'},
        {value: '支付宝', label: '支付宝'},
        {value: '银联乘车码', label: '银联乘车码'},
        {value: '银联卡', label: '银联卡'},
        {value: '银联付款码', label: '银联付款码'},
        {value: '自发码', label: '自发码'},
        {value: '微信乘车码', label: '微信乘车码'},
        {value: '部标二维码', label: '部标二维码'},
        {value: '军休码', label: '军休码'},
        {value: '献血荣誉码', label: '献血荣誉码'},
        {value: '嘉兴人才码', label: '嘉兴人才码'},
        {value: '浙里老兵码', label: '浙里老兵码'},
      ],
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
    };
  },
  activated() {
    this.$nextTick(() => {
      let info = this.$route.params
      if(info.start_time && info.end_time) {
        this.form.start_time = info.start_time
        this.form.end_time = info.end_time
        this.date = [info.start_time, info.end_time]
        this.form.dept_ids = info.dept_ids ? [info.dept_ids] : []
        this.form.vehicle_ids = info.vehicle_ids ? [info.vehicle_ids] : []
        this.form.line_ids = info.line_ids ? [info.line_ids] : []
        this.form.driver_ids = info.driver_ids ? [info.driver_ids] : []
        this.onSubmit()
      }
      
    }, 300)
  },
  mounted() {
    this.GetDeptInfoCaches()
    this.onSetTime()
    let info = this.$route.params
    console.log('mounted',info);
    if(info.start_time && info.end_time) {
      this.form.start_time = info.start_time
      this.form.end_time = info.end_time
      this.date = [info.start_time, info.end_time]
      this.form.dept_ids = info.dept_ids ? [info.dept_ids] : []
      this.form.vehicle_ids = info.vehicle_ids ? [info.vehicle_ids] : []
      this.form.line_ids = info.line_ids ? [info.line_ids] : []
      this.form.driver_ids = info.driver_ids ? [info.driver_ids] : []
    }
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
    onSetTime(type = 'lastOneDay') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.startTime])
      this.form.start_time = this.date[0]
      this.form.end_time = this.date[1] 
    },
    chartSet() {
      this.chartChange = !this.chartChange;
      this.$emit("on-chart-show", this.chartChange);
    },
    // 查询
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
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      this.onSetTime()
      this.$refs.vehicleTree.onClear();
      this.$refs.lineTree.onClear();
      this.$refs.driverTree.onClear();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 刷新列表
    refreshTableList() {
      this.$parent.informationDialogOk();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
    // 导出Excel
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
