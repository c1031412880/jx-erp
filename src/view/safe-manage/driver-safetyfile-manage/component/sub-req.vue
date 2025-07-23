<template>
  <div>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item prop="type">
          <el-select v-model="form.type" clearable placeholder="请选择" @change="selectChangeType">
            <el-option
              v-for="item in checkOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :prop="formTypeMap[form.type]">
          <el-input
            placeholder="请输入关键字"
            v-model="form[formTypeMap[form.type]]"
          ></el-input>
        </el-form-item>
        <el-form-item prop="org_ids">
          <get-department-select-tree
            ref="departmentTree"
            :placeholder="'所属组织'"
            :isShowCheckbox="true"
            :funcType="1"
            v-model="form.org_ids"
          >
          </get-department-select-tree>
        </el-form-item>
        <!-- <el-form-item prop="i_line_id">
          <get-line-list v-model="form.i_line_id" :placeholder="'所属线路'"></get-line-list>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button  @click="resetForm('form')" icon="el-icon-refresh-left"
            >重置</el-button
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
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" @click="onBtn('add')"
            >添加</el-button
          >
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="dateType">
          <el-select v-model="form.dateType" clearable placeholder="请选择" @change="selectChangeDateType">
            <el-option
              v-for="item in dateOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :prop="formDateTypeMap[form.dateType]">
         <el-date-picker
          v-model="form[formDateTypeMap[form.dateType]]"
          type="daterange"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          range-separator="至"
          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="show_dimission">
         <el-checkbox v-model="show_dimission">显示离职人员</el-checkbox>
        </el-form-item>
        <el-form-item prop="show_black">
          <el-checkbox v-model="show_black">显示黑名单人员</el-checkbox>
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
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelectTree from "@/components/base/formModel/tree/get-department-select-tree";
import getLineList from "@/components/base/formModel/select/get-line-list";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";

export default {
  components: { getDepartmentSelectTree, getLineList, getVehicleSelectTree},
  data() {
    return {
      checkOptions:[
        { value: 1, name: "姓名" },
        { value: 2, name: "工号" },
        { value: 3, name: "联系方式" },
        { value: 4, name: "驾驶证号" },
      ],
      dateOptions:[
        { value: 1, name: "驾驶证到期日期" },
        { value: 2, name: "从业资格证到期日期" },
        { value: 3, name: "劳动合同到期日期" },
        { value: 4, name: "安全责任书到期日期",},
      ],
      formTypeMap:{
        1: 'c_name',
        2: 'c_worker_id',
        3: 'c_phone',
        4: 'c_driving_licence',
      },
      formDateTypeMap:{
        1: 'd_latest_get_licence',
        2: 'd_qualification_end',
        3: 'd_labor_contract',
        4: 'd_safe_duty_end',
      },
      form: {
        type: 1,
        dateType: 1,
        c_name: '',
        c_worker_id: '',
        c_phone: '',
        c_driving_licence: '',
        org_ids: [],
        i_line_id: '',
        d_latest_get_licence: [],
        d_qualification_end: [],
        d_labor_contract: [],
        d_safe_duty_end: [],
        show_dimission: '',
        show_black: ''
      },
      show_dimission: 0,
      show_black: 0
    };
  },
  activated() {
    let driverName = this.$route.params.driverName
    if (driverName) {
      this.form.type = 1
      this.form.c_name = driverName
    }
    if (driverName) {
      this.onSubmit()
    }
  },
  mounted() {
    let driverName = this.$route.params.driverName
    if (driverName) {
      this.form.c_name = driverName
    }
    this.onSubmit()
  },
  methods: {
    selectChangeType() {
      this.form.c_name = '';
      this.form.c_worker_id = '';
      this.form.c_phone = '';
      this.form.c_driving_licence = '';
    },
    selectChangeDateType() {
      this.form.d_latest_get_licence = [];
      this.form.d_qualification_end = [];
      this.form.d_labor_contract = [];
      this.form.d_safe_duty_end = [];
    },
    onSubmit() {
      let info = this.$outFormData(this.form)
      info.show_dimission = !!this.show_dimission? 1 : 0
      info.show_black = !!this.show_black? 1 : 0
      
      delete info.type
      delete info.dateType
      if(info.org_ids.length == 0) {
        delete info.org_ids
      }
      if(info.d_latest_get_licence.length == 0) {
        delete info.d_latest_get_licence
      }
      if(info.d_qualification_end.length == 0) {
        delete info.d_qualification_end
      }
      if(info.d_labor_contract.length == 0) {
        delete info.d_labor_contract
      }
      if(info.d_safe_duty_end.length == 0) {
        delete info.d_safe_duty_end
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm(formName){
      this.show_dimission = 0;
      this.show_black = 0;
      this.form.show_dimission = '';
      this.form.show_black = '';
      this.$refs[formName].resetFields();
      // 清空组织
      this.$refs.departmentTree.onClear();
      this.onSubmit()
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$emit("open-setting-Page")
    },
    // 刷新
    refreshTableList() {
      this.resetForm('form')
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
