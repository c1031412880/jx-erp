<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="询价日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择询价开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择询价结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="询价单号:">
          <el-input  clearable v-model="form.ask_order" placeholder="请输入询价单号"></el-input>
        </el-form-item>
        <el-form-item label="供应商:">
          <el-input  clearable v-model="form.supplier_name" placeholder="请输入供应商"></el-input>
          <!-- <el-select placeholder="全部" clearable v-model="form.supplier_name">
            <el-option
              v-for="item in gongysOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="物料编号:">
          <el-input  clearable v-model="form.material_code" placeholder="请输入物料编号"></el-input>
        </el-form-item>
        <el-form-item label="物料名称:">
          <el-input  clearable v-model="form.material_name" placeholder="请输入物料名称"></el-input>
        </el-form-item>
        <el-form-item label="规格型号:">
          <el-input  clearable v-model="form.spec" placeholder="请输入规格型号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button  @click="Reset" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onExport()" type="primary">导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('add')" type="primary">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-popconfirm
            v-if="$isPowerShow('del')"
            title="确定删除勾选中的信息吗？"
            @confirm="onBtn('del')">
            
            <el-button slot="reference" type="primary">删除</el-button>
          </el-popconfirm>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
export default {
  data() {
    return {
      date: [],
      form: {
        ask_date_start: '',
        ask_date_end: '',
        enter_num: '',
        supplier_name: '',
        material_code: '',
        material_name: '',
        spec: '',
      },
    };
  },
  mounted() {
    this.onSetTime()
    // this.getwuzi()
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.ask_date_start = this.date[0]
      this.form.ask_date_end = this.date[1]
    },
    selectedTime() {
      // alert(JSON.stringify(this.form.call_time))
      if(!!this.date && this.date.length > 0) {
        this.form.ask_date_start = this.$addTime(this.date)[0]
        this.form.ask_date_end = this.$addTime(this.date)[1]
      }else{
        this.date = []
        this.form.ask_date_start = ''
        this.form.ask_date_end = ''
      }
    },
    getwuzi(){
      this.$client.getMaterialPage({usable:1}).then(req => {
          if (req.head.result === '200') {
          this.wuziOptions = req.context.list
        }
        else{
          this.$message({type: 'error', message: '获取失败'})
        }
      })
    },
    onExport(){
      this.$emit("on-export");
    },
    onSubmit() {
      let info = this.$outFormData(this.form)
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(){
      Object.assign(this.$data, this.$options.data())
      this.onSubmit()
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
