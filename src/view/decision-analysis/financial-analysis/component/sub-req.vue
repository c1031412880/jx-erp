<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="月份：">
          <el-date-picker
            v-model="form.month"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            @change="selectedMonth"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="单位：">
          <get-department-select
            ref="baseTree"
            :isContainEmp="isContainEmp"
            :isShowCheckbox="false"
            :funcType="funcType"
            :placeholder="'分公司'"
            :isExportMultiple="false"
            v-model="form.org_id"
            @on-change="selectedDeparment"
          ></get-department-select>
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
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" v-if="$isPowerShow('add')"
            >指标设定</el-button
          >
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: { getDepartmentSelect },
  data() {
    return {
      isContainEmp: false,
      funcType: 1, // 功能类别 1 运营单元 2 维修单元 3 仓储单元
      form: {
        month: '',
        org_id: '',
        department_name: ''
      },
    };
  },
  mounted() {
    this.reqDepartmentInfo();
    // this.setDate();
  },
  methods: {
    reqDepartmentInfo() {
      let params = {
        is_contain_emp: false,
        show_all: false,
        func_type: 1
      }
      this.$client.getUserEmps(params).then((res) => {
          if (res.head.result === "200") {
            if(res.context && res.context.length > 0) {
              this.form.org_id = res.context[0].i_id
              this.setDate();
              this.onSubmit();
            }
          }
        })
    },
    selectedMonth(val) {
      this.form.month = val;
    },
    selectedDeparment(dep_ids, depList) {
      // console.log(dep_ids, depList)
      if(depList.length >0 ) {
        this.form.department_name = depList[0].c_name
      }else{
        this.form.department_name = '温州长安集团'
      }

    },
    // 设置默认为当前月份
    setDate() {
      let date = new Date();
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      this.form.month = Y + '-' + M
    },
    onSubmit() {
      let info = this.$outFormData(this.form)
      if(!this.form.org_id) {
        this.$message({
          showClose: true,
          message:  '公司不能为空',
          type: "warning",
        });
        return
      }
      // console.log(this.form, info)
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(){
      Object.assign(this.$data, this.$options.data());
      this.reqDepartmentInfo();
      setTimeout(() => {
        this.$refs.baseTree.onClear()
      }, 30);
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
