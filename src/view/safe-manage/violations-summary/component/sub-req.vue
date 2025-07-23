<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="日期:">
          <el-select v-model="form.date_type" placeholder="请选择" @change="selectDateType" style="width: 110px">
            <el-option
              v-for="item in dateTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="violationDate"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd"
            :default-time="['00:00:00', '23:59:59']"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="selectedTime1"
            v-if="form.date_type == 1">
          </el-date-picker>

          <el-date-picker
            v-model="monthDate"
            type="monthrange"
            range-separator="至"
            value-format="yyyy-MM"
            format="yyyy-MM"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            @change="selectedTime2"
            style="width: 350px;"
            :picker-options="pickerMonthOptions"
            v-if="form.date_type == 2">
          </el-date-picker>

          <div class="show-flex-box-r" v-if="form.date_type == 3">
            <get-quarter-select ref="getQuarterSelect1" :placeholder="'开始季度'" @on-change="funcQuarter1"></get-quarter-select>
            <span>至&nbsp;&nbsp;&nbsp;</span>
            <get-quarter-select ref="getQuarterSelect2" :placeholder="'结束季度'" @on-change="funcQuarter2"></get-quarter-select>
          </div>

          <div class="show-flex-box-r" v-if="form.date_type == 4">
            <el-date-picker
              v-model="form.min_year"
              type="year"
              placeholder="开始年份"
              value-format="yyyy"
              format="yyyy"
              style="width: 150px"
              @change="selectedMinYear"
              >
            </el-date-picker>
            <span>&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;</span>
            <el-date-picker
              v-model="form.max_year"
              type="year"
              placeholder="结束年份"
              value-format="yyyy"
              format="yyyy"
              style="width: 150px"
              @change="selectedMaxYear"
              >
            </el-date-picker>
          </div>
          
        </el-form-item>
        <el-form-item label="组织:" v-show="activeName == '1'">
          <get-department-select
            ref="departmentlTree"
            v-model="form.group_ids"
            :placeholder="'请选择组织'"
            :isContainEmp="false"
            :isShowCheckbox="true"
            :isExportMultiple="true"
            :isCheckStrictly="false"
            :funcType="1"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="线路:" v-show="activeName == '2'">
          <get-line-select-tree
              ref="lineTree"
              :placeholder="'选择线路'"
              :isShowCheckbox="true"
              v-model="form.line_ids"
              :isExportMultiple="true"
            >
            </get-line-select-tree>
        </el-form-item>
        <!-- <el-form-item label="车辆:" v-show="activeName == '3'">
          <get-vehicle-select-tree
              ref="vehicleTree"
              :placeholder="'选择车辆'"
              :isShowCheckbox="true"
              v-model="form.vehicle_ids"
              :isExportMultiple="true"
            >
            </get-vehicle-select-tree>
        </el-form-item> -->
        <el-form-item label="驾驶员:" v-show="activeName == '3'">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.driver_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择所驾驶员'"
            :isExportMultiple="true"
          ></get-driver-select-tree>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit(activeName)"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('reset')" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onExport()" type="primary" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
