<template>
  <el-form :inline="true" size="mini">
    <el-form-item label="完工时间">
      <el-date-picker
        v-model="date"
        type="daterange"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end_date-placeholder="结束日期"
        :clearable="false"
        @change="selectedTime"
        :picker-options="pickerOptions">
    </el-date-picker>
    </el-form-item>
    <el-form-item label="维修车间/班组:">
      <get-department-select
        ref="baseTree"
        :isShowCheckbox="false"
        :funcType="2"
        :placeholder="'选择维修单元'"
        v-model="form.shop_id"
        :isExportMultiple="false"
      ></get-department-select>
    </el-form-item>
    <el-form-item label="修理工:">
      <el-select
        v-model="form.repair_person_ids"
        clearable
        multiple
        filterable
        placeholder="请选择"
      >
        <el-option
          v-for="item in repair_men"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="车辆:">
      <get-vehicle-select-tree
        ref="vehicle_id"
        width="360"
        :placeholder="'自编号/车牌号'"
        :isShowCheckbox="true"
        v-model="form.vehicle_ids"
      >
      </get-vehicle-select-tree>
    </el-form-item>
    <el-form-item label="维修工单号:">
      <el-input
        v-model="form.work_code"
        placeholder="请输入维修工单号"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item label="维修项目:">
      <el-input
        v-model="form.repair_item"
        placeholder="请输入维修项目"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="" icon="el-icon-refresh-right" @click="resetForm()">重置</el-button>
    </el-form-item>
    <el-form-item>
      <el-button icon="el-icon-download" @click="onBtn('export')" v-if="$isPowerShow('export')">导出</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="checkInfoList('check')">批量审核</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="checkInfoList('recheck')">反审核</el-button>
    </el-form-item>
    <div style="float: right; height: 47px; display: flex;align-items: center;">
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
    <p style="font-size: 12px; color: #999;">只有已完成的工单会展示在表格中。如果一个维修项目中含有多个维修人员时，总工时会平均分配给每个维修人员，对于分配到的工时，若小于0.5小时，则自动调整为0.5小时。如5个工时分配给4个人，每人1.5工时。</p>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getMaterialSelect from "./get-material-select";
import getDepartmentSelect from "./get-department-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import {getDate} from '@/utils/index'
export default {
  components: {
    getMaterialSelect,
    getDepartmentSelect,
    getVehicleSelectTree
  },
  data() {
    return {
      date: [],
      form: {
        shop_id: '',
        start_date: '',
        end_date: '',
        repair_person_ids: [],
        vehicle_ids: [],
        work_code: '',
        repair_item: '',
        repair_item_id: ''
      },
      repair_men: [],
      minDate: new Date(),
      maxDate: new Date(),
      pickerOptions: {
        disabledDate:(time)=> {
          let front = new Date(this.minDate.getTime() - 86400000 * 366)
          let end = new Date(this.maxDate.getTime() + 86400000 * 366)
          return !(front < time && time < end);
        },
        onPick:(obj)=> {
          this.minDate = (!!obj && obj.minDate) || new Date()
          this.maxDate = (!!obj && obj.maxDate) || this.minDate
        }
      },
    }
  },
  mounted() {
    this.onSetTime()
    this.getRepairperson()
    this.$nextTick(() => {
      this.onSubmit()
    })
  },
  methods: {
    onSetTime(type = 'thisMonth') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.start_date = this.date[0]
      this.form.end_date = this.date[1]
    },
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.date = this.$addTime(this.date)
        this.form.start_date = this.date[0];
        this.form.end_date = this.date[1];
      }else{
        this.form.start_date = '';
        this.form.end_date = '';
      }
    },
    //获取维修工人员
    getRepairperson(){
      let params = {};
      this.$client.getPersonsMaintRepairReport(params).then((res) => {
        if (res.head.result == "200") {
          this.repair_men = res.context;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      });
    },
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
    checkInfoList(type) {
      this.$emit(`on-check`, type);
    },
    // 刷新列表
    refreshTableList() {
      this.onSubmit()
    },
    // 重置
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);

    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$emit('open-setting-page')
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
