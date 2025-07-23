<template>
  <el-form :inline="true" size="mini">
    <el-row>
      <el-form-item label="安装日期">
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
      <el-form-item label="制造编号">
        <el-input v-model="form.manufacturing_number" clearable></el-input>
      </el-form-item>
      <el-form-item label="充气介质" prop="charging_mediums">
        <get-select-dictionaries
          style="width: 100%"
          v-model="form.charging_mediums"
          :classKey="'充气介质'"
          :placeholder="'请选择充气介质'"
          clearable
          :isMultiple="true"
        ></get-select-dictionaries>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="onBtn('inspect')" v-if="$isPowerShow('inspect')">批量检验</el-button>
      </el-form-item>
    </el-row>
    <el-row>
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
      <el-form-item label="制造单位" prop="manufacturers">
        <get-select-dictionaries
          style="width: 100%"
          v-model="form.manufacturers"
          :classKey="'制造单位'"
          :placeholder="'请选择制造单位'"
          clearable
          :isMultiple="true"
        ></get-select-dictionaries>
      </el-form-item>
      <el-form-item label="下次检验日期">
        <el-date-picker
          v-model="date2"
          type="daterange"
          range-separator="至"
          start-placeholder="选择开始日期"
          end-placeholder="选择结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="selectedTime2">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="停用情况">
        <el-select v-model="form.discontinued_record" placeholder="请选择" clearable>
          <el-option label="使用中" :value="false"></el-option>
          <el-option label="停用" :value="true"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onBtn('add')">添加气瓶</el-button>
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
        <el-popconfirm
          @confirm="onBtn('stop')"
          title="确定停用选择数据吗？"
          v-if="$isPowerShow('stop')">
            <el-button type="primary" slot="reference" size="mini">停用</el-button>
        </el-popconfirm>
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
        manufacturing_number: '',
        start_date: '',
        end_date: '',
        next_check_time: '',
        next_check_end_time: '',
        vehicle_ids: [],
        charging_mediums: [],
        manufacturers: [],
        discontinued_record: '',
        dept_ids: []
      },
      date: [],
      date2: [],
      options: [],
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
      // this.date = this.$addTime([timeObj.startTime, timeObj.endTime]);
      // this.form.start_date = this.date[0];
      // this.form.end_date = this.date[1];

      this.date2 = this.$addTime([timeObj.startTime, timeObj.endTime]);
      this.form.next_check_time = this.date2[0];
      this.form.end_time1 = this.date2[1];
    },
    // 修改时间
    selectedTime() {
      if (this.date && this.date.length > 0) {
        this.form.start_date = this.date[0];
        this.form.end_date = this.date[1] + ' 23:59:59'
      } else {
        this.form.start_date = "";
        this.form.end_date = "";
      }
    },
    selectedTime2() {
      if (this.date2 && this.date2.length > 0) {
        this.form.next_check_time = this.date2[0];
        this.form.next_check_end_time = this.date2[1] + ' 23:59:59'
      } else {
        this.form.next_check_time = "";
        this.form.next_check_end_time = "";
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
      this.$emit("on-ok", this.form);
    },
    resetForm() {
      this.$refs.vehicleTree.onClear()
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