<template>
  <el-form :inline="true" size="mini">
    <el-row>
      <el-form-item label="车辆:">
        <get-vehicle-select-tree
          ref="vehicleTree"
          :placeholder="'选择车辆'"
          :width="'200'"
          :isShowCheckbox="true"
          v-model="form.vehicle_ids"
        >
        </get-vehicle-select-tree>
      </el-form-item>
      <!-- <el-form-item label="车辆型号">
        <el-input v-model="form.model_ids" clearable></el-input>
      </el-form-item> -->
      <el-form-item label="压力表编号">
        <el-input v-model="form.gage_code" clearable></el-input>
      </el-form-item>
      <el-form-item label="制造商" prop="produce">
        <get-select-dictionaries
          style="width: 100%"
          v-model="form.produce"
          :classKey="'制造商'"
          :placeholder="'请选择制造商'"
          clearable
          :isMultiple="true"
        ></get-select-dictionaries>
      </el-form-item>
      <el-form-item label="分公司">
        <el-select v-model="form.dept_ids" placeholder="请选择" multiple>
          <el-option
            v-for="item in branchOffice"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
    </el-row>
    <el-row>
      <el-form-item label="最近一次校准日期">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="选择开始日期"
          end-placeholder="选择结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="selectedTime">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="建议复校日期">
        <el-date-picker
          v-model="nextDate"
          type="daterange"
          range-separator="至"
          start-placeholder="选择开始日期"
          end-placeholder="选择结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="selectedNextTime">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onBtn('add')">添加压力表</el-button>
      </el-form-item>
      <el-form-item>
      <el-popconfirm
        @confirm="onBtn('del')"
        title="确定删除选择数据吗？"
        v-if="$isPowerShow('del')">
          <el-button type="primary" slot="reference" size="mini" >删除</el-button>
        </el-popconfirm>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onBtn('import')">导入</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onBtn('export')" icon="el-icon-download">导出</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onBtn('inspect')" v-if="$isPowerShow('inspect')">批量检验</el-button>
      </el-form-item>
    </el-row>

   
  </el-form>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: {
    getVehicleSelectTree,
    getSelectDictionaries
  },
  data() {
    return {
      form: {
        vehicle_ids: [],
        model_ids: '',
        gage_code: '',
        produce: [],
        start_time: '',
        end_time: '',
        next_check_date_start: '',
        next_check_date_end: '',
        dept_ids: []
      },
      date: [],
      nextDate: [],
      branchOffice: []
    }
  },
  mounted() {
    this.onSetTime()
    this.GetDeptInfoCaches()
    this.onSubmit()
  },
  methods: {
    // 初始化时间
    onSetTime(type = "thisMonth") {
      let timeObj = getDate(type);
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime]);
      this.form.start_time = this.date[0];
      this.form.end_time = this.date[1];

      // this.nextDate = this.$addTime([timeObj.startTime, timeObj.endTime]);
      // this.form.next_check_date_start = this.nextDate[0];
      // this.form.next_check_date_end = this.nextDate[1];
    },
    // 修改时间
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.start_time = this.date[0];
        this.form.end_time = this.date[1] + ' 23:59:59'
      } else {
        this.form.start_time = "";
        this.form.end_time = "";
      }
    },
    selectedNextTime() {
      if (this.nextDate && this.nextDate.length > 0) {
        this.form.next_check_date_start = this.nextDate[0];
        this.form.next_check_date_end = this.nextDate[1] + ' 23:59:59'
      } else {
        this.form.next_check_date_start = "";
        this.form.next_check_date_end = "";
      }
    },
    GetDeptInfoCaches() {
      this.$client.GetDeptInfoCaches({}).then(res => {
        if (res.head.result === '200') {
          this.branchOffice = res.context 
        }
      })
    },
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i] && this.form[i].length > 0) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      this.onSetTime()
      this.onSubmit()
    },
    onBtn(type) {
      this.$emit("on-btn",type);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>