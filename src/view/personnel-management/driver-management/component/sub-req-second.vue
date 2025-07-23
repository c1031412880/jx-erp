<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-input v-model="form.c_name" placeholder="驾驶员姓名" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
         <get-department-select
            ref="tree"
            :isContainEmp="isContainEmp"
            v-model="form.i_department_base"
            @on-change="onSelectChange"
            :funcType="1"
          ></get-department-select>
        </el-form-item>
        <!-- <el-form-item>
          <el-select v-model="form.i_vehicle_id" clearable placeholder="选择车辆">
            <el-option
              v-for="item in vehData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.i_line_id" clearable placeholder="选择路线">
            <el-option
              v-for="item in vehData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-date-picker
            v-model="date1"
            type="daterange"
            range-separator="至"
            start-placeholder="进单位开始日期"
            end-placeholder="进单位结束日期"
            @change="selectedTime1"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.i_job_state" clearable placeholder="状态">
            <el-option
              v-for="item in staffStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item>
          <get-position-list v-model="form.i_position_id"></get-position-list>
        </el-form-item> -->
        <el-form-item>
          <el-select v-model="form.c_employee_type" clearable placeholder="用工形式">
            <el-option
              v-for="(item,index) in employmentFormOptions"
              :key="index"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

         <!-- <el-form-item>
          <el-select v-model="form.is_have_line" clearable placeholder="选择是否分配路线驾驶员">
            <el-option
              v-for="(item,index) in isHaveLineOptions"
              :key="index"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item>
          <el-select v-model="form.is_add_record" clearable placeholder="选择是否填写驾驶员档案">
            <el-option
              v-for="(item,index) in isAddRecordOptions"
              :key="index"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="劳务合同开始日期"
            end-placeholder="劳务合同结束日期"
            @change="selectedTime"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
          <el-button  @click="Reset" icon="el-icon-refresh-left"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus"
            >添加驾驶员</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('import')" icon="el-icon-upload2"
            >导入</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-download"
            >导出</el-button
          >
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" icon="" @click="onSubmit"
            >人员路线分配</el-button
          >
          <el-button type="primary" icon="" @click="onSubmit"
            >添加驾驶档案</el-button
          >
        </el-form-item> -->
        <div style="float: right; height: 47px; display: flex">
          <i
            class="el-icon-s-tools"
            style="cursor: pointer"
            @click="openSettingPage()"
          ></i>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getPositionList from "@/components/base/formModel/select/get-position-list";
export default {
  components: {
    getDepartmentSelect,
    getPositionList
  },
  data() {
    return {
      isContainEmp: false, //是否显示部门下的人员
      vehData: [
        { id: 1, name: "101" },
        { id: 2, name: "102" },
        { id: 3, name: "103" },
      ],
      departmentList:[], //部门
      typeWorkProperties:[ //工种属性
        { value: "管理人员", name: "管理人员" },
        { value: "其他", name: "其他" },
      ],
      staffStatusOptions:[ //状态
        // { value: "正式", name: "正式" },
        // { value: "借用", name: "借用" },
        // { value: "停薪留职", name: "停薪留职" },
        // { value: "长假", name: "长假" },
        // { value: "内退", name: "内退" },
        { value: 1, name: "在编在岗" },
        { value: 2, name: "在编不在岗" },
      ],
      employmentFormOptions: [ //用工形式
        // { value: "全日制", name: "全日制" },
        // { value: "全日制外地就业", name: "全日制外地就业" },
        // { value: "方正派遣工", name: "方正派遣工" },
        // { value: "汇才派遣工", name: "汇才派遣工" },
        // { value: "返聘", name: "返聘" },
        { value: "集团编制", name: "集团编制" },
        { value: "劳务派遣", name: "劳务派遣" },
      ],
      isHaveLineOptions:[
        { value: "-1", name: "全部" },
        { value: "0", name: "未分配" },
        { value: "1", name: "已分配" },
      ],
      isAddRecordOptions:[
        { value: "-1", name: "全部" },
        { value: "0", name: "未添加" },
        { value: "1", name: "已添加" },
      ],
      date1: [],
      date: [],
      form: {
        c_name:"",
        i_department_base: [],
        d_join_company:[],
        i_vehicle_id: "",
        i_line_id:"",
        c_work_kind: "",
        i_job_state: "",
        i_position_id: "",
        c_employee_type: "",
        begin: "",
        end: "",
        is_have_line: "-1",
        is_add_record: "-1",
      },
    };
  },
  mounted() {
  },
  methods: {
    selectedTime: function() {
      // alert(111)
      if(this.date && this.date.length>0) {
        this.form.begin = this.date[0];
        this.form.end = this.date[1];
      }else{
        this.form.begin = '';
        this.form.end = '';
      }
    },
    selectedTime1: function() {
      this.form.d_join_company = this.date1? this.$addTime(this.date1) : [];
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
        if (this.form[i] && this.form[i] != "-1") {
          info[i] = this.form[i];
        }
      }
      if(info.i_department_base.length == 0) {
        delete info.i_department_base
      }
      if(!!info.d_join_company &&　info.d_join_company.length == 0) {
        delete info.d_join_company
      }
      // console.log(info)
      // return 
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(){
      this.form.c_name = ""
      this.form.i_department_base = []
      this.form.d_join_company = []
      this.form.i_vehicle_id = ''
      this.form.i_line_id = ''
      this.form.c_work_kind = ''
      this.form.i_job_state = ''
      this.form.i_position_id = ''
      this.form.c_employee_type = ''
      this.form.begin = ''
      this.form.end = ''
      this.form.is_have_line = '-1'
      this.form.is_add_record = '-1'
      this.date = []
      this.date1 = []
      // 清空部门选中
      this.$refs.tree.onClear()
      this.onSubmit()
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
