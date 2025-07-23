<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-input v-model="form.c_name" placeholder="员工姓名" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <get-department-select
            ref="tree"
            v-model="form.i_department_base"
            :isContainEmp="isContainEmp"
            @on-change="onSelectChange"
          ></get-department-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.c_work_kind" clearable placeholder="工种属性">
            <el-option
              v-for="item in typeWorkProperties"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.c_job_type" clearable placeholder="状态">
            <el-option
              v-for="item in staffStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <get-position-list v-model="form.i_position_id"></get-position-list>
        </el-form-item>
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
        </el-form-item>
        <el-form-item>
          <el-button  @click="Reset" icon="el-icon-refresh-left"
            >重置</el-button
          >
        </el-form-item>
          <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" v-if="$isPowerShow('add')"
            >添加员工</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('import')" icon="el-icon-upload2" v-if="$isPowerShow('import')"
            >导入</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
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
  components: { getDepartmentSelect, getPositionList},
  data() {
    return {
      isContainEmp: false, //是否显示部门下的人员
      departmentList:[], //部门
      typeWorkProperties:[ //工种属性
        { value: "管理人员", name: "管理人员" },
        { value: "其他", name: "其他" },
      ],
      staffStatusOptions:[ //状态
        { value: "正式", name: "正式" },
        { value: "借用", name: "借用" },
        { value: "停薪留职", name: "停薪留职" },
        { value: "长假", name: "长假" },
        { value: "内退", name: "内退" },
      ],
      jobOptions: [ //岗位
        
      ],
      employmentFormOptions: [ //用工形式
        { value: "全日制", name: "全日制" },
        { value: "全日制外地就业", name: "全日制外地就业" },
        { value: "方正派遣工", name: "方正派遣工" },
        { value: "汇才派遣工", name: "汇才派遣工" },
        { value: "返聘", name: "返聘" },
      ],
      date: [],
      form: {
        c_name:"",
        i_department_base: [],
        c_work_kind: "",
        c_job_type: "",
        i_position_id: "",
        c_employee_type: "",
        begin: "",
        end: "",
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
      if(info.i_department_base.length == 0) {
        delete info.i_department_base
      }
      if(this.form.i_position_id === 0) {
        info.i_position_id = 0
      }
      // console.log(info)
      // return
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(){
      this.form.c_name = '',
      this.form.i_department_base = [],
      this.form.c_work_kind = '',
      this.form.c_job_type = '',
      this.form.i_position_id = '',
      this.form.c_employee_type = '',
      this.form.begin = '',
      this.form.end = '',
      this.date = [],
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
