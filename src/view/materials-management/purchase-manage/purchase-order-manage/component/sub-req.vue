<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="采购日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择采购开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择采购结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="采购单编号:">
          <el-input v-model="form.purchase_code" placeholder="请输入采购单编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="采购组织:">
          <get-department-select
            ref="departmentlTree"
            v-model="form.purchase_dept"
            :width="'220'"
            :isShowCheckbox="false"
            :placeholder="'请选择组织'"
            :isContainEmp="false"
            :isExportMultiple="false"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="供应商:">
          <el-input clearable v-model="form.supplier_name" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="采购员:">
          <get-department-select
            ref="personalTree"
            v-model="form.purchase_user"
            :width="'220'"
            :show_all="true"
            :isShowCheckbox="false"
            :placeholder="'请选择采购人'"
            :isContainEmp="true"
            :isExportMultiple="false"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="入库状态:">
          <el-select v-model="form.enter_state" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value" v-bind="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button  @click="Reset" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('add')" type="primary">添加采购单</el-button>
        </el-form-item>
        <el-form-item v-if="isDel">
          <el-popconfirm
            v-if="isCheck"
            title="确定删除勾选中的信息吗？"
            @confirm="onBtn('del')">
            <el-button slot="reference" type="primary">删除</el-button>
          </el-popconfirm>
          <el-button v-else disabled type="primary">删除</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import GetDeptEmpSelectTree from "@/components/base/formModel/tree/get-dept-emp-select-tree";

export default {
  components: {GetDeptEmpSelectTree, getDepartmentSelect},
  props: {
    isDel: {
      type: Boolean,
      default: false
    },
    isCheck: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      date: [],
      form: {
        purchase_code: '',
        purchase_user: '',
        supplier_name: '',
        purchase_dept: '',
        enter_state: '',
        begin: '',
        end: ''
      },
      typeOptions: [
        {label: '未入库', value: 1},
        {label: '部分入库', value: 2},
        {label: '已入库', value: 3},
      ],
      gongysOptions: []
    };
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    //供应商
    getGinsang(){
      this.$client.GetProviderPage().then(req => {
        if (req.head.result === '200') {
          this.gongysOptions = req.context.list
        }
        else{
          this.$message({type: 'error', message: '获取失败'})
        }
      })
    },
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.begin = this.date[0]
      this.form.end = this.date[1]
    },
    selectedTime() {
      // alert(JSON.stringify(this.form.call_time))
      if(!!this.date && this.date.length > 0) {
        this.form.begin = this.$addTime(this.date)[0]
        this.form.end = this.$addTime(this.date)[1]
      }else{
        this.date = []
        this.form.begin = ''
        this.form.end = ''
      }
    },
    onExport(){
      let info = this.$outFormData(this.form)
      console.log(this.form, info)
      this.$emit("on-export", info);
    },
    onSubmit() {
      let info = this.$outFormData(this.form)
      console.log(this.form, info)
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(){
      Object.assign(this.$data.form, this.$options.data().form)
      this.$refs.departmentlTree.onClear()
      this.$refs.personalTree.onClear()
      this.onSetTime()
      this.onSubmit()
    },
    onBtn(com) {
      // if (com === 'del' && !this.isCheck) {
      //   return this.$message({message: '请至少选择一行数据删除！', type: 'warning'});
      // }
      this.$emit("on-" + com);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