// import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getQuarterSelect from 'components/base/formModel/select/get-quarter-select'
// import yearRange from "@/components/base/timeRangeSelectionControl/year-range.vue";
export default {
   components: {
    getDepartmentSelect,
    // getVehicleSelectTree,
    getLineSelectTree,
    getDriverSelectTree,
    getQuarterSelect,
    // yearRange
  },
  props:{
    activeName: {
      type: String,
      default: "1",
    },
  },
  // 按年汇总时，最多允许跨2年。按月汇总时，最多允许跨12个月；按季度汇总时最多允许跨4个季度；按日汇总时最多允许跨31日。
  data() {
    let minTime = null;
    let maxTime = null;
    let minDate = new Date();
    let maxDate = new Date();
    return {
      // minDate: new Date(),
      // maxDate: new Date(),
      pickerOptions: {
        disabledDate:(time)=> {
          let front = new Date(minDate.getTime() - 86400000 * 31)
          let end = new Date(maxDate.getTime() + 86400000 * 31)
          // console.log(!(front < time && time < end), formatDateTime(front),formatDateTime(time),formatDateTime(end))
          return !(front < time && time < end);
        },
        onPick:(obj)=> {
          // console.log(obj)
          minDate = (!!obj && obj.minDate) || new Date()
          maxDate = (!!obj && obj.maxDate) || minDate
        }
      },
      pickerMonthOptions: {
        disabledDate(time) {
          if (minTime) {
            return time.getTime() < minTime || time.getTime() > maxTime;
          }
        },
        onPick(time) {
            // 选择了两个时间放开删除限制
          if (time.maxDate && time.minDate) {
            minTime = null;
            maxTime = null;
          // 如果选择了一个时间
          } else if (!time.maxDate) {
            // 31104000000是一年的时间戳  2592000000是一个月的时间戳
            minTime = time.minDate.getTime() - 31104000000 + 2592000000;
            maxTime = time.minDate.getTime() + 31104000000;
          } else {
            // 放开限制，方便再次选择
            minTime = null;
            maxTime = null;
          }
        }
      },
      dateTypeOptions: [{
        value: 1,
        label: '按日汇总'
      }, {
        value: 2,
        label: '按月汇总'
      }, {
        value: 3,
        label: '按季度汇总'
      }, {
        value: 4,
        label: '按年汇总'
      }],
      violationDate:[],
      monthDate:[],
      form: {
        date_type:2,
        start_day:'',
        end_day:'',
        start_month:'',
        end_month:'',
        min_year:'',
        max_year:'',
        min_quarter:'',
        max_quarter:'',
        group_ids:[],
        line_ids:[],
        driver_ids:[]
      },
    };
  },
  mounted() {
    this.configOnSubmit();
  },
  methods: {
    // 初始化日期
    configOnSubmit() {
      let timeObj = getDate('thisMonth')
      this.violationDate = [timeObj.startTime + " 00:00:00", timeObj.endTime + " 23:59:59"]
      this.monthDate =  [timeObj.startTime.slice(0,7), timeObj.endTime.slice(0,7)]
      this.form.start_month = timeObj.startTime.slice(0,7)
      this.form.end_month = timeObj.endTime.slice(0,7)
      this.form.start_day = this.violationDate[0];
      this.form.end_day = this.violationDate[1];
    },
    // 切换日期类型
    selectDateType(val) {
      this.form.start_day = ''
      this.form.end_day = ''
      this.form.start_month = ''
      this.form.end_month = ''
      this.form.min_year = ''
      this.form.max_year = ''
      this.form.min_quarter = ''
      this.form.max_quarter = ''
      this.violationDate = []
      this.monthDate = []
    },
    // 选择日期
    selectedTime1: function() {
      if(this.violationDate && this.violationDate.length>0) {
        this.violationDate = this.$addTime(this.violationDate)
        this.form.start_day = this.violationDate[0];
        this.form.end_day = this.violationDate[1];
      }else{
        this.form.start_day = '';
        this.form.end_day = '';
      }
    },
    // 选择月份
    selectedTime2(val) {
      this.monthDate = val
      if(!!this.monthDate && this.monthDate.length) {
        this.form.start_month =  this.monthDate[0]
        this.form.end_month =  this.monthDate[1]
      }else{
        this.form.start_month =  ''
        this.form.end_month =  ''
      }
    },
    // 判断季度是否为四个季度之内
    judgmentInterval(type,min_year,min_quarter,max_year,max_quarter) {
      if(!!min_year && !!max_year) {
        if(max_year < min_year) {
          this.$message({ message: "请选择合法的年份区间", type: "warning" });
          this.restQuarter(type)
        }else{
          if((max_year - min_year) >1) {
            this.$message({ message: "季度区间最多选择四个季度", type: "warning" });
            this.restQuarter(type)
          }else{
            if(max_year > min_year) {
              if((max_quarter-min_quarter) > -1) {
                this.$message({ message: "季度区间最多选择四个季度", type: "warning" });
                this.restQuarter(type)
              }
            }
          }
        }
      }
    },
    // 重置季度
    restQuarter(type) {
      if(type == 'min') {
        this.form.min_year = ''
        this.form.min_quarter = ''
        this.$refs.getQuarterSelect1.reast()
      }else{
        this.form.max_year = ''
        this.form.max_quarter = ''
        this.$refs.getQuarterSelect2.reast()
      }
    },
    // 选择开始季度
    funcQuarter1(value){
      console.log(value)
      this.form.min_year = value.slice(0,4)
      if(value.indexOf('一') > -1) {
        this.form.min_quarter = 1
      }
      if(value.indexOf('二') > -1) {
        this.form.min_quarter = 2
      }
      if(value.indexOf('三') > -1) {
        this.form.min_quarter = 3
      }
      if(value.indexOf('四') > -1) {
        this.form.min_quarter = 4
      }
      this.judgmentInterval('min',Number(this.form.min_year),this.form.min_quarter,Number(this.form.max_year),this.form.max_quarter)
    },
    // 选择结束季度
    funcQuarter2(value){
      console.log(value)
      this.form.max_year = value.slice(0,4)
      if(value.indexOf('一') > -1) {
        this.form.max_quarter = 1
      }
      if(value.indexOf('二') > -1) {
        this.form.max_quarter = 2
      }
      if(value.indexOf('三') > -1) {
        this.form.max_quarter = 3
      }
      if(value.indexOf('四') > -1) {
        this.form.max_quarter = 4
      }
      this.judgmentInterval('max',Number(this.form.min_year),this.form.min_quarter,Number(this.form.max_year),this.form.max_quarter)
    },
    selectedMinYear(val) {
      if(!!val && !!this.form.max_year) {
        // alert(111)
        if(Number(val) > Number(this.form.max_year) ) {
          this.$message({ message: "请选择合法的年份区间", type: "warning" });
          this.form.min_year = ''
        }else{
          if((Number(this.form.max_year)- Number(val) ) > 1) {
            this.$message({ message: "年份区间最多跨度为两年", type: "warning" });
            this.form.min_year = ''
          }
        }
      }
    },
    selectedMaxYear(val) {
      if(!!val && !!this.form.min_year) {
        // alert(111)
        if(Number(val) < Number(this.form.min_year) ) {
          this.$message({ message: "请选择合法的年份区间", type: "warning" });
          this.form.max_year = ''
        }else{
          if((Number(val) - Number(this.form.min_year)) > 1) {
            this.$message({ message: "年份区间最多跨度为两年", type: "warning" });
            this.form.max_year = ''
          }
        }
      }
    },
    // 查询
    onSubmit(curDataType) {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      if(info.date_type == 1 &&　!info.start_day) {
        this.$message({ message: "请选择日期", type: "warning" });
        return
      }
      if(info.date_type == 2 &&　!info.start_month) {
        this.$message({ message: "请选择月份", type: "warning" });
        return
      }
      if(info.date_type == 3 &&　!info.min_quarter) {
        this.$message({ message: "请选择季度", type: "warning" });
        return
      }
      if(info.date_type == 4 &&　!info.min_year) {
        this.$message({ message: "请选择年份", type: "warning" });
        return
      }
      info.data_type = curDataType
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm(type) {
      Object.assign(this.$data, this.$options.data());
      switch (this.activeName) {
        case '1':
          this.$refs.departmentlTree.onClear();
          break;
        case '2':
          this.$refs.lineTree.onClear();
          break;
        // case '3':
        //   this.$refs.vehicleTree.onClear();
        //   this.form.vehicle_ids = [];
        //   break
        case '3':
          this.$refs.driverTree.onClear();
          break;
      }
      this.configOnSubmit();
      this.onSubmit(this.activeName);
      if(type == 'reset') {
        setTimeout(() => {
          this.$message({ message: "重置成功", type: "success" });
        }, 50);
      }
    },
    // 导出 
    onExport() {
      this.$emit("on-export");
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.form.type = "";
      this.$parent.restTableList();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
