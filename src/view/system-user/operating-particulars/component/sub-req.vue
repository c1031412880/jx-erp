<template>
  <el-form :model="form" inline size="mini">
    <el-row :gutter="20">
      <el-col :span="18">
        <el-form-item label="操作日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="请选择日期范围"
            end-placeholder="请选择日期范围"
            @change="selectedTime"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作类型:">
          <el-select v-model="form.type" clearable>
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="功能名称:">
          <menu-tree ref="menuTree" @node-click="nodeClick"></menu-tree>
        </el-form-item>
        <el-form-item label="操作平台:">
          <el-select v-model="form.platform">
            <el-option
              v-for="(item,index) in platformOptions"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作人员:">
            <el-input v-model="form.user_name" placeholder="请输入操作人员" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item>
          <el-button icon="el-icon-search" @click="onBtn('query')" type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-refresh-left" @click="resetForm()" type="primary">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-download" @click="onBtn('export')" type="primary">导出</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import menuTree from "./menu-tree.vue"
import { getDate } from "@/utils/index"
export default {
  data() {
    return {
      form: {
        begin: '',
        end: '',
        type: '',
        func_names: [],
        platform: '',
        user_name: ''
      },
      date: [],
      options: [{
        value: '1',
        label: '新增'
      }, {
        value: '2',
        label: '修改'
      }, {
        value: '3',
        label: '删除'
      }, {
        value: '4',
        label: '导入'
      }, {
        value: '5',
        label: '导出'
      }, {
        value: '6',
        label: '作废'
      }, {
        value: '7',
        label: '登录'
      },],
      platformOptions: [{
        value: '',
        label: '全部'
      }, {
        value: 'ERP',
        label: 'ERP'
      }, {
        value: '企业App',
        label: '企业APP'
      }, {
        value: '综合服务平台',
        label: '综合服务平台'
      }, {
        value: '维修App',
        label: '维修APP'
      }]
    }
  },
  components: {
    menuTree
  },
  mounted() {
    this.onSetTime()
    this.onBtn('query')
  },
  methods: {
    onBtn(method) {
      this.$emit(`on-${method}`, this.form)
    },
    resetForm() {
      Object.assign(this.$data, this.$options.data())
      this.onSetTime()
      this.$refs.menuTree.onClear()
      this.onBtn('query')
    },
    onSetTime() {
      let time = getDate("lastOneWeek")
      this.date = this.$addTime([time.startTime, time.endTime])
      this.form.begin = this.date[0]
      this.form.end = this.date[1]
    },
    selectedTime() {
      if (!!this.date && this.date.length > 0) {
        this.form.begin = this.$addTime(this.date)[0]
        this.form.end = this.$addTime(this.date)[1]
      } else {
        this.date = []
        this.form.begin = ''
        this.form.end = ''
      }
    },
    nodeClick(codes) {
      this.form.func_names = codes
    }
  }
}
</script>