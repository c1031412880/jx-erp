<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="进单位日期:">
          <el-date-picker
            v-model="form.join_company"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="驾驶员:">
           <el-input v-model="form.name" placeholder="请输入驾驶员姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="组织:">
          <get-department-select
            ref="departmentlTree"
            v-model="form.department_base"
            :isShowCheckbox="true"
            :placeholder="'请选择组织'"
            :isContainEmp="false"
            :isExportMultiple="true"
            :funcType="1"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="处理状态:" v-if="activeName != '2'">
          <el-select v-model="form.dispose_condition" placeholder="请选择处理状态" clearable>
            <el-option
              v-for="item in disposeConditionOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
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
          <el-button @click="onAdd()" type="primary" icon="el-icon-plus" v-if="activeName == '1' && $isPowerShow('add')"
            >入职申请</el-button
          >
        </el-form-item>
        <el-form-item v-if="activeName == '1'" >
          <div style="font-size: 12px;font-weight: 400;font-style: normal;color: rgba(51, 51, 51, 0.52156862745098);padding-left: 20px; margin-bottom: 20px;">*说明：审批通过后，驾驶员状态变为“已入职”并自动更新到驾驶员档案中。入职申请记录将保留，无法编辑和删除</div>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree"
export default {
   components: {
    getDepartmentSelect,
  },
  props:{
    activeName: {
      type: String,
      default: "1",
    },
  },
  data() {
    return {
      disposeConditionOptions:[ //处理状态
        { value: 3, name: "审批通过" },
        { value: 4, name: "审批拒绝" },
        { value: 5, name: "已撤销" },
        { value: 2, name: "审批中" },
      ],
      form: {
        join_company: [],
        name:'',
        department_base: [],
        dispose_condition:''
      },
    };
  },
  methods: {
    selectedTime: function() {
      if(!!this.form.join_company && this.form.join_company.length>0) {
        this.form.join_company = this.$addTime(this.form.join_company)
      }else{
        this.form.join_company = []
      }
    },
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.$refs.departmentlTree.onClear();
      Object.assign(this.$data, this.$options.data());
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 添加编辑
    onAdd() {
      this.$emit("on-add");
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
