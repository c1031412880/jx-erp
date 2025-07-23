<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-form-item>
        <el-select style="width: 120px" v-model="type" @change="selectedTime" placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-if="type === 1"
          v-model="date"
          type="daterange"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="selectedTime">
        </el-date-picker>    
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-if="type === 2"
          value-format="yyyy-MM-dd"
          v-model="month"
          type="month"
          placeholder="选择月"
          @change="selectedTime">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-if="type === 3"
          v-model="year"
          type="year"
          value-format="yyyy-MM-dd"
          placeholder="选择年"
          @change="selectedTime">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="车辆：">
        <get-vehicle-select-dialog
          ref="vehicleTree"
          :placeholder="'选择车辆'"
          :isShowCheckbox="true"
          :vehicleType='1'
          v-model="form.vehicle_ids">
        </get-vehicle-select-dialog>
      </el-form-item>
      <el-form-item label="分公司">
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
        <el-button type="primary" icon="el-icon-search" @click="onSubmit" v-if="$isPowerShow('search')">查询</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item> -->
      <el-form-item>
        <el-button icon="el-icon-download" @click="onBtn('export')" v-if="$isPowerShow('export')">导出</el-button>
      </el-form-item>
      <div style="float: right; height: 47px; display: flex">
        <i
          class="el-icon-refresh"
          style="margin-right: 15px; cursor: pointer"
          @click="refreshTableList()"
        ></i>
        <i
          class="el-icon-s-tools"
          style="cursor: pointer"
          @click="openSettingPage()"
        ></i>
      </div>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectDialog from "@/components/base/formModel/tree/get-vehicle-select-dialog";
import {getDate} from '@/utils/index'
export default {
  components:{
    getVehicleSelectDialog
  },
  data() {
    return {
      type: 2,
      date: '',
      month: '',
      year: '',
      form: {
        start:'',
        end: '',
        vehicle_ids: [],
        dept_ids: []
      },
      typeOptions: [
        {value: 1, label: '按日查询'},
        {value: 2, label: '按月查询'},
        {value: 3, label: '按年查询'},
      ],
      branchOffice: []
    }
  },
  mounted() {
    this.GetDeptInfoCaches()
    this.setDate()
  },
  methods: {
    onSubmit() {
      if(this.form.vehicle_ids && this.form.vehicle_ids.length == 0) {
        delete this.form.vehicle_ids
      }
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
    // 初始化时间
    setDate() {
      let timeObj = getDate('thisMonth')
      // this.date = [timeObj.startTime, timeObj.endTime]
      this.date = Object.values(timeObj)
      this.month = timeObj.startTime
      this.year = timeObj.startTime.slice(0, 4) + '-01-01'
      this.form.start = timeObj.startTime
      this.form.end = timeObj.endTime + ' 23:59:59'
    },
    // 切换时间
    selectedTime(val) {
      switch (this.type) {
        case 1:
          if(!this.date) {
            this.form.start = ''
            this.form.end = ''
            break;
          }
          this.form.start = this.date[0]
          this.form.end = this.date[1] + ' 23:59:59'
          break;
        case 2:
          if(!this.month) {
            this.form.start = ''
            this.form.end = ''
            break;
          }
          this.form.start = this.month
          let arr = this.month.split('-')
          let maxDate = new Date(arr[0], arr[1], 0).getDate()
          this.form.end = this.month.slice(0, 8) + maxDate + ' 23:59:59'
          break;
        case 3:
          if(!this.year) {
            this.form.start = ''
            this.form.end = ''
            break;
          }
          this.form.start = this.year
          this.form.end = this.year.slice(0, 4) + '-12-31 23:59:59'
          break;   
        default:
          break;
      }
    },
    GetDeptInfoCaches() {
      this.$client.GetDeptInfoCaches({}).then(res => {
        if (res.head.result === '200') {
          this.branchOffice = res.context 
        }
      })
    },
    // 刷新列表
    refreshTableList() {
      this.onSubmit()
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$emit('open-setting-page')
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>