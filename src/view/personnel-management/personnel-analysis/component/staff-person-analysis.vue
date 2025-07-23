<template>
  <div class="staff-person-analysis">
    <el-row type="flex" class="card-box-t">
      <!-- <el-date-picker
        v-model="form.year"
        type="year"
        class="select-t"
        @change="getLoadData"
        :value-format="'yyyy-MM'"
        placeholder="选择年">
      </el-date-picker> -->
      <el-date-picker
        v-model="months"
        type="monthrange"
        align="right"
        unlink-panels
        :clearable="false"
        range-separator="~"
        start-placeholder="开始月份"
        end-placeholder="结束月份"
        value-format="yyyy-MM"
        @change="onChangeSelectMonth"
        :picker-options="pickerOptions">
      </el-date-picker>
      <get-department-select
        ref="departmenTree"
        class="select-b"
        v-model="form.dept_ids"
        :isShowCheckbox="true"
        @on-change="getLoadData"
        :placeholder="'请选择部门'"
        :isContainEmp="false"
        :isExportMultiple="true"
      ></get-department-select>
    </el-row> 
    <el-row :gutter="20" type="flex" class="card-box-m">
      <el-col   v-for="(item,i) in toolList" :key="i">
        <div class="card-box-descript">
          <p>{{ item }}</p>
          <span>{{ toolData[i] || 0 }}</span>
          <!-- <count-to :start-val="0" :end-val="toolData[i] || 0" :duration="2600" class="card-panel-num"/> -->
        </div>
      </el-col>
    </el-row>
    <el-card class="card-box-t">
      <el-col :span="24" style="height: 360px; width: 100%">
        <onlines-chart ref="staffPersonAnalysis" v-loading="loading"></onlines-chart>
      </el-col>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import onlinesChart from './onlines-chart'
export default {
  components: {
    // countTo,
    // onlinesChart,
    getDepartmentSelect,
    onlinesChart
  },
  props:{
    showCollapse:{
      type: String,
      default:'first'
    }
  },
  watch:{
    showCollapse() {
      this.getLoadData()
    }
  },
  data() {
    return {
      months: '',
      form: {
        start_date: "",
        end_date: "",
        dept_ids: [],
      },
      toolData: [],
      toolList:['期初人数', '期末人数', '入职人数', '离职人数', '退休人数','减员率', '平均人数', 
      '平均入职人数', '平均离职人数','平均退休人数','平均减员率'],
      loading: false,
      pickerMinDate: null,
      pickerMaxDate: null,
      pickerOptions: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            picker.$emit('pick', [new Date(), new Date()]);
          }
        }, {
          text: '今年至今',
          onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          }
        }],
        //点击时间回调
        onPick:({maxDate,minDate})=>{
          if(minDate){
            let currentYear = minDate.getFullYear()
            this.pickerMinDate = new Date(minDate).setFullYear(currentYear-1)
            this.pickerMaxDate = new Date(minDate).setFullYear(currentYear+1)
          }
          // console.log(maxDate,minDate,this.pickerMinDate);
        },
        //禁用时间 打开选择器就调用
        disabledDate:(time)=> {
          if(this.pickerMinDate!=null){
            //点击月份后只允许选前后1年的时间
            //return true是禁用
            return time.getTime() < this.pickerMinDate || this.pickerMaxDate < time.getTime()
          }
        },
      },
    }
  },
  mounted() {
    this.setMonthTime()
    this.getLoadData()
  },
  methods: {
    setMonthTime() {
      let year = new Date().getFullYear()
      let month = new Date().getMonth() + 1 + ''
      this.form.start_date = year + '-01'
      this.form.end_date = year + '-' + this.padLeftZero(month)
      this.months = [this.form.start_date, this.form.end_date]
    },
    padLeftZero(str) {
      return ('00' + str).substr(str.length);
    },
    onChangeSelectMonth(val) {
      this.form.start_date = val[0]
      this.form.end_date = val[1]
      this.getLoadData()
    },
    getLoadData() {
      console.log(this.form);
      
      let params = Object.assign({}, this.form)
      params.is_driver = this.showCollapse == 'first'? 0:1
      this.$client.QueryEmpDimissionAnalysisEmployeeAnalysis(params).then(req => {
        if(req.head.result === '200') {
          let {
            dimission_count,
            downsizing_rate,
            join_count,
            month_begin_count,
            month_end_count,
            retire_count,
            data_list,
            avg_person_count, 
            avg_join_count , 
            avg_dimission_count, 
            avg_retire_count, 
            avg_downsizing_rate, 
          } = req.context
          this.toolData = [
            month_begin_count,
            month_end_count,
            join_count,
            dimission_count,
            retire_count,
            downsizing_rate + '%',
            avg_person_count, 
            avg_join_count , 
            avg_dimission_count, 
            avg_retire_count, 
            avg_downsizing_rate + '%',
          ]

          let label = [];
          let dimission =  [];
          let join = [];
          let retire = [];
          data_list.forEach(item => {
            label.push(item.month);
            dimission.push(item.dimission_count);
            join.push(item.join_count);
            retire.push(item.retire_count);
          });
          // console.log(label, dimission, join);
          this.$refs.staffPersonAnalysis.setOptions({
            label: label,
            data1: dimission,
            data2: join,
            data3: retire,
            title: [ '离职人数/人', '入职人数/人','退休人数/人']
          })
        }else {
          this.$message({
            showClose: true,
            message: req.head.describle,
            type: "error",
          });
        }
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$NumWidth: 100vw / 1920px;
.card-box-t {
  padding: 16px * $NumWidth 0;
  border-radius: 5px * $NumWidth;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

  .select-t {
    width: 180px * $NumWidth;
  }

  .select-b {
    width: 270px * $NumWidth;
  }
}

.card-box-m {
  padding: 16px * $NumWidth 0;

  .card-box-descript {
    height: 108px * $NumWidth;
    border-radius: 5px * $NumWidth;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    text-align: center;

    p {
      padding-top: 20px * $NumWidth;
      margin-bottom: 12px * $NumWidth;
      font-size: 20px * $NumWidth;
      white-space: nowrap;
    }

    span {
      font-size: 28px * $NumWidth;
      font-weight: 600;
    }

  }
}


</style>
