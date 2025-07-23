<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="请选择日期范围"
            end-placeholder="请选择日期范围"
            @change="selectedTime"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
       
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>

        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-download"
            >导出</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import { getDate } from "@/utils/index";
export default {
  components: {
    getDepartmentSelect,
    getPositionList,
    getVehicleSelectTree,
    getSelectDictionaries,
    getmaintaindep,
    getCarcodeSelectTree,
  },
  data() {
    return {
      activeIndex: "1",
      carOptions: [
        { value: "1", label: "车牌号" },
        { value: "2", label: "自编号" },
      ],
      options: [
        { value: "1", label: "报修日期" },
        { value: "2", label: "接修日期" },
        { value: "3", label: "完工日期" },
        { value: "4", label: "出厂日期" },
      ],
      isContainEmp: false, //是否显示部门下的人员
      departmentList: [], //部门
      priorityList: [
        //工种属性
        { value: "1", name: "一般" },
        { value: "2", name: "紧急" },
        { value: "3", name: "非常紧急" },
      ],
      staffStatusOptions: [
        //状态
        {
          value: "正式",
          label: "一般维修",
          children: [
            {
              value: "yizhi",
              label: "一保",
            },
            {
              value: "fankui",
              label: "二保",
            },
            {
              value: "2",
              label: "回厂小修",
            },
            {
              value: "3",
              label: "白天抢修",
            },
            {
              value: "5",
              label: "夜间抢修",
            },
            {
              value: "4",
              label: "三包服务",
            },
          ],
        },
        { value: "借用", label: "借用" },
        { value: "停薪留职", label: "停薪留职" },
        { value: "长假", label: "长假" },
        { value: "内退", label: "内退" },
      ],
      jobOptions: [
        //岗位
      ],
      employmentFormOptions: [
        //用工形式
        { value: "全日制", name: "全日制" },
        { value: "全日制外地就业", name: "全日制外地就业" },
        { value: "方正派遣工", name: "方正派遣工" },
        { value: "汇才派遣工", name: "汇才派遣工" },
        { value: "返聘", name: "返聘" },
      ],
      date: [],
      form: {
        maint_dept: "",
        vehicle_ids: "",
        priority: "",
        date_type: "1",
        car_type: "1",
        work_code: "",
        type_child: "",
        state: "",
        state_child: "",
        // hour_ma
        // i_department_base: [],
        // c_work_kind: "",
        // c_job_type: "",
        // i_position_id: "",
        // c_employee_type: "",
        start_date: "",
        end_date: "",
      },
    };
  },
  mounted() {

  },
  methods: {
    onSetTime(type = "lastOneWeek") {
      let timeObj = getDate(type);
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime]);
      this.form.start_date = this.date[0];
      this.form.end_date = this.date[1];
      console.log(this.date);
    },
    handleSelect(key, keyPath) {
      this.form.state_child = "";
      console.log(key, keyPath);
      if (keyPath[1] > 3) {
        this.form.state = 2;
        this.form.state_child = key;
      } else {
        this.form.state = key - 1;
      }
      // this.form.state_child = keyPath
      this.onSubmit();
    },
    deleteSelect() {
      this.$emit("delete-select");
    },
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.start_date = this.date[0];
        this.form.end_date = `${this.date[1]} 23:59:59`;
      } else {
        this.form.start_date = "";
        this.form.end_date = "";
      }
      console.log(this.form.end_date);
    },
    onSelectChange(vehs, nodes) {
      // alert(JSON.stringify(nodes))
      if (nodes && nodes.length > 0) {
        // nodes.forEach((item, index) => {
        //   delete item.children;
        // });
        // this.ruleForm.reminders = nodes;
      } else {
        // this.ruleForm.reminders = [];
      }
    },

    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      // if(info.i_department_base.length == 0) {
      //   delete info.i_department_base
      // }
      // if(this.form.i_position_id === 0) {
      //   info.i_position_id = 0
      // }
      // console.log(info)
      // return
      this.$emit("on-ok", info);
    },
    refreshTableList() {
      this.Reset();
    },
    // 重置
    Reset() {
      (this.form.maint_dept = ""),
        (this.form.vehicle_ids = ""),
        (this.form.priority = ""),
        (this.form.date_type = ""),
        (this.form.car_type = "1"),
        (this.form.work_code = ""),
        (this.form.type_child = ""),
        (this.form.start_date = ""),
        (this.form.end_date = ""),
        (this.date = []),
        (this.form.hour_min = "");
        (this.form.hour_max = "");
      // 清空部门选中

      this.$refs.vehicleTree.onClear();
      console.log(this.form.type_child, "13");
      this.onSubmit();
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
