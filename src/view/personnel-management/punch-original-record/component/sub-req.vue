<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="考勤时间:">
          <el-date-picker
            v-model="form.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
            :picker-options="pickerOptions"
            :clearable="false"
          ></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="岗位名称:">
          <el-input v-model="form.c_name" placeholder="搜索岗位名称" clearable></el-input>
        </el-form-item> -->
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
            v-model="form.depts_id"
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
            :show_all="true"
            v-model="user_indexs"
            :isShowCheckbox="true"
            :placeholder="'请选择员工'"
            :isContainEmp="true"
            :isExportMultiple="true"
            :isCheckStrictly="false"
            @on-change="onSelectChange"
          ></get-user-select>
        </el-form-item>
        <el-form-item label="已离职人员选择:" v-if="form.range == 3">
          <el-select v-model="form.users_id" multiple filterable collapse-tags placeholder="请选择">
            <el-option
              v-for="item in leaveStaffData"
              :key="item.i_id"
              :label="item.c_name"
              :value="item.i_id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="考勤组选择:" v-if="form.range == 4">
          <el-select v-model="form.kqzs_id"  filterable placeholder="请选择"  multiple collapse-tags>
            <el-option
              v-for="item in oaKqzGroupsData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item prop="contain_dimission">
          <el-checkbox v-model="form.contain_dimission">是否包含离职人员</el-checkbox>
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
          <el-button type="primary" icon="el-icon-download"  @click="onExport()" v-if="$isPowerShow('export')">导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>
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
      pickerOptions: {
        disabledDate:(time)=> {
          let front = new Date(this.minDate.getTime() - 86400000 * 31)
          let end = new Date(this.maxDate.getTime() + 86400000 * 31)
          // console.log(!(front < time && time < end), formatDateTime(front),formatDateTime(time),formatDateTime(end))
          return !(front < time && time < end);
        },
        onPick:(obj)=> {
          // console.log(obj)
          this.minDate = (!!obj && obj.minDate) || new Date()
          this.maxDate = (!!obj && obj.maxDate) || this.minDate
        }
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
        date: [],
        range: 0,
        users_id:[],
        depts_id:[],
        kqzs_id: [],
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
        this.form.users_id = vehs.map(item => {
          return Number(item.split('_')[1])
        });
      } else {
        this.form.users_id = []
      }
    },
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.form.date = [timeObj.startTime, this.setDate()]
    },
    setDate() {
      let today = '';
      let date = new Date();
      // date.setTime(new Date().getTime());
      let Y = date.getFullYear();
      let M = date.getMonth() + 1 < 10? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      today = Y + "-" + M + "-" + D;
      return today
    },
    // 获取离职员工
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
    // 获取全部的考勤组
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
    // 选择人员范围
    selectedRange(val) {
      this.form.depts_id = [];
      this.form.users_id = [];
      this.form.kqzs_id = []
    },
    // 查询 
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      if(this.form.date && this.form.date.length > 0) {
        info.date = this.$addTime(this.form.date)
      }
      delete info.range
      if(!!info.depts_id && info.depts_id.length == 0) {
        delete info.depts_id
      }
      if(!!info.users_id && info.users_id.length == 0) {
        delete info.users_id
      }
      if(!!info.kqzs_id && info.kqzs_id.length == 0) {
        delete info.kqzs_id
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.form.date = [];
      this.form.start = 0;
      this.form.end = 0;
      this.form.range = 0;
      this.form.depts_id = [];
      this.form.users_id = [];
      this.form.contain_dimission = true
      this.form.kqzs_id = '';
      this.onSetTime();
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    onExport() {
      this.$emit("on-export");     
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
