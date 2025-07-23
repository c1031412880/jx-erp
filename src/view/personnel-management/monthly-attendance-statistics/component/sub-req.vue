<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="考勤时间:">
          <!-- <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
            :picker-options="pickerOptions"
            :clearable="false"
          ></el-date-picker> -->
          <el-date-picker
            v-model="form.year_month"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择月份"
            :picker-options="pickerOptions"
            :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="人员范围:">
          <el-select v-model="form.range" @change="selectedRange" clearable placeholder="请选择">
            <el-option
              v-for="item in personnelRangeOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门选择:" v-show="form.range == 1">
          <get-department-select
            v-if="form.range == 1"
            ref="orgTree"
            v-model="form.dept_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择部门'"
            :isContainEmp="false"
            :isExportMultiple="true"
            :isCheckStrictly="false"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="员工选择:" v-show="form.range == 2">
          <get-user-select
            v-if="form.range == 2"
            ref="personalTree"
            v-model="user_indexs"
            :isShowCheckbox="true"
            :placeholder="'请选择员工'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="true"
            :isCheckStrictly="false"
            @on-change="onSelectChange"
          ></get-user-select>
        </el-form-item>
        <el-form-item label="已离职人员选择:" v-if="form.range == 3">
          <el-select v-model="form.user_ids" multiple filterable collapse-tags placeholder="请选择">
            <el-option
              v-for="item in leaveStaffData"
              :key="item.i_id"
              :label="item.c_name"
              :value="item.i_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考勤组选择:" v-if="form.range == 4">
          <el-select v-model="form.kqz_id"  filterable placeholder="请选择">
            <el-option
              v-for="item in oaKqzGroupsData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="contain_dimission">
          <el-checkbox v-model="form.contain_dimission">是否包含90天内离职人员</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-download"  @click="onBtn('export')" v-if="$isPowerShow('export')">导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="legend-row">
      <span class="legend-item rest">休息：<span class="color-block rest"></span></span>
      <span class="legend-item leave">请假：<span class="color-block leave"></span></span>
      <span class="legend-item travel">出差：<span class="color-block travel"></span></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getUserSelect from "@/components/base/formModel/tree/get-department-select-tree2";
export default {
  components: {
    getDepartmentSelect,
    getUserSelect
  },
  data() {
    return {
      date: [],
      minDate: new Date(),
      maxDate: new Date(),
      // pickerOptions: {
      //   disabledDate:(time)=> {
      //     let front = new Date(this.minDate.getTime() - 86400000 * 31)
      //     let end = new Date(this.maxDate.getTime() + 86400000 * 31)
      //     return !(front < time && time < end);
      //   },
      //   onPick:(obj)=> {
      //     this.minDate = (!!obj && obj.minDate) || new Date()
      //     this.maxDate = (!!obj && obj.maxDate) || this.minDate
      //   }
      // },
      pickerOptions: {
        // // 只能选中当前月及以前的时间
        // disabledDate: (time) => {
        //   // 设置最小日期为2020-12-31
        //   const minDate = new Date(2020, 11, 31); 
          
        //   // 获取当前日期并设置为当月最后一天
        //   const now = new Date();
        //   const maxDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          
        //   // 禁用不在范围内的日期
        //   return time.getTime() < minDate || time.getTime() > maxDate;
        // },
      },
      leaveStaffData:[],
      oaKqzGroupsData:[],
      personnelRangeOption: [{
        value: 0,
        label: '全公司'
      }, {
        value: 1,
        label: '部门选择'
      }, {
        value: 2,
        label: '员工选择'
      }, {
        value: 3,
        label: '已离职员工选择'
      }, {
        value: 4,
        label: '考勤组'
      }],
      form: {
        start: '',
        end: '',
        range: 0,
        year_month: '',
        user_ids:[],
        dept_ids:[],
        kqz_id:'',
        contain_dimission: true
      },
      user_indexs: []
    };
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
    this.reqLeaveStaff()
    this.getByPageOaKqz()
  },
  methods: {
    onSelectChange(vehs, nodes) {
      if (vehs && vehs.length > 0) {
        this.form.user_ids = vehs.map(item => {
          return Number(item.split('_')[1])
        });
      } else {
        this.form.user_ids = []
      }
    },
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.form.year_month = timeObj.startTime.split('-')[0] + '-' + timeObj.startTime.split('-')[1]
      // this.date = [timeObj.startTime, this.setDate()]
    },
    setDate() {
      let today = '';
      let date = new Date();
      let Y = date.getFullYear();
      let M = date.getMonth() + 1 < 10? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      today = Y + "-" + M + "-" + D;
      return today
    },
    reqLeaveStaff(){
      let params = {
        i_emp_state : 0
      };
      this.$client.getEmployeeManageList(params)
        .then(res => {
          if (res.head.result == "200") {
            this.leaveStaffData = res.context.list;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    getByPageOaKqz() {
      let params = {
        context:{}
      }
      this.$client.GetByPageOaKqz(params)
        .then(res => {
          if (res.head.result == "200") {
            this.oaKqzGroupsData = res.context.list;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    selectedRange(val) {
      this.form.dept_ids = [];
      this.form.user_ids = [];
      this.form.kqz_id = ''
    },
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      if(this.date && this.date.length > 0) {
        info.start = this.$addTime(this.date)[0]
        info.end = this.$addTime(this.date)[1]
      }
      delete info.range
      if(!!info.dept_ids && info.dept_ids.length == 0) {
        delete info.dept_ids
      }
      if(!!info.user_ids && info.user_ids.length == 0) {
        delete info.user_ids
      }
      if(this.form.contain_dimission) {
        info.is_dimission = 1
      }else{
        info.is_dimission = 2
      }
      delete info.contain_dimission
      this.$emit("on-ok", info);
    },
    resetForm() {
      this.date = [];
      this.form.start = 0;
      this.form.end = 0;
      this.form.range = 0;
      this.form.dept_ids = [];
      this.form.user_ids = [];
      this.form.contain_dimission = true
      this.form.kqz_id = '';
      this.onSetTime();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    onBtn(type) {
      this.$emit('on-' + type);     
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.legend-row {
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 24px;
}
.legend-item {
  font-size: 15px;
  display: flex;
  align-items: center;
}
.color-block {
  display: inline-block;
  width: 40px;
  height: 28px;
  margin-right: 4px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}
.color-block.rest {
  background: #b6f5a8;
}
.color-block.leave {
  background: #ffd59e;
}
.color-block.travel {
  background: #8fd6ff;
}
</style> 